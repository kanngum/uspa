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
  }) {
    if (!params || (!params.page && !params.search && !params.type)) {
      // Simple list (backward compatible)
      return this.prisma.academicUnit.findMany({
        include: {
          _count: {
            select: { departments: true },
          },
        },
        orderBy: { name: 'asc' },
      });
    }

    // Paginated/search
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, Math.max(1, params.limit || 20));
    const where: any = {};

    if (params.search?.trim()) {
      where.OR = [
        { name: { contains: params.search.trim(), mode: 'insensitive' } },
        {
          abbreviation: { contains: params.search.trim(), mode: 'insensitive' },
        },
      ];
    }

    if (params.type) {
      where.type = params.type;
    }

    const [data, total] = await Promise.all([
      this.prisma.academicUnit.findMany({
        where,
        include: {
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
    const faculty = await this.prisma.academicUnit.findUnique({
      where: { id },
      include: {
        departments: {
          include: {
            _count: {
              select: { programmes: true },
            },
          },
          orderBy: { name: 'asc' },
        },
      },
    });

    if (!faculty) {
      throw new NotFoundException(`Faculty with ID ${id} not found`);
    }

    return faculty;
  }

  async getDepartments(facultyId: string) {
    const faculty = await this.prisma.academicUnit.findUnique({
      where: { id: facultyId },
    });

    if (!faculty) {
      throw new NotFoundException(`Faculty with ID ${facultyId} not found`);
    }

    return this.prisma.department.findMany({
      where: { academicUnitId: facultyId },
      include: {
        _count: {
          select: { programmes: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async getDepartmentProgrammes(departmentId: string) {
    const department = await this.prisma.department.findUnique({
      where: { id: departmentId },
      include: {
        programmes: {
          include: {
            _count: {
              select: { requirements: true },
            },
            tuition: {
              take: 1,
              orderBy: { academicYear: 'desc' },
            },
          },
          orderBy: { name: 'asc' },
        },
        academicUnit: {
          select: { id: true, name: true, abbreviation: true },
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
    // Get first university if not specified
    if (!input.universityId) {
      const university = await this.prisma.university.findFirst();
      if (!university) {
        throw new NotFoundException(
          'No university found. Create a university first.',
        );
      }
      input.universityId = university.id;
    }

    return this.prisma.academicUnit.create({
      data: {
        name: input.name,
        abbreviation: input.abbreviation,
        description: input.description,
        type: (input.type as any) || 'FACULTY',
        universityId: input.universityId,
      },
      include: {
        _count: {
          select: { departments: true },
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
    const faculty = await this.prisma.academicUnit.findUnique({
      where: { id },
    });

    if (!faculty) {
      throw new NotFoundException(`Faculty with ID ${id} not found`);
    }

    return this.prisma.academicUnit.update({
      where: { id },
      data: {
        ...(input.name !== undefined && { name: input.name }),
        ...(input.abbreviation !== undefined && {
          abbreviation: input.abbreviation,
        }),
        ...(input.description !== undefined && {
          description: input.description,
        }),
        ...(input.type !== undefined && { type: input.type as any }),
      },
      include: {
        _count: {
          select: { departments: true },
        },
      },
    });
  }

  async remove(id: string) {
    const faculty = await this.prisma.academicUnit.findUnique({
      where: { id },
      include: {
        _count: {
          select: { departments: true },
        },
      },
    });

    if (!faculty) {
      throw new NotFoundException(`Faculty with ID ${id} not found`);
    }

    if (faculty._count.departments > 0) {
      throw new NotFoundException(
        `Cannot delete faculty "${faculty.name}" because it has ${faculty._count.departments} department(s). Delete the departments first.`,
      );
    }

    await this.prisma.academicUnit.delete({ where: { id } });
    return { message: 'Faculty deleted successfully' };
  }

  async getFacultyStats() {
    const faculties = await this.prisma.academicUnit.findMany({
      include: {
        _count: {
          select: { departments: true },
        },
        departments: {
          include: {
            _count: {
              select: { programmes: true },
            },
          },
        },
      },
    });

    const totalProgrammes = faculties.reduce(
      (sum, f) =>
        sum + f.departments.reduce((dSum, d) => dSum + d._count.programmes, 0),
      0,
    );

    return {
      totalFaculties: faculties.length,
      totalDepartments: faculties.reduce(
        (sum, f) => sum + f._count.departments,
        0,
      ),
      totalProgrammes,
      faculties: faculties.map((f) => ({
        id: f.id,
        name: f.name,
        abbreviation: f.abbreviation,
        departmentCount: f._count.departments,
      })),
    };
  }
}
