import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SubjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: {
    page?: number;
    limit?: number;
    search?: string;
    level?: string;
  }) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, Math.max(1, params.limit || 50));

    const where: any = {};

    if (params.search?.trim()) {
      where.OR = [
        { name: { contains: params.search.trim(), mode: 'insensitive' } },
        { code: { contains: params.search.trim(), mode: 'insensitive' } },
      ];
    }

    if (params.level) {
      where.level = params.level;
    }

    const [data, total] = await Promise.all([
      this.prisma.subject.findMany({
        where,
        include: {
          _count: {
            select: { requirements: true },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { name: 'asc' },
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

  async findOne(id: string) {
    const subject = await this.prisma.subject.findUnique({
      where: { id },
      include: {
        requirements: {
          include: {
            programme: {
              select: {
                id: true,
                name: true,
                code: true,
                degree: true,
              },
            },
          },
          take: 20,
        },
      },
    });

    if (!subject) {
      throw new NotFoundException(`Subject with ID ${id} not found`);
    }

    return subject;
  }

  async create(input: { name: string; code?: string; level: string }) {
    const existing = await this.prisma.subject.findUnique({
      where: { name: input.name },
    });

    if (existing) {
      throw new NotFoundException(`Subject "${input.name}" already exists`);
    }

    return this.prisma.subject.create({
      data: {
        name: input.name,
        code: input.code,
        level: input.level as any,
      },
    });
  }

  async update(
    id: string,
    input: { name?: string; code?: string; level?: string },
  ) {
    const subject = await this.prisma.subject.findUnique({
      where: { id },
    });

    if (!subject) {
      throw new NotFoundException(`Subject with ID ${id} not found`);
    }

    // Check name uniqueness if name is being changed
    if (input.name && input.name !== subject.name) {
      const existing = await this.prisma.subject.findUnique({
        where: { name: input.name },
      });
      if (existing) {
        throw new NotFoundException(`Subject "${input.name}" already exists`);
      }
    }

    return this.prisma.subject.update({
      where: { id },
      data: {
        ...(input.name !== undefined && { name: input.name }),
        ...(input.code !== undefined && { code: input.code }),
        ...(input.level !== undefined && { level: input.level as any }),
      },
    });
  }

  async remove(id: string) {
    const subject = await this.prisma.subject.findUnique({
      where: { id },
    });

    if (!subject) {
      throw new NotFoundException(`Subject with ID ${id} not found`);
    }

    // Check if subject is used in any requirements
    const requirementCount = await this.prisma.programmeRequirement.count({
      where: { subjectId: id },
    });

    if (requirementCount > 0) {
      throw new NotFoundException(
        `Cannot delete subject "${subject.name}" because it is used in ${requirementCount} programme requirement(s). Remove the requirements first.`,
      );
    }

    await this.prisma.subject.delete({ where: { id } });
    return { message: 'Subject deleted successfully' };
  }

  async getByLevel(level: string) {
    return this.prisma.subject.findMany({
      where: { level: level as any },
      orderBy: { name: 'asc' },
    });
  }
}
