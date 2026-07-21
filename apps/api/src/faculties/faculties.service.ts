import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FacultiesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.academicUnit.findMany({
      include: {
        _count: {
          select: { departments: true },
        },
      },
      orderBy: { name: 'asc' },
    });
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
      throw new NotFoundException(`Department with ID ${departmentId} not found`);
    }

    return department;
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
      totalDepartments: faculties.reduce((sum, f) => sum + f._count.departments, 0),
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

