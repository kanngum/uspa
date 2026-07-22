import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import { CreateAcademicUnitDto } from './dto/create-academic-unit.dto';
import { UpdateAcademicUnitDto } from './dto/update-academic-unit.dto';

@Injectable()
export class AcademicUnitsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createAcademicUnitDto: CreateAcademicUnitDto) {
    return this.prisma.academicUnit.create({
      data: createAcademicUnitDto,
    });
  }

  findAll() {
  return this.prisma.academicUnit.findMany({
    include: {
      university: true,
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
      departments: {
        include: {
          programmes: true,
        },
      },
    },
  });
}

  update(id: string, updateAcademicUnitDto: UpdateAcademicUnitDto) {
    return this.prisma.academicUnit.update({
      where: { id },
      data: updateAcademicUnitDto,
    });
  }

  remove(id: string) {
    return this.prisma.academicUnit.delete({
      where: { id },
    });
  }
}