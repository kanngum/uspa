import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RequirementsService {
  constructor(private readonly prisma: PrismaService) {}

  async getProgrammeRequirements(programmeId: string) {
    const programme = await this.prisma.programme.findUnique({
      where: { id: programmeId },
      select: { id: true, name: true, code: true },
    });

    if (!programme) {
      throw new NotFoundException(`Programme with ID ${programmeId} not found`);
    }

    const requirements = await this.prisma.programmeRequirement.findMany({
      where: { programmeId },
      include: {
        subject: true,
      },
      orderBy: [{ requirementType: 'asc' }, { subject: { name: 'asc' } }],
    });

    return {
      programme,
      requirements,
      total: requirements.length,
    };
  }

  async addRequirement(
    programmeId: string,
    input: {
      subjectId: string;
      requirementType?: string;
      minimumGrade?: string;
    },
  ) {
    // Verify programme exists
    const programme = await this.prisma.programme.findUnique({
      where: { id: programmeId },
    });
    if (!programme) {
      throw new NotFoundException(`Programme with ID ${programmeId} not found`);
    }

    // Verify subject exists
    const subject = await this.prisma.subject.findUnique({
      where: { id: input.subjectId },
    });
    if (!subject) {
      throw new NotFoundException(
        `Subject with ID ${input.subjectId} not found`,
      );
    }

    // Check if requirement already exists
    const existing = await this.prisma.programmeRequirement.findUnique({
      where: {
        programmeId_subjectId: { programmeId, subjectId: input.subjectId },
      },
    });
    if (existing) {
      throw new NotFoundException(
        'This subject is already a requirement for this programme',
      );
    }

    return this.prisma.programmeRequirement.create({
      data: {
        programmeId,
        subjectId: input.subjectId,
        requirementType: (input.requirementType as any) || 'REQUIRED',
        minimumGrade: input.minimumGrade,
      },
      include: {
        subject: true,
        programme: {
          select: { id: true, name: true, code: true },
        },
      },
    });
  }

  async updateRequirement(
    requirementId: string,
    input: {
      requirementType?: string;
      minimumGrade?: string;
    },
  ) {
    const requirement = await this.prisma.programmeRequirement.findUnique({
      where: { id: requirementId },
    });
    if (!requirement) {
      throw new NotFoundException(
        `Requirement with ID ${requirementId} not found`,
      );
    }

    return this.prisma.programmeRequirement.update({
      where: { id: requirementId },
      data: {
        ...(input.requirementType !== undefined && {
          requirementType: input.requirementType as any,
        }),
        ...(input.minimumGrade !== undefined && {
          minimumGrade: input.minimumGrade,
        }),
      },
      include: {
        subject: true,
        programme: {
          select: { id: true, name: true, code: true },
        },
      },
    });
  }

  async removeRequirement(requirementId: string) {
    const requirement = await this.prisma.programmeRequirement.findUnique({
      where: { id: requirementId },
    });
    if (!requirement) {
      throw new NotFoundException(
        `Requirement with ID ${requirementId} not found`,
      );
    }

    await this.prisma.programmeRequirement.delete({
      where: { id: requirementId },
    });

    return { message: 'Requirement removed successfully' };
  }

  async bulkAddRequirements(
    programmeId: string,
    inputs: Array<{
      subjectId: string;
      requirementType?: string;
      minimumGrade?: string;
    }>,
  ) {
    // Verify programme exists
    const programme = await this.prisma.programme.findUnique({
      where: { id: programmeId },
    });
    if (!programme) {
      throw new NotFoundException(`Programme with ID ${programmeId} not found`);
    }

    const results: any[] = [];
    const errors: any[] = [];

    for (const input of inputs) {
      try {
        // Verify subject exists
        const subject = await this.prisma.subject.findUnique({
          where: { id: input.subjectId },
        });
        if (!subject) {
          errors.push({
            subjectId: input.subjectId,
            error: 'Subject not found',
          });
          continue;
        }

        // Check if already exists
        const existing = await this.prisma.programmeRequirement.findUnique({
          where: {
            programmeId_subjectId: { programmeId, subjectId: input.subjectId },
          },
        });
        if (existing) {
          errors.push({
            subjectId: input.subjectId,
            error: 'Already a requirement',
          });
          continue;
        }

        const created = await this.prisma.programmeRequirement.create({
          data: {
            programmeId,
            subjectId: input.subjectId,
            requirementType: (input.requirementType as any) || 'REQUIRED',
            minimumGrade: input.minimumGrade,
          },
          include: { subject: true },
        });
        results.push(created as any);
      } catch (err: any) {
        errors.push({ subjectId: input.subjectId, error: err.message });
      }
    }

    return { created: results, errors };
  }
}
