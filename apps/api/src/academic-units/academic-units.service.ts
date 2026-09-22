import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import { CreateAcademicUnitDto } from './dto/create-academic-unit.dto';
import { UpdateAcademicUnitDto } from './dto/update-academic-unit.dto';

@Injectable()
export class AcademicUnitsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAcademicUnitDto: CreateAcademicUnitDto) {
    const university = await this.prisma.university.findUnique({
      where: {
        id: createAcademicUnitDto.universityId,
      },
    });

    if (!university) {
      throw new NotFoundException('University not found');
    }

    const type = await this.prisma.academicUnitType.findUnique({
      where: {
        id: createAcademicUnitDto.typeId,
      },
    });

    if (!type) {
      throw new NotFoundException('Academic unit type not found');
    }

    return this.prisma.academicUnit.create({
      data: createAcademicUnitDto,
      include: {
        university: true,
        type: true,
      },
    });
  }

  findAll() {
    return this.prisma.academicUnit.findMany({
      include: {
        university: true,
        type: true,
        departments: {
          include: {
            programmes: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  findOne(id: string) {
    return this.prisma.academicUnit.findUnique({
      where: { id },
      include: {
        university: true,
        type: true,
        departments: {
          include: {
            programmes: true,
          },
        },
      },
    });
  }

  async update(id: string, updateAcademicUnitDto: UpdateAcademicUnitDto) {
    const existing = await this.prisma.academicUnit.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Academic unit not found');
    }

    if (updateAcademicUnitDto.universityId) {
      const university = await this.prisma.university.findUnique({
        where: {
          id: updateAcademicUnitDto.universityId,
        },
      });

      if (!university) {
        throw new NotFoundException('University not found');
      }
    }

    if (updateAcademicUnitDto.typeId) {
      const type = await this.prisma.academicUnitType.findUnique({
        where: {
          id: updateAcademicUnitDto.typeId,
        },
      });

      if (!type) {
        throw new NotFoundException('Academic unit type not found');
      }
    }

    return this.prisma.academicUnit.update({
      where: { id },
      data: updateAcademicUnitDto,
      include: {
        university: true,
        type: true,
      },
    });
  }

  remove(id: string) {
    return this.prisma.academicUnit.delete({
      where: { id },
    });
  }
}