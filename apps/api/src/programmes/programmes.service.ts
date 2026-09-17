import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProgrammesService {
  constructor(private readonly prisma: PrismaService) {}

  async search(params: {
    query?: string;
    universityId?: string;
    facultyId?: string;
    departmentId?: string;
    degreeType?: string;
    level?: string;
    career?: string;
    minFee?: number;
    maxFee?: number;
    page?: number;
    limit?: number;
  }) {
    const { query, universityId, facultyId, departmentId, degreeType, level, career, minFee, maxFee } =
      params;
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, Math.max(1, params.limit || 20));

    const where: Prisma.ProgrammeWhereInput = {};

    // University filter
    if (universityId) {
      where.department = {
        ...(where.department as any || {}),
        academicUnit: {
          universityId,
        },
      };
    }

    // Text search across name, code, description and keywords
    if (query && query.trim().length > 0) {
      const searchTerm = query.trim();
      where.OR = [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { code: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } },
        {
          keywords: {
            some: {
              keyword: {
                word: { contains: searchTerm, mode: 'insensitive' },
              },
            },
          },
        },
        {
          careers: {
            some: {
              career: {
                name: { contains: searchTerm, mode: 'insensitive' },
              },
            },
          },
        },
      ];
    }

    // Faculty filter
    if (facultyId) {
      where.department = {
        academicUnitId: facultyId,
      };
    }

    // Department filter
    if (departmentId) {
      where.departmentId = departmentId;
    }

    // Degree type filter
    if (degreeType) {
      where.degree = degreeType as Prisma.EnumDegreeTypeFilter['equals'];
    }

    // Level filter
    if (level) {
      where.level = level as Prisma.EnumProgrammeLevelFilter['equals'];
    }

    // Career filter
    if (career) {
      where.careers = {
        some: {
          career: {
            name: { contains: career, mode: 'insensitive' },
          },
        },
      };
    }

    // Tuition/fee range filter
    if (minFee !== undefined || maxFee !== undefined) {
      where.tuition = {
        some: {
          ...(minFee !== undefined && { amount: { gte: minFee } }),
          ...(maxFee !== undefined && { amount: { lte: maxFee } }),
        },
      };
    }

    const [data, total] = await Promise.all([
      this.prisma.programme.findMany({
        where,
        include: {
          department: {
            include: {
              academicUnit: {
                select: { id: true, name: true, abbreviation: true },
              },
            },
          },
          tuition: {
            take: 1,
            orderBy: { academicYear: 'desc' },
            select: { amount: true, currency: true, academicYear: true },
          },
          _count: {
            select: { requirements: true, careers: true },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [{ level: 'asc' }, { name: 'asc' }],
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

  async findOne(id: string) {
    const programme = await this.prisma.programme.findUnique({
      where: { id },
      include: {
        department: {
          include: {
            academicUnit: {
              select: { id: true, name: true, abbreviation: true },
            },
          },
        },
        requirements: {
          include: {
            subject: true,
          },
          orderBy: [{ requirementType: 'asc' }, { subject: { name: 'asc' } }],
        },
        tuition: {
          orderBy: { academicYear: 'desc' },
        },
        careers: {
          include: {
            career: true,
          },
        },
        keywords: {
          include: {
            keyword: true,
          },
        },
      },
    });

    if (!programme) {
      throw new NotFoundException(`Programme with ID ${id} not found`);
    }

    return programme;
  }

  async findByCode(code: string) {
    const programme = await this.prisma.programme.findUnique({
      where: { code },
      include: {
        department: {
          include: {
            academicUnit: {
              select: { id: true, name: true, abbreviation: true },
            },
          },
        },
        requirements: {
          include: { subject: true },
        },
        tuition: {
          orderBy: { academicYear: 'desc' },
        },
        careers: {
          include: { career: true },
        },
      },
    });

    if (!programme) {
      throw new NotFoundException(`Programme with code ${code} not found`);
    }

    return programme;
  }

  async getFeatured(universityId?: string) {
    const where: Prisma.ProgrammeWhereInput = {};
    if (universityId) {
      where.department = {
        academicUnit: {
          universityId,
        },
      };
    }

    return this.prisma.programme.findMany({
      where,
      take: 8,
      include: {
        department: {
          include: {
            academicUnit: {
              select: { id: true, name: true, abbreviation: true },
            },
          },
        },
        tuition: {
          take: 1,
          orderBy: { academicYear: 'desc' },
          select: { amount: true, currency: true },
        },
        _count: {
          select: { requirements: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(input: {
    departmentId: string;
    code: string;
    name: string;
    degree: string;
    level: string;
    duration: number;
    description?: string;
  }) {
    // Check programme code uniqueness
    const existingCode = await this.prisma.programme.findUnique({
      where: { code: input.code },
    });
    if (existingCode) {
      throw new NotFoundException(
        `A programme with code "${input.code}" already exists`,
      );
    }

    // Verify department exists
    const department = await this.prisma.department.findUnique({
      where: { id: input.departmentId },
    });
    if (!department) {
      throw new NotFoundException(
        `Department with ID ${input.departmentId} not found`,
      );
    }

    return this.prisma.programme.create({
      data: {
        departmentId: input.departmentId,
        code: input.code,
        name: input.name,
        degree: input.degree as any,
        level: input.level as any,
        duration: input.duration,
        description: input.description,
      },
      include: {
        department: {
          include: {
            academicUnit: {
              select: { id: true, name: true, abbreviation: true },
            },
          },
        },
      },
    });
  }

  async update(
    id: string,
    input: {
      departmentId?: string;
      code?: string;
      name?: string;
      degree?: string;
      level?: string;
      duration?: number;
      description?: string;
    },
  ) {
    const programme = await this.prisma.programme.findUnique({
      where: { id },
    });
    if (!programme) {
      throw new NotFoundException(`Programme with ID ${id} not found`);
    }

    // Check code uniqueness if changing
    if (input.code && input.code !== programme.code) {
      const existingCode = await this.prisma.programme.findUnique({
        where: { code: input.code },
      });
      if (existingCode) {
        throw new NotFoundException(
          `A programme with code "${input.code}" already exists`,
        );
      }
    }

    return this.prisma.programme.update({
      where: { id },
      data: {
        ...(input.departmentId !== undefined && {
          departmentId: input.departmentId,
        }),
        ...(input.code !== undefined && { code: input.code }),
        ...(input.name !== undefined && { name: input.name }),
        ...(input.degree !== undefined && { degree: input.degree as any }),
        ...(input.level !== undefined && { level: input.level as any }),
        ...(input.duration !== undefined && { duration: input.duration }),
        ...(input.description !== undefined && {
          description: input.description,
        }),
      },
      include: {
        department: {
          include: {
            academicUnit: {
              select: { id: true, name: true, abbreviation: true },
            },
          },
        },
      },
    });
  }

  async remove(id: string) {
    const programme = await this.prisma.programme.findUnique({
      where: { id },
    });
    if (!programme) {
      throw new NotFoundException(`Programme with ID ${id} not found`);
    }

    await this.prisma.programme.delete({ where: { id } });
    return { message: 'Programme deleted successfully' };
  }

  async getAutoComplete(query: string) {
    if (!query || query.trim().length < 2) {
      return [];
    }

    const programmes = await this.prisma.programme.findMany({
      where: {
        OR: [
          { name: { contains: query.trim(), mode: 'insensitive' } },
          { code: { contains: query.trim(), mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        name: true,
        code: true,
        degree: true,
        level: true,
        department: {
          select: {
            academicUnit: {
              select: { abbreviation: true },
            },
          },
        },
      },
      take: 10,
      orderBy: { name: 'asc' },
    });

    return programmes.map((p) => ({
      id: p.id,
      name: p.name,
      code: p.code,
      degree: p.degree,
      level: p.level,
      faculty: p.department.academicUnit.abbreviation,
      label: `${p.code} - ${p.name} (${p.department.academicUnit.abbreviation})`,
    }));
  }
}
