import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CompareService {
  constructor(private readonly prisma: PrismaService) {}

  async compare(programmeIds: string[]) {
    if (!programmeIds || programmeIds.length < 2) {
      throw new NotFoundException(
        'At least 2 programme IDs are required for comparison',
      );
    }

    const programmes = await this.prisma.programme.findMany({
      where: { id: { in: programmeIds } },
      include: {
        degree: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        department: {
          include: {
            academicUnit: {
              select: {
                id: true,
                name: true,
                abbreviation: true,
              },
            },
          },
        },
        requirements: {
          include: { subject: true },
          orderBy: [{ requirementType: 'asc' }, { subject: { name: 'asc' } }],
        },
        tuition: {
          orderBy: { academicYear: 'desc' },
          take: 1,
        },
        careers: {
          include: { career: true },
        },
      },
    });

    if (programmes.length !== programmeIds.length) {
      const foundIds = programmes.map((p) => p.id);
      const missing = programmeIds.filter((id) => !foundIds.includes(id));

      throw new NotFoundException(
        `Programmes not found: ${missing.join(', ')}`,
      );
    }

    return programmes;
  }

  async getComparisonTable(programmeIds: string[]) {
    const programmes = await this.compare(programmeIds);

    const headers = ['Attribute', ...programmes.map((p) => p.name)];

    const rows = [
      {
        attribute: 'Code',
        values: programmes.map((p) => p.code),
      },
      {
        attribute: 'Degree',
        values: programmes.map((p) => p.degree.name),
      },
      {
        attribute: 'Level',
        values: programmes.map((p) => p.level),
      },
      {
        attribute: 'Duration',
        values: programmes.map((p) => `${p.duration} years`),
      },
      {
        attribute: 'Faculty',
        values: programmes.map(
          (p) => p.department?.academicUnit?.name ?? 'N/A',
        ),
      },
      {
        attribute: 'Department',
        values: programmes.map((p) => p.department?.name ?? 'N/A'),
      },
      {
        attribute: 'Tuition (per year)',
        values: programmes.map((p) =>
          p.tuition[0]
            ? `${Number(p.tuition[0].amount).toLocaleString()} ${p.tuition[0].currency}`
            : 'N/A',
        ),
      },
      {
        attribute: 'Required Subjects',
        values: programmes.map(
          (p) =>
            p.requirements
              .filter((r) => r.requirementType === 'REQUIRED')
              .map((r) => r.subject.name)
              .join(', ') || 'None',
        ),
      },
      {
        attribute: 'Careers',
        values: programmes.map(
          (p) => p.careers.map((c) => c.career.name).join(', ') || 'None',
        ),
      },
    ];

    return { headers, rows };
  }
}