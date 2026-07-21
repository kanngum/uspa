import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RecommendationsService {
  constructor(private readonly prisma: PrismaService) {}

  async getSimilarProgrammes(programmeId: string, limit: number = 5) {
    const programme = await this.prisma.programme.findUnique({
      where: { id: programmeId },
      include: {
        requirements: {
          select: { subjectId: true },
        },
        careers: {
          select: { careerId: true },
        },
        department: {
          select: { academicUnitId: true },
        },
      },
    });

    if (!programme) return [];

    const subjectIds = programme.requirements.map((r) => r.subjectId);
    const careerIds = programme.careers.map((c) => c.careerId);

    // Find programmes with similar subjects or careers, excluding current programme
    const similar = await this.prisma.programme.findMany({
      where: {
        id: { not: programmeId },
        OR: [
          {
            requirements: {
              some: {
                subjectId: { in: subjectIds },
              },
            },
          },
          {
            careers: {
              some: {
                careerId: { in: careerIds },
              },
            },
          },
          {
            department: {
              academicUnitId: programme.department.academicUnitId,
            },
          },
        ],
      },
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
          select: { requirements: true, careers: true },
        },
      },
      take: limit,
      orderBy: { name: 'asc' },
    });

    return similar;
  }

  async getCareerRecommendations(careerName: string, limit: number = 10) {
    return this.prisma.programme.findMany({
      where: {
        careers: {
          some: {
            career: {
              name: { contains: careerName, mode: 'insensitive' },
            },
          },
        },
      },
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
      },
      take: limit,
      orderBy: { name: 'asc' },
    });
  }

  async getSubjectRecommendations(subjectIds: string[], limit: number = 10) {
    return this.prisma.programme.findMany({
      where: {
        requirements: {
          some: {
            subjectId: { in: subjectIds },
          },
        },
      },
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
      take: limit,
      orderBy: { name: 'asc' },
    });
  }

  async getAlternativeProgrammes(
    missingSubjectIds: string[],
    limit: number = 5,
  ) {
    // Find programmes that DON'T require the missing subjects
    return this.prisma.programme.findMany({
      where: {
        requirements: {
          none: {
            subjectId: { in: missingSubjectIds },
          },
        },
      },
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
      take: limit,
      orderBy: { name: 'asc' },
    });
  }
}
