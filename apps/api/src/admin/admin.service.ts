import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  // ==================== DASHBOARD ANALYTICS ====================

  async getDashboardStats() {
    const [
      totalProgrammes,
      totalFaculties,
      totalDepartments,
      totalUsers,
      totalSubjects,
      totalSearches,
    ] = await Promise.all([
      this.prisma.programme.count(),
      this.prisma.academicUnit.count(),
      this.prisma.department.count(),
      this.prisma.user.count(),
      this.prisma.subject.count(),
      this.prisma.searchHistory.count(),
    ]);

    return {
      totalProgrammes,
      totalFaculties,
      totalDepartments,
      totalUsers,
      totalSubjects,
      totalSearches,
    };
  }

  async getProgrammesByFaculty() {
    const faculties = await this.prisma.academicUnit.findMany({
      include: {
        departments: {
          include: {
            _count: { select: { programmes: true } },
          },
        },
      },
    });

    return faculties.map((f) => ({
      id: f.id,
      name: f.name,
      abbreviation: f.abbreviation,
      departmentCount: f.departments.length,
      programmeCount: f.departments.reduce(
        (acc, d) => acc + d._count.programmes,
        0,
      ),
    }));
  }

  async getPopularSearches(limit: number = 10) {
    const searches = await this.prisma.searchHistory.groupBy({
      by: ['query'],
      _count: { query: true },
      orderBy: { _count: { query: 'desc' } },
      take: limit,
    });

    return searches.map((s) => ({
      query: s.query,
      count: s._count.query,
    }));
  }

  async getRecentSearches(limit: number = 20) {
    return this.prisma.searchHistory.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async getUserStats() {
    const usersByRole = await this.prisma.user.groupBy({
      by: ['role'],
      _count: { role: true },
    });

    const total = usersByRole.reduce((acc, u) => acc + u._count.role, 0);

    return {
      total,
      byRole: usersByRole.map((u) => ({
        role: u.role,
        count: u._count.role,
      })),
    };
  }

  // ==================== PROGRAMME MANAGEMENT ====================

  async getAllProgrammes(
  page: number = 1,
  limit: number = 20,
  search?: string,
  facultyId?: string,
) {
  const skip = (page - 1) * limit;
  const where: any = {};

  if (search?.trim()) {
    const searchTerm = search.trim();

    where.OR = [
      {
        name: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      },
      {
        code: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      },
    ];
  }

  if (facultyId) {
    where.department = {
      academicUnitId: facultyId,
    };
  }

  const [data, total] = await Promise.all([
    this.prisma.programme.findMany({
      where,
      skip,
      take: limit,
      include: {
        degree: true,
        department: {
          include: {
            academicUnit: {
              include: {
                university: true,
                type: true,
              },
            },
          },
        },
        tuition: {
          orderBy: {
            academicYear: 'desc',
          },
          take: 1,
        },
        _count: {
          select: {
            requirements: true,
            careers: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    }),

    this.prisma.programme.count({
      where,
    }),
  ]);

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

  async updateProgramme(
  id: string,
  input: {
    code?: string;
    name?: string;
    degree?: string;
    level?: string;
    duration?: number | string;
    description?: string;
    departmentId?: string;
    isActive?: boolean;
    isFeatured?: boolean;
    featuredOrder?: number | null;
  },
) {
  const existing = await this.prisma.programme.findUnique({
    where: {
      id,
    },
  });

  if (!existing) {
    throw new NotFoundException(
      `Programme with ID "${id}" not found`,
    );
  }

  if (
    input.code !== undefined &&
    input.code.trim() !== existing.code
  ) {
    const duplicate = await this.prisma.programme.findUnique({
      where: {
        code: input.code.trim(),
      },
    });

    if (duplicate && duplicate.id !== id) {
      throw new BadRequestException(
        `Programme with code "${input.code.trim()}" already exists`,
      );
    }
  }

  if (input.departmentId !== undefined) {
    const department = await this.prisma.department.findUnique({
      where: {
        id: input.departmentId,
      },
    });

    if (!department) {
      throw new NotFoundException(
        `Department with ID "${input.departmentId}" not found`,
      );
    }
  }

  const data: any = {
    ...(input.code !== undefined && {
      code: input.code.trim(),
    }),

    ...(input.name !== undefined && {
      name: input.name.trim(),
    }),

    ...(input.level !== undefined && {
      level: input.level as any,
    }),

    ...(input.description !== undefined && {
      description: input.description.trim() || null,
    }),

    ...(input.departmentId !== undefined && {
      departmentId: input.departmentId,
    }),

    ...(input.isActive !== undefined && {
      isActive: input.isActive,
    }),

    ...(input.isFeatured !== undefined && {
      isFeatured: input.isFeatured,
    }),

    ...(input.featuredOrder !== undefined && {
      featuredOrder: input.isFeatured
        ? input.featuredOrder ?? 1
        : null,
    }),
  };

  if (input.degree !== undefined) {
    const degree = await this.prisma.degreeType.findUnique({
      where: {
        code: input.degree,
      },
    });

    if (!degree) {
      throw new NotFoundException(
        `Degree type "${input.degree}" not found`,
      );
    }

    data.degreeId = degree.id;
  }

  if (input.duration !== undefined) {
    const duration =
      typeof input.duration === "number"
        ? input.duration
        : Number.parseInt(String(input.duration), 10);

    if (!Number.isFinite(duration) || duration < 0) {
      throw new BadRequestException(
        "Duration must be a valid number.",
      );
    }

    data.duration = duration;
  }

  const programme = await this.prisma.programme.update({
    where: {
      id,
    },
    data,
    include: {
      degree: true,
      department: {
        include: {
          academicUnit: {
            select: {
              id: true,
              name: true,
              abbreviation: true,
              university: true,
              type: true,
            },
          },
        },
      },
    },
  });

  return programme;
}

  async deleteProgramme(id: string) {
    await this.prisma.programme.delete({
      where: { id },
    });

    return {
      message: 'Programme deleted successfully',
    };
  }

  async getCatalogueReview(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const where = { needsReview: true };

    const [data, total] = await Promise.all([
      this.prisma.programme.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
        include: {
          degree: true,
          department: {
            include: {
              academicUnit: {
                select: {
                  name: true,
                  abbreviation: true,
                },
              },
            },
          },
          tuition: {
            orderBy: { academicYear: 'desc' },
            take: 1,
          },
        },
      }),
      this.prisma.programme.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async resolveCatalogueReview(
    id: string,
    input: {
      applicationDeadline?: string;
      applicationStatus?: string;
      sourceCode?: string;
      feeAmount?: number;
      feePeriod?: string;
      academicYear?: string;
    },
  ) {
    const current = await this.prisma.programme.findUnique({
      where: { id },
      include: {
        tuition: true,
      },
    });

    if (!current) {
      throw new NotFoundException('Programme not found');
    }

    const deadline = input.applicationDeadline
      ? new Date(input.applicationDeadline)
      : current.applicationDeadline;

    if (
      input.applicationDeadline &&
      Number.isNaN(deadline?.getTime())
    ) {
      throw new Error('Enter a valid application deadline');
    }

    if (
      input.feeAmount !== undefined &&
      input.feeAmount <= 0
    ) {
      throw new Error('Fee must be greater than zero');
    }

    const feeExists =
      input.feeAmount !== undefined ||
      current.tuition.some((item) => Number(item.amount) > 0);

    const notes =
      [
        !deadline && 'Missing application deadline',
        !feeExists && 'Missing tuition fee',
        input.sourceCode &&
          /[^A-Za-z0-9/_-]/.test(input.sourceCode) &&
          'Source code contains non-standard characters',
      ]
        .filter(Boolean)
        .join('; ') || null;

    const status =
      input.applicationStatus ??
      current.applicationStatus ??
      'Open';

    const programme = await this.prisma.programme.update({
      where: { id },
      data: {
        applicationDeadline: deadline,
        applicationStatus: status,
        sourceCode:
          input.sourceCode ?? current.sourceCode,
        isActive: status !== 'Closed',
        needsReview: Boolean(notes),
        reviewNotes: notes,
      },
    });

    if (input.feeAmount !== undefined) {
      await this.prisma.tuition.upsert({
        where: {
          programmeId_academicYear: {
            programmeId: id,
            academicYear:
              input.academicYear ||
              programme.applicationCycle ||
              '2026/2027',
          },
        },
        update: {
          amount: input.feeAmount,
          feePeriod:
            (input.feePeriod as any) || 'UNKNOWN',
          currency: 'XAF',
        },
        create: {
          programmeId: id,
          academicYear:
            input.academicYear ||
            programme.applicationCycle ||
            '2026/2027',
          amount: input.feeAmount,
          feePeriod:
            (input.feePeriod as any) || 'UNKNOWN',
          currency: 'XAF',
        },
      });
    }

    return programme;
  }

  // ==================== PROGRAMME CAREER/KEYWORD ASSOCIATIONS ====================

  async addProgrammeCareer(
    programmeId: string,
    careerId: string,
  ) {
    return this.prisma.programmeCareer.create({
      data: {
        programmeId,
        careerId,
      },
      include: {
        career: true,
      },
    });
  }

  async removeProgrammeCareer(
    programmeId: string,
    careerId: string,
  ) {
    await this.prisma.programmeCareer.delete({
      where: {
        programmeId_careerId: {
          programmeId,
          careerId,
        },
      },
    });

    return {
      message: 'Career removed from programme',
    };
  }

  async addProgrammeKeyword(
    programmeId: string,
    keywordId: string,
  ) {
    return this.prisma.programmeKeyword.create({
      data: {
        programmeId,
        keywordId,
      },
      include: {
        keyword: true,
      },
    });
  }

  async removeProgrammeKeyword(
    programmeId: string,
    keywordId: string,
  ) {
    await this.prisma.programmeKeyword.delete({
      where: {
        programmeId_keywordId: {
          programmeId,
          keywordId,
        },
      },
    });

    return {
      message: 'Keyword removed from programme',
    };
  }

  // ==================== USER MANAGEMENT ====================

  async getAllUsers(
    page: number = 1,
    limit: number = 20,
    search?: string,
  ) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (search?.trim()) {
      where.OR = [
        {
          firstName: {
            contains: search.trim(),
            mode: 'insensitive',
          },
        },
        {
          lastName: {
            contains: search.trim(),
            mode: 'insensitive',
          },
        },
        {
          email: {
            contains: search.trim(),
            mode: 'insensitive',
          },
        },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          createdAt: true,
          _count: {
            select: {
              savedProgrammes: true,
              searchHistory: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateUserRole(
    userId: string,
    role: string,
  ) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        role: role as any,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
      },
    });
  }

  async toggleUserActive(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        isActive: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        isActive: !user.isActive,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
      },
    });
  }

  // ==================== CREATE PROGRAMME ====================

async createProgramme(input: {
  departmentId: string;
  code: string;
  name: string;
  degree: string;
  level: string;
  duration: number | string;
  description?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  featuredOrder?: number | null;
}) {
  const existing = await this.prisma.programme.findUnique({
    where: {
      code: input.code,
    },
  });

  if (existing) {
    throw new Error(
      `Programme with code "${input.code}" already exists`,
    );
  }

  const department = await this.prisma.department.findUnique({
    where: {
      id: input.departmentId,
    },
  });

  if (!department) {
    throw new NotFoundException(
      `Department with ID ${input.departmentId} not found`,
    );
  }

  const degree = await this.prisma.degreeType.findUnique({
    where: {
      code: input.degree,
    },
  });

  if (!degree) {
    throw new NotFoundException(
      `Degree type "${input.degree}" not found`,
    );
  }

  const duration =
    typeof input.duration === "number"
      ? input.duration
      : Number.parseInt(String(input.duration), 10);

  if (!Number.isFinite(duration) || duration < 0) {
    throw new BadRequestException(
      "Duration must be a valid number.",
    );
  }

  return this.prisma.programme.create({
    data: {
      departmentId: input.departmentId,
      code: input.code.trim(),
      name: input.name.trim(),
      degreeId: degree.id,
      level: input.level as any,
      duration,
      description: input.description?.trim() || undefined,
      isActive: input.isActive ?? true,
      isFeatured: input.isFeatured ?? false,
      featuredOrder:
        input.isFeatured === true
          ? input.featuredOrder ?? 1
          : null,
    },
    include: {
      degree: true,
      department: {
        include: {
          academicUnit: {
            include: {
              university: true,
              type: true,
            },
          },
        },
      },
    },
  });
}

  // ==================== SUBJECT MANAGEMENT ====================

  async getAllSubjects(
    page: number = 1,
    limit: number = 50,
    search?: string,
    level?: string,
  ) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (search?.trim()) {
      where.OR = [
        {
          name: {
            contains: search.trim(),
            mode: 'insensitive',
          },
        },
        {
          code: {
            contains: search.trim(),
            mode: 'insensitive',
          },
        },
      ];
    }

    if (level) {
      where.level = level;
    }

    const [data, total] = await Promise.all([
      this.prisma.subject.findMany({
        where,
        skip,
        take: limit,
        include: {
          _count: {
            select: {
              requirements: true,
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
      }),
      this.prisma.subject.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async createSubject(input: {
    name: string;
    code?: string;
    level: string;
  }) {
    const existing = await this.prisma.subject.findUnique({
      where: {
        name: input.name,
      },
    });

    if (existing) {
      throw new Error(
        `Subject "${input.name}" already exists`,
      );
    }

    return this.prisma.subject.create({
      data: {
        name: input.name,
        code: input.code,
        level: input.level as any,
      },
    });
  }

  async updateSubject(
    id: string,
    input: {
      name?: string;
      code?: string;
      level?: string;
    },
  ) {
    const subject = await this.prisma.subject.findUnique({
      where: { id },
    });

    if (!subject) {
      throw new NotFoundException('Subject not found');
    }

    if (
      input.name &&
      input.name !== subject.name
    ) {
      const existing =
        await this.prisma.subject.findUnique({
          where: {
            name: input.name,
          },
        });

      if (existing) {
        throw new Error(
          `Subject "${input.name}" already exists`,
        );
      }
    }

    return this.prisma.subject.update({
      where: { id },
      data: {
        ...(input.name !== undefined && {
          name: input.name,
        }),
        ...(input.code !== undefined && {
          code: input.code,
        }),
        ...(input.level !== undefined && {
          level: input.level as any,
        }),
      },
    });
  }

  async deleteSubject(id: string) {
    const subject = await this.prisma.subject.findUnique({
      where: { id },
    });

    if (!subject) {
      throw new NotFoundException(
        'Subject not found',
      );
    }

    const count =
      await this.prisma.programmeRequirement.count({
        where: {
          subjectId: id,
        },
      });

    if (count > 0) {
      throw new Error(
        `Cannot delete "${subject.name}" - used in ${count} programme requirement(s)`,
      );
    }

    await this.prisma.subject.delete({
      where: { id },
    });

    return {
      message: 'Subject deleted successfully',
    };
  }

  // ==================== UNIVERSITY MANAGEMENT ====================

  async createUniversity(input: {
    name: string;
    abbreviation: string;
    description?: string;
    website?: string;
  }) {
    const existing =
      await this.prisma.university.findUnique({
        where: {
          abbreviation: input.abbreviation,
        },
      });

    if (existing) {
      throw new Error(
        `University with abbreviation "${input.abbreviation}" already exists`,
      );
    }

    return this.prisma.university.create({
      data: input,
    });
  }

  async updateUniversity(
    id: string,
    input: {
      name?: string;
      abbreviation?: string;
      description?: string;
      website?: string;
    },
  ) {
    const university =
      await this.prisma.university.findUnique({
        where: { id },
      });

    if (!university) {
      throw new NotFoundException(
        'University not found',
      );
    }

    return this.prisma.university.update({
      where: { id },
      data: input,
    });
  }

  async deleteUniversity(id: string) {
    const university =
      await this.prisma.university.findUnique({
        where: { id },
      });

    if (!university) {
      throw new NotFoundException(
        'University not found',
      );
    }

    const unitCount =
      await this.prisma.academicUnit.count({
        where: {
          universityId: id,
        },
      });

    if (unitCount > 0) {
      throw new Error(
        `Cannot delete "${university.name}" - it has ${unitCount} academic unit(s)`,
      );
    }

    await this.prisma.university.delete({
      where: { id },
    });

    return {
      message: 'University deleted successfully',
    };
  }

  async getAllUniversities() {
    return this.prisma.university.findMany({
      orderBy: {
        name: 'asc',
      },
      include: {
        _count: {
          select: {
            academicUnits: true,
          },
        },
      },
    });
  }

  // ==================== ACADEMIC UNIT MANAGEMENT ====================
  async getAcademicUnitTypes() {
  return this.prisma.academicUnitType.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      name: 'asc',
    },
  });
}
  async createFaculty(input: {
    name: string;
    abbreviation: string;
    description?: string;
    universityId: string;
    typeId?: string;
    type?: string;
  }) {
    const university =
      await this.prisma.university.findUnique({
        where: {
          id: input.universityId,
        },
      });

    if (!university) {
      throw new NotFoundException(
        'University not found',
      );
    }

    let typeId = input.typeId;

    if (!typeId) {
      const typeCode = input.type || 'FACULTY';

      const type =
        await this.prisma.academicUnitType.findUnique({
          where: {
            code: typeCode,
          },
        });

      if (!type) {
        throw new NotFoundException(
          `Academic unit type "${typeCode}" not found`,
        );
      }

      typeId = type.id;
    }

    return this.prisma.academicUnit.create({
      data: {
        name: input.name,
        abbreviation: input.abbreviation,
        description: input.description,
        universityId: input.universityId,
        typeId,
      },
      include: {
        university: true,
        type: true,
      },
    });
  }

  async updateFaculty(id: string, input: any) {
    const data: any = {
      ...(input.name !== undefined && {
        name: input.name,
      }),
      ...(input.abbreviation !== undefined && {
        abbreviation: input.abbreviation,
      }),
      ...(input.description !== undefined && {
        description: input.description,
      }),
      ...(input.universityId !== undefined && {
        universityId: input.universityId,
      }),
    };

    if (input.typeId !== undefined) {
      const type =
        await this.prisma.academicUnitType.findUnique({
          where: {
            id: input.typeId,
          },
        });

      if (!type) {
        throw new NotFoundException(
          'Academic unit type not found',
        );
      }

      data.typeId = type.id;
    } else if (input.type !== undefined) {
      const type =
        await this.prisma.academicUnitType.findUnique({
          where: {
            code: input.type,
          },
        });

      if (!type) {
        throw new NotFoundException(
          `Academic unit type "${input.type}" not found`,
        );
      }

      data.typeId = type.id;
    }

    return this.prisma.academicUnit.update({
      where: { id },
      data,
      include: {
        university: true,
        type: true,
      },
    });
  }

  async deleteFaculty(id: string) {
    const faculty =
      await this.prisma.academicUnit.findUnique({
        where: { id },
        include: {
          _count: {
            select: {
              departments: true,
            },
          },
        },
      });

    if (!faculty) {
      throw new NotFoundException(
        'Faculty not found',
      );
    }

    if (faculty._count.departments > 0) {
      throw new Error(
        `Cannot delete "${faculty.name}" - it has ${faculty._count.departments} department(s)`,
      );
    }

    await this.prisma.academicUnit.delete({
      where: { id },
    });

    return {
      message: 'Faculty deleted successfully',
    };
  }

  async getAllFaculties(universityId?: string) {
    return this.prisma.academicUnit.findMany({
      where: {
        ...(universityId
          ? { universityId }
          : {}),
      },
      orderBy: {
        name: 'asc',
      },
      include: {
        university: {
          select: {
            id: true,
            name: true,
            abbreviation: true,
          },
        },
        type: true,
        _count: {
          select: {
            departments: true,
          },
        },
      },
    });
  }

 async createDepartment(input: {
  name: string;
  abbreviation?: string;
  description?: string;
  academicUnitId: string;
}) {
  const name = input.name?.trim();
  const academicUnitId = input.academicUnitId?.trim();

  if (!name) {
    throw new BadRequestException(
      'Department name is required.',
    );
  }

  if (!academicUnitId) {
    throw new BadRequestException(
      'Academic unit is required when creating a department.',
    );
  }

  const academicUnit =
    await this.prisma.academicUnit.findUnique({
      where: {
        id: academicUnitId,
      },
      include: {
        university: true,
        type: true,
      },
    });

  if (!academicUnit) {
    throw new NotFoundException(
      'Academic unit not found.',
    );
  }

  return this.prisma.department.create({
    data: {
      name,
      abbreviation:
        input.abbreviation?.trim() || undefined,
      description:
        input.description?.trim() || undefined,
      academicUnitId,
    },
    include: {
      academicUnit: {
        include: {
          university: true,
          type: true,
        },
      },
      _count: {
        select: {
          programmes: true,
        },
      },
    },
  });
} 
 async updateDepartment(
  id: string,
  input: {
    name?: string;
    abbreviation?: string;
    description?: string;
    academicUnitId?: string;
  },
) {
  const department =
    await this.prisma.department.findUnique({
      where: {
        id,
      },
    });

  if (!department) {
    throw new NotFoundException(
      'Department not found.',
    );
  }

  if (input.name !== undefined && !input.name.trim()) {
    throw new BadRequestException(
      'Department name cannot be empty.',
    );
  }

  if (input.academicUnitId !== undefined) {
    const academicUnitId =
      input.academicUnitId.trim();

    if (!academicUnitId) {
      throw new BadRequestException(
        'Academic unit cannot be empty.',
      );
    }

    const academicUnit =
      await this.prisma.academicUnit.findUnique({
        where: {
          id: academicUnitId,
        },
      });

    if (!academicUnit) {
      throw new NotFoundException(
        'Academic unit not found.',
      );
    }
  }

  return this.prisma.department.update({
    where: {
      id,
    },
    data: {
      ...(input.name !== undefined && {
        name: input.name.trim(),
      }),
      ...(input.abbreviation !== undefined && {
        abbreviation:
          input.abbreviation.trim() || null,
      }),
      ...(input.description !== undefined && {
        description:
          input.description.trim() || null,
      }),
      ...(input.academicUnitId !== undefined && {
        academicUnitId:
          input.academicUnitId.trim(),
      }),
    },
    include: {
      academicUnit: {
        include: {
          university: true,
          type: true,
        },
      },
      _count: {
        select: {
          programmes: true,
        },
      },
    },
  });
}

  async deleteDepartment(id: string) {
    const dept =
      await this.prisma.department.findUnique({
        where: { id },
        include: {
          _count: {
            select: {
              programmes: true,
            },
          },
        },
      });

    if (!dept) {
      throw new NotFoundException(
        'Department not found',
      );
    }

    if (dept._count.programmes > 0) {
      throw new Error(
        `Cannot delete "${dept.name}" - it has ${dept._count.programmes} programme(s)`,
      );
    }

    await this.prisma.department.delete({
      where: { id },
    });

    return {
      message: 'Department deleted successfully',
    };
  }

  async getAllDepartments(
  page: number = 1,
  limit: number = 200,
  search?: string,
  academicUnitId?: string,
  universityId?: string,
) {
  const safePage = Math.max(1, page);
  const safeLimit = Math.min(
    200,
    Math.max(1, limit),
  );

  const skip = (safePage - 1) * safeLimit;
  const where: any = {};

  if (search?.trim()) {
    const searchTerm = search.trim();

    where.OR = [
      {
        name: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      },
      {
        abbreviation: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      },
    ];
  }

  if (academicUnitId) {
    where.academicUnitId = academicUnitId;
  }

  if (universityId) {
    where.academicUnit = {
      universityId,
    };
  }

  const [data, total] = await Promise.all([
    this.prisma.department.findMany({
      where,
      skip,
      take: safeLimit,
      include: {
        academicUnit: {
          include: {
            university: true,
            type: true,
          },
        },
        _count: {
          select: {
            programmes: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    }),
    this.prisma.department.count({
      where,
    }),
  ]);

  return {
    data,
    total,
    page: safePage,
    limit: safeLimit,
    totalPages: Math.ceil(
      total / safeLimit,
    ),
  };
}

  // ==================== TUITION MANAGEMENT ====================

  async getAllTuition(
    page: number = 1,
    limit: number = 50,
    programmeId?: string,
  ) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (programmeId) {
      where.programmeId = programmeId;
    }

    const [data, total] = await Promise.all([
      this.prisma.tuition.findMany({
        where,
        skip,
        take: limit,
        include: {
          programme: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
        },
        orderBy: [
          {
            programme: {
              name: 'asc',
            },
          },
          {
            academicYear: 'desc',
          },
        ],
      }),
      this.prisma.tuition.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async createTuition(input: {
    programmeId: string;
    academicYear: string;
    amount: number;
    currency?: string;
  }) {
    return this.prisma.tuition.create({
      data: {
        programmeId: input.programmeId,
        academicYear: input.academicYear,
        amount: input.amount,
        currency: input.currency || 'XAF',
      },
      include: {
        programme: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });
  }

  async updateTuition(
    id: string,
    input: {
      academicYear?: string;
      amount?: number;
      currency?: string;
    },
  ) {
    const tuition =
      await this.prisma.tuition.findUnique({
        where: { id },
      });

    if (!tuition) {
      throw new NotFoundException(
        'Tuition record not found',
      );
    }

    return this.prisma.tuition.update({
      where: { id },
      data: {
        ...(input.academicYear !== undefined && {
          academicYear: input.academicYear,
        }),
        ...(input.amount !== undefined && {
          amount: input.amount,
        }),
        ...(input.currency !== undefined && {
          currency: input.currency,
        }),
      },
      include: {
        programme: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });
  }

  async deleteTuition(id: string) {
    await this.prisma.tuition.delete({
      where: { id },
    });

    return {
      message: 'Tuition record deleted',
    };
  }

  // ==================== CAREER MANAGEMENT ====================

  async getAllCareers(
    page: number = 1,
    limit: number = 50,
    search?: string,
  ) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (search?.trim()) {
      where.name = {
        contains: search.trim(),
        mode: 'insensitive',
      };
    }

    const [data, total] = await Promise.all([
      this.prisma.career.findMany({
        where,
        skip,
        take: limit,
        include: {
          _count: {
            select: {
              programmes: true,
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
      }),
      this.prisma.career.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async createCareer(input: {
    name: string;
    description?: string;
  }) {
    return this.prisma.career.create({
      data: input,
    });
  }

  async updateCareer(
    id: string,
    input: {
      name?: string;
      description?: string;
    },
  ) {
    const career =
      await this.prisma.career.findUnique({
        where: { id },
      });

    if (!career) {
      throw new NotFoundException(
        'Career not found',
      );
    }

    return this.prisma.career.update({
      where: { id },
      data: {
        ...(input.name !== undefined && {
          name: input.name,
        }),
        ...(input.description !== undefined && {
          description: input.description,
        }),
      },
    });
  }

  async deleteCareer(id: string) {
    const count =
      await this.prisma.programmeCareer.count({
        where: {
          careerId: id,
        },
      });

    if (count > 0) {
      throw new Error(
        `Cannot delete - used in ${count} programme(s)`,
      );
    }

    await this.prisma.career.delete({
      where: { id },
    });

    return {
      message: 'Career deleted',
    };
  }

  // ==================== KEYWORD MANAGEMENT ====================

  async getAllKeywords(
    page: number = 1,
    limit: number = 50,
    search?: string,
  ) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (search?.trim()) {
      where.word = {
        contains: search.trim(),
        mode: 'insensitive',
      };
    }

    const [data, total] = await Promise.all([
      this.prisma.keyword.findMany({
        where,
        skip,
        take: limit,
        include: {
          _count: {
            select: {
              programmes: true,
            },
          },
        },
        orderBy: {
          word: 'asc',
        },
      }),
      this.prisma.keyword.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async createKeyword(input: {
    word: string;
  }) {
    return this.prisma.keyword.create({
      data: input,
    });
  }

  async updateKeyword(
    id: string,
    input: {
      word?: string;
    },
  ) {
    const keyword =
      await this.prisma.keyword.findUnique({
        where: { id },
      });

    if (!keyword) {
      throw new NotFoundException(
        'Keyword not found',
      );
    }

    return this.prisma.keyword.update({
      where: { id },
      data: {
        ...(input.word !== undefined && {
          word: input.word,
        }),
      },
    });
  }

  async deleteKeyword(id: string) {
    const count =
      await this.prisma.programmeKeyword.count({
        where: {
          keywordId: id,
        },
      });

    if (count > 0) {
      throw new Error(
        `Cannot delete - used in ${count} programme(s)`,
      );
    }

    await this.prisma.keyword.delete({
      where: { id },
    });

    return {
      message: 'Keyword deleted',
    };
  }

  // ==================== ADMISSION RULES MANAGEMENT ====================

  async getAllAdmissionRules(
    page: number = 1,
    limit: number = 50,
  ) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.generalAdmissionRule.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.generalAdmissionRule.count(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async createAdmissionRule(input: {
    title: string;
    description: string;
    isActive?: boolean;
  }) {
    return this.prisma.generalAdmissionRule.create({
      data: input,
    });
  }

  async updateAdmissionRule(
    id: string,
    input: {
      title?: string;
      description?: string;
      isActive?: boolean;
    },
  ) {
    return this.prisma.generalAdmissionRule.update({
      where: { id },
      data: {
        ...(input.title !== undefined && {
          title: input.title,
        }),
        ...(input.description !== undefined && {
          description: input.description,
        }),
        ...(input.isActive !== undefined && {
          isActive: input.isActive,
        }),
      },
    });
  }

  async deleteAdmissionRule(id: string) {
    await this.prisma.generalAdmissionRule.delete({
      where: { id },
    });

    return {
      message: 'Admission rule deleted',
    };
  }

  // ==================== DUPLICATE DETECTION ====================

  async detectDuplicateFaculties() {
    const faculties =
      await this.prisma.academicUnit.findMany();

    const nameMap = new Map<
      string,
      typeof faculties
    >();

    for (const f of faculties) {
      const key = f.name.toLowerCase().trim();

      if (!nameMap.has(key)) {
        nameMap.set(key, []);
      }

      nameMap.get(key)!.push(f);
    }

    return Array.from(nameMap.entries())
      .filter(([, group]) => group.length > 1)
      .map(([name, group]) => ({
        name,
        count: group.length,
        items: group.map((f) => ({
          id: f.id,
          name: f.name,
          abbreviation: f.abbreviation,
        })),
      }));
  }

  async detectDuplicateProgrammes() {
    const programmes =
      await this.prisma.programme.findMany({
        select: {
          id: true,
          name: true,
          code: true,
        },
      });

    const nameMap = new Map<
      string,
      typeof programmes
    >();

    for (const p of programmes) {
      const key = p.name.toLowerCase().trim();

      if (!nameMap.has(key)) {
        nameMap.set(key, []);
      }

      nameMap.get(key)!.push(p);
    }

    const codeMap = new Map<
      string,
      typeof programmes
    >();

    for (const p of programmes) {
      const key = p.code.toLowerCase().trim();

      if (!codeMap.has(key)) {
        codeMap.set(key, []);
      }

      codeMap.get(key)!.push(p);
    }

    const nameDupes = Array.from(nameMap.entries())
      .filter(([, group]) => group.length > 1)
      .map(([name, group]) => ({
        field: 'name',
        value: name,
        count: group.length,
        items: group,
      }));

    const codeDupes = Array.from(codeMap.entries())
      .filter(([, group]) => group.length > 1)
      .map(([code, group]) => ({
        field: 'code',
        value: code,
        count: group.length,
        items: group,
      }));

    return [...nameDupes, ...codeDupes];
  }

  async detectDuplicateSubjects() {
    const subjects =
      await this.prisma.subject.findMany();

    const nameMap = new Map<
      string,
      typeof subjects
    >();

    for (const s of subjects) {
      const key = s.name.toLowerCase().trim();

      if (!nameMap.has(key)) {
        nameMap.set(key, []);
      }

      nameMap.get(key)!.push(s);
    }

    return Array.from(nameMap.entries())
      .filter(([, group]) => group.length > 1)
      .map(([name, group]) => ({
        name,
        count: group.length,
        items: group.map((s) => ({
          id: s.id,
          name: s.name,
          code: s.code,
          level: s.level,
        })),
      }));
  }

  // ==================== ANNOUNCEMENTS ====================

  private createSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private async createUniqueAnnouncementSlug(
    title: string,
    excludeId?: string,
  ) {
    const baseSlug =
      this.createSlug(title) ||
      `announcement-${Date.now()}`;

    let slug = baseSlug;
    let counter = 2;

    while (true) {
      const existing =
        await this.prisma.announcement.findUnique({
          where: { slug },
          select: { id: true },
        });

      if (!existing || existing.id === excludeId) {
        return slug;
      }

      slug = `${baseSlug}-${counter}`;
      counter += 1;
    }
  }

  async createAnnouncement(input: {
    title: string;
    content: string;
    programmeId?: string;
    authorId: string;
    slug?: string;
    summary?: string;
    categoryId?: string;
    featuredImage?: string;
    applicationCycle?: string;
    applicationStatus?: string;
    applicationDeadline?: string | Date;
    applicationUrl?: string;
    officialSourceUrl?: string;
    source?: string;
    sourceDocument?: string;
  }) {
    const slug = input.slug
      ? await this.createUniqueAnnouncementSlug(
          input.slug,
        )
      : await this.createUniqueAnnouncementSlug(
          input.title,
        );

    return this.prisma.announcement.create({
      data: {
        slug,
        title: input.title,
        content: input.content,
        programmeId: input.programmeId,
        authorId: input.authorId,
        summary: input.summary,
        categoryId: input.categoryId,
        featuredImage: input.featuredImage,
        applicationCycle:
          input.applicationCycle,
        applicationStatus:
          input.applicationStatus,
        applicationDeadline:
          input.applicationDeadline
            ? new Date(input.applicationDeadline)
            : undefined,
        applicationUrl: input.applicationUrl,
        officialSourceUrl:
          input.officialSourceUrl,
        source: input.source,
        sourceDocument:
          input.sourceDocument,
      },
    });
  }

  async updateAnnouncement(
    id: string,
    input: any,
  ) {
    const existing =
      await this.prisma.announcement.findUnique({
        where: { id },
      });

    if (!existing) {
      throw new NotFoundException(
        'Announcement not found',
      );
    }

    const data: any = {
      ...(input.title !== undefined && {
        title: input.title,
      }),
      ...(input.content !== undefined && {
        content: input.content,
      }),
      ...(input.programmeId !== undefined && {
        programmeId: input.programmeId,
      }),
      ...(input.summary !== undefined && {
        summary: input.summary,
      }),
      ...(input.categoryId !== undefined && {
        categoryId: input.categoryId,
      }),
      ...(input.featuredImage !== undefined && {
        featuredImage: input.featuredImage,
      }),
      ...(input.applicationCycle !== undefined && {
        applicationCycle: input.applicationCycle,
      }),
      ...(input.applicationStatus !== undefined && {
        applicationStatus:
          input.applicationStatus,
      }),
      ...(input.applicationDeadline !== undefined && {
        applicationDeadline:
          input.applicationDeadline
            ? new Date(input.applicationDeadline)
            : null,
      }),
      ...(input.applicationUrl !== undefined && {
        applicationUrl: input.applicationUrl,
      }),
      ...(input.officialSourceUrl !== undefined && {
        officialSourceUrl:
          input.officialSourceUrl,
      }),
      ...(input.source !== undefined && {
        source: input.source,
      }),
      ...(input.sourceDocument !== undefined && {
        sourceDocument: input.sourceDocument,
      }),
      ...(input.published !== undefined && {
        published: input.published,
      }),
      ...(input.publishedAt !== undefined && {
        publishedAt: input.publishedAt
          ? new Date(input.publishedAt)
          : null,
      }),
    };

    if (
      input.slug !== undefined &&
      input.slug !== existing.slug
    ) {
      data.slug =
        await this.createUniqueAnnouncementSlug(
          input.slug,
          id,
        );
    } else if (
      input.title !== undefined &&
      input.title !== existing.title &&
      input.slug === undefined
    ) {
      data.slug =
        await this.createUniqueAnnouncementSlug(
          input.title,
          id,
        );
    }

    return this.prisma.announcement.update({
      where: { id },
      data,
    });
  }

  async getAnnouncements(published?: boolean) {
    const where: any = {};

    if (published !== undefined) {
      where.published = published;
    }

    return this.prisma.announcement.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        programme: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        category: true,
      },
    });
  }

  async toggleAnnouncement(id: string) {
    const announcement =
      await this.prisma.announcement.findUnique({
        where: { id },
        select: {
          published: true,
        },
      });

    if (!announcement) {
      throw new NotFoundException(
        'Announcement not found',
      );
    }

    return this.prisma.announcement.update({
      where: { id },
      data: {
        published: !announcement.published,
        publishedAt: !announcement.published
          ? new Date()
          : null,
      },
    });
  }

  async deleteAnnouncement(id: string) {
    await this.prisma.announcement.delete({
      where: { id },
    });

    return {
      message: 'Announcement deleted',
    };
  }

  // ==================== ANNOUNCEMENT CATEGORIES ====================

  async getAnnouncementCategories() {
    return this.prisma.announcementCategory.findMany({
      orderBy: [
        {
          displayOrder: 'asc',
        },
        {
          name: 'asc',
        },
      ],
    });
  }

  async createAnnouncementCategory(
    input: {
      name: string;
      slug?: string;
      description?: string;
      displayOrder?: number;
      isActive?: boolean;
      icon?: string;
    },
  ) {
    const slug =
      input.slug ||
      this.createSlug(input.name);

    return this.prisma.announcementCategory.create({
      data: {
        name: input.name,
        slug,
        description: input.description,
        displayOrder:
          input.displayOrder ?? 0,
        isActive:
          input.isActive ?? true,
        icon: input.icon,
      },
    });
  }

  async toggleAnnouncementCategory(
    id: string,
  ) {
    const category =
      await this.prisma.announcementCategory.findUnique(
        {
          where: { id },
          select: {
            isActive: true,
          },
        },
      );

    if (!category) {
      throw new NotFoundException(
        'Announcement category not found',
      );
    }

    return this.prisma.announcementCategory.update({
      where: { id },
      data: {
        isActive: !category.isActive,
      },
    });
  }
}