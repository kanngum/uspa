import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  // ==================== DASHBOARD ANALYTICS ====================

  async getDashboardStats() {
    const [
      totalProgrammes,
      totalFaculties,
      totalDepartments,
      totalUsers,
      totalSubjects,
      totalSearches,
    ] = await Promise.all([
      this.prisma.programme.count(),
      this.prisma.academicUnit.count(),
      this.prisma.department.count(),
      this.prisma.user.count(),
      this.prisma.subject.count(),
      this.prisma.searchHistory.count(),
    ]);

    return {
      totalProgrammes,
      totalFaculties,
      totalDepartments,
      totalUsers,
      totalSubjects,
      totalSearches,
    };
  }

  async getProgrammesByFaculty() {
    const faculties = await this.prisma.academicUnit.findMany({
      include: {
        departments: {
          include: {
            _count: { select: { programmes: true } },
          },
        },
      },
    });

    return faculties.map((f) => ({
      id: f.id,
      name: f.name,
      abbreviation: f.abbreviation,
      departmentCount: f.departments.length,
      programmeCount: f.departments.reduce(
        (acc, d) => acc + d._count.programmes,
        0,
      ),
    }));
  }

  async getPopularSearches(limit: number = 10) {
    const searches = await this.prisma.searchHistory.groupBy({
      by: ['query'],
      _count: { query: true },
      orderBy: { _count: { query: 'desc' } },
      take: limit,
    });

    return searches.map((s) => ({
      query: s.query,
      count: s._count.query,
    }));
  }

  async getRecentSearches(limit: number = 20) {
    return this.prisma.searchHistory.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, firstName: true, lastName: true } },
      },
    });
  }

  async getUserStats() {
    const usersByRole = await this.prisma.user.groupBy({
      by: ['role'],
      _count: { role: true },
    });

    const total = usersByRole.reduce((acc, u) => acc + u._count.role, 0);

    return {
      total,
      byRole: usersByRole.map((u) => ({
        role: u.role,
        count: u._count.role,
      })),
    };
  }

  // ==================== PROGRAMME MANAGEMENT ====================

  async getAllProgrammes(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.programme.findMany({
        skip,
        take: limit,
        include: {
          department: {
            include: {
              academicUnit: {
                select: { id: true, name: true, abbreviation: true },
              },
            },
          },
          tuition: {
            orderBy: { academicYear: 'desc' },
            take: 1,
          },
          _count: {
            select: { requirements: true, careers: true },
          },
        },
        orderBy: { name: 'asc' },
      }),
      this.prisma.programme.count(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateProgramme(id: string, input: any) {
    const programme = await this.prisma.programme.update({
      where: { id },
      data: {
        name: input.name,
        code: input.code,
        degree: input.degree,
        level: input.level,
        duration: input.duration,
        description: input.description,
        departmentId: input.departmentId,
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

    return programme;
  }

  async deleteProgramme(id: string) {
    await this.prisma.programme.delete({ where: { id } });
    return { message: 'Programme deleted successfully' };
  }

  // ==================== USER MANAGEMENT ====================

  async getAllUsers(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          createdAt: true,
          _count: {
            select: { savedProgrammes: true, searchHistory: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateUserRole(userId: string, role: string) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { role: role as any },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
      },
    });

    return user;
  }

  async toggleUserActive(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { isActive: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { isActive: !user.isActive },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
      },
    });

    return updated;
  }

  // ==================== CREATE PROGRAMME ====================

  async createProgramme(input: {
    departmentId: string;
    code: string;
    name: string;
    degree: string;
    level: string;
    duration: number;
    description?: string;
  }) {
    // Check code uniqueness
    const existing = await this.prisma.programme.findUnique({
      where: { code: input.code },
    });
    if (existing) {
      throw new Error(`Programme with code "${input.code}" already exists`);
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

  // ==================== SUBJECT MANAGEMENT ====================

  async getAllSubjects(
    page: number = 1,
    limit: number = 50,
    search?: string,
    level?: string,
  ) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (search?.trim()) {
      where.OR = [
        { name: { contains: search.trim(), mode: 'insensitive' } },
        { code: { contains: search.trim(), mode: 'insensitive' } },
      ];
    }

    if (level) {
      where.level = level;
    }

    const [data, total] = await Promise.all([
      this.prisma.subject.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      this.prisma.subject.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async createSubject(input: { name: string; code?: string; level: string }) {
    const existing = await this.prisma.subject.findUnique({
      where: { name: input.name },
    });
    if (existing) {
      throw new Error(`Subject "${input.name}" already exists`);
    }

    return this.prisma.subject.create({
      data: {
        name: input.name,
        code: input.code,
        level: input.level as any,
      },
    });
  }

  async updateSubject(
    id: string,
    input: { name?: string; code?: string; level?: string },
  ) {
    const subject = await this.prisma.subject.findUnique({ where: { id } });
    if (!subject) {
      throw new Error('Subject not found');
    }

    if (input.name && input.name !== subject.name) {
      const existing = await this.prisma.subject.findUnique({
        where: { name: input.name },
      });
      if (existing) {
        throw new Error(`Subject "${input.name}" already exists`);
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

  async deleteSubject(id: string) {
    const subject = await this.prisma.subject.findUnique({ where: { id } });
    if (!subject) {
      throw new Error('Subject not found');
    }

    const count = await this.prisma.programmeRequirement.count({
      where: { subjectId: id },
    });
    if (count > 0) {
      throw new Error(
        `Cannot delete "${subject.name}" - used in ${count} programme requirement(s)`,
      );
    }

    await this.prisma.subject.delete({ where: { id } });
    return { message: 'Subject deleted successfully' };
  }

  // ==================== FACULTY/DEPARTMENT MANAGEMENT ====================

  async createFaculty(input: {
    name: string;
    abbreviation: string;
    description?: string;
  }) {
    const university = await this.prisma.university.findFirst();

    return this.prisma.academicUnit.create({
      data: {
        name: input.name,
        abbreviation: input.abbreviation,
        description: input.description,
        type: 'FACULTY',
        universityId: university!.id,
      },
    });
  }

  async updateFaculty(id: string, input: any) {
    return this.prisma.academicUnit.update({
      where: { id },
      data: {
        name: input.name,
        abbreviation: input.abbreviation,
        description: input.description,
      },
    });
  }

  async createDepartment(input: {
    name: string;
    abbreviation?: string;
    description?: string;
    academicUnitId: string;
  }) {
    return this.prisma.department.create({ data: input });
  }

  async updateDepartment(id: string, input: any) {
    return this.prisma.department.update({
      where: { id },
      data: input,
    });
  }

  // ==================== ANNOUNCEMENTS ====================

  async createAnnouncement(input: {
    title: string;
    content: string;
    authorId: string;
  }) {
    return this.prisma.announcement.create({ data: input });
  }

  async getAnnouncements(published?: boolean) {
    const where: any = {};
    if (published !== undefined) where.published = published;

    return this.prisma.announcement.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });
  }

  async toggleAnnouncement(id: string) {
    const announcement = await this.prisma.announcement.findUnique({
      where: { id },
      select: { published: true },
    });

    if (!announcement) {
      throw new Error('Announcement not found');
    }

    return this.prisma.announcement.update({
      where: { id },
      data: { published: !announcement.published },
    });
  }

  async deleteAnnouncement(id: string) {
    await this.prisma.announcement.delete({ where: { id } });
    return { message: 'Announcement deleted' };
  }
}
