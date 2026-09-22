import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FacultiesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params?: {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
    universityId?: string;
  }) {
    if (
      !params ||
      (!params.page &&
        !params.search &&
        !params.type &&
        !params.universityId)
    ) {
      return this.prisma.academicUnit.findMany({
        include: {
          type: true,
          university: true,
          _count: {
            select: { departments: true },
          },
        },
        orderBy: { name: 'asc' },
      });
    }

    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, Math.max(1, params.limit || 20));
    const where: any = {};

    if (params.search?.trim()) {
      const search = params.search.trim();

      where.OR = [
        {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          abbreviation: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    if (params.type?.trim()) {
      const type = params.type.trim();

      where.type = {
        OR: [
          {
            code: type.toUpperCase(),
          },
          {
            name: type,
          },
        ],
      };
    }

    if (params.universityId) {
      where.universityId = params.universityId;
    }

    const [data, total] = await Promise.all([
      this.prisma.academicUnit.findMany({
        where,
        include: {
          type: true,
          university: true,
          _count: {
            select: { departments: true },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      this.prisma.academicUnit.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const academicUnit = await this.prisma.academicUnit.findUnique({
      where: { id },
      include: {
        type: true,
        university: true,
        departments: {
          include: {
            programmes: {
              include: {
                degree: true,
                _count: {
                  select: {
                    requirements: true,
                  },
                },
                tuition: {
                  take: 1,
                  orderBy: {
                    academicYear: 'desc',
                  },
                },
              },
              orderBy: {
                name: 'asc',
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
        },
        _count: {
          select: {
            departments: true,
          },
        },
      },
    });

    if (!academicUnit) {
      throw new NotFoundException(
        `Academic unit with ID ${id} not found`,
      );
    }

    return academicUnit;
  }

  async findByCode(code: string) {
    const normalizedCode = code.trim();

    if (!normalizedCode) {
      throw new NotFoundException(
        'Academic unit code is required',
      );
    }

    const academicUnit = await this.prisma.academicUnit.findFirst({
      where: {
        abbreviation: {
          equals: normalizedCode,
          mode: 'insensitive',
        },
      },
      include: {
        type: true,
        university: true,
        departments: {
          include: {
            programmes: {
              include: {
                degree: true,
                _count: {
                  select: {
                    requirements: true,
                  },
                },
                tuition: {
                  take: 1,
                  orderBy: {
                    academicYear: 'desc',
                  },
                },
              },
              orderBy: {
                name: 'asc',
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
        },
        _count: {
          select: {
            departments: true,
          },
        },
      },
    });

    if (!academicUnit) {
      throw new NotFoundException(
        `Academic unit with code ${normalizedCode} not found`,
      );
    }

    return academicUnit;
  }

  async getDepartments(academicUnitId: string) {
    const academicUnit = await this.prisma.academicUnit.findUnique({
      where: {
        id: academicUnitId,
      },
    });

    if (!academicUnit) {
      throw new NotFoundException(
        `Academic unit with ID ${academicUnitId} not found`,
      );
    }

    return this.prisma.department.findMany({
      where: {
        academicUnitId,
      },
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
    });
  }

  async getDepartmentProgrammes(departmentId: string) {
    const department = await this.prisma.department.findUnique({
      where: {
        id: departmentId,
      },
      include: {
        programmes: {
          include: {
            degree: true,
            _count: {
              select: {
                requirements: true,
              },
            },
            tuition: {
              take: 1,
              orderBy: {
                academicYear: 'desc',
              },
            },
          },
          orderBy: {
            name: 'asc',
          },
        },
        academicUnit: {
          include: {
            type: true,
            university: true,
          },
        },
      },
    });

    if (!department) {
      throw new NotFoundException(
        `Department with ID ${departmentId} not found`,
      );
    }

    return department;
  }

  async create(input: {
    name: string;
    abbreviation?: string;
    description?: string;
    type?: string;
    universityId?: string;
  }) {
    if (!input.universityId) {
      throw new NotFoundException(
        'University is required when creating an academic unit.',
      );
    }

    const university = await this.prisma.university.findUnique({
      where: {
        id: input.universityId,
      },
    });

    if (!university) {
      throw new NotFoundException(
        `University with ID ${input.universityId} not found`,
      );
    }

    const typeValue = (input.type || 'FACULTY').trim();

    const academicUnitType =
      await this.prisma.academicUnitType.findFirst({
        where: {
          OR: [
            {
              code: typeValue.toUpperCase(),
            },
            {
              name: typeValue,
            },
          ],
        },
      });

    if (!academicUnitType) {
      throw new NotFoundException(
        `Academic unit type "${typeValue}" not found`,
      );
    }

    return this.prisma.academicUnit.create({
      data: {
        name: input.name.trim(),
        abbreviation: input.abbreviation?.trim() || undefined,
        description: input.description?.trim() || undefined,
        typeId: academicUnitType.id,
        universityId: input.universityId,
      },
      include: {
        type: true,
        university: true,
        _count: {
          select: {
            departments: true,
          },
        },
      },
    });
  }

  async update(
    id: string,
    input: {
      name?: string;
      abbreviation?: string;
      description?: string;
      type?: string;
    },
  ) {
    const academicUnit = await this.prisma.academicUnit.findUnique({
      where: {
        id,
      },
    });

    if (!academicUnit) {
      throw new NotFoundException(
        `Academic unit with ID ${id} not found`,
      );
    }

    let typeId: string | undefined;

    if (input.type !== undefined) {
      const typeValue = input.type.trim();

      const academicUnitType =
        await this.prisma.academicUnitType.findFirst({
          where: {
            OR: [
              {
                code: typeValue.toUpperCase(),
              },
              {
                name: typeValue,
              },
            ],
          },
        });

      if (!academicUnitType) {
        throw new NotFoundException(
          `Academic unit type "${input.type}" not found`,
        );
      }

      typeId = academicUnitType.id;
    }

    return this.prisma.academicUnit.update({
      where: {
        id,
      },
      data: {
        ...(input.name !== undefined && {
          name: input.name.trim(),
        }),
        ...(input.abbreviation !== undefined && {
          abbreviation: input.abbreviation.trim() || null,
        }),
        ...(input.description !== undefined && {
          description: input.description.trim() || null,
        }),
        ...(typeId !== undefined && {
          typeId,
        }),
      },
      include: {
        type: true,
        university: true,
        _count: {
          select: {
            departments: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    const academicUnit = await this.prisma.academicUnit.findUnique({
      where: {
        id,
      },
      include: {
        _count: {
          select: {
            departments: true,
          },
        },
      },
    });

    if (!academicUnit) {
      throw new NotFoundException(
        `Academic unit with ID ${id} not found`,
      );
    }

    if (academicUnit._count.departments > 0) {
      throw new NotFoundException(
        `Cannot delete academic unit "${academicUnit.name}" because it has ${academicUnit._count.departments} department(s). Delete the departments first.`,
      );
    }

    await this.prisma.academicUnit.delete({
      where: {
        id,
      },
    });

    return {
      message: 'Academic unit deleted successfully',
    };
  }

  async getFacultyStats() {
    const academicUnits = await this.prisma.academicUnit.findMany({
      include: {
        type: true,
        university: true,
        _count: {
          select: {
            departments: true,
          },
        },
        departments: {
          include: {
            _count: {
              select: {
                programmes: true,
              },
            },
          },
        },
      },
    });

    const totalProgrammes = academicUnits.reduce(
      (sum, academicUnit) =>
        sum +
        academicUnit.departments.reduce(
          (departmentSum, department) =>
            departmentSum + department._count.programmes,
          0,
        ),
      0,
    );

    return {
      totalAcademicUnits: academicUnits.length,
      totalFaculties: academicUnits.length,
      totalDepartments: academicUnits.reduce(
        (sum, academicUnit) =>
          sum + academicUnit._count.departments,
        0,
      ),
      totalProgrammes,
      academicUnits: academicUnits.map((academicUnit) => ({
        id: academicUnit.id,
        name: academicUnit.name,
        abbreviation: academicUnit.abbreviation,
        departmentCount: academicUnit._count.departments,
        type: academicUnit.type,
        university: academicUnit.university,
      })),
    };
  }
}