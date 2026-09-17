import { Injectable, NotFoundException } from '@nestjs/common';
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

  async getAllProgrammes(page: number = 1, limit: number = 20, search?: string, facultyId?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (search?.trim()) {
      where.OR = [
        { name: { contains: search.trim(), mode: 'insensitive' } },
        { code: { contains: search.trim(), mode: 'insensitive' } },
      ];
    }

    if (facultyId) {
      where.department = { academicUnitId: facultyId };
    }

    const [data, total] = await Promise.all([
      this.prisma.programme.findMany({
        where,
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
        isActive: input.isActive,
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

  async getCatalogueReview(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const where = { needsReview: true };
    const [data, total] = await Promise.all([
      this.prisma.programme.findMany({
        where, skip, take: limit, orderBy: { name: 'asc' },
        include: { department: { include: { academicUnit: { select: { name: true, abbreviation: true } } } }, tuition: { orderBy: { academicYear: 'desc' }, take: 1 } },
      }),
      this.prisma.programme.count({ where }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async resolveCatalogueReview(id: string, input: { applicationDeadline?: string; applicationStatus?: string; sourceCode?: string; feeAmount?: number; feePeriod?: string; academicYear?: string }) {
    const current = await this.prisma.programme.findUnique({ where: { id }, include: { tuition: true } });
    if (!current) throw new NotFoundException('Programme not found');
    const deadline = input.applicationDeadline ? new Date(input.applicationDeadline) : current.applicationDeadline;
    if (input.applicationDeadline && Number.isNaN(deadline?.getTime())) throw new Error('Enter a valid application deadline');
    if (input.feeAmount !== undefined && input.feeAmount <= 0) throw new Error('Fee must be greater than zero');
    const feeExists = input.feeAmount !== undefined || current.tuition.some((item) => Number(item.amount) > 0);
    const notes = [!deadline && 'Missing application deadline', !feeExists && 'Missing tuition fee', input.sourceCode && /[^A-Za-z0-9/_-]/.test(input.sourceCode) && 'Source code contains non-standard characters'].filter(Boolean).join('; ') || null;
    const status = input.applicationStatus ?? current.applicationStatus ?? 'Open';
    const programme = await this.prisma.programme.update({
      where: { id },
      data: { applicationDeadline: deadline, applicationStatus: status, sourceCode: input.sourceCode ?? current.sourceCode, isActive: status !== 'Closed', needsReview: Boolean(notes), reviewNotes: notes },
    });
    if (input.feeAmount !== undefined) {
      await this.prisma.tuition.upsert({
        where: { programmeId_academicYear: { programmeId: id, academicYear: input.academicYear || programme.applicationCycle || '2026/2027' } },
        update: { amount: input.feeAmount, feePeriod: (input.feePeriod as any) || 'UNKNOWN', currency: 'XAF' },
        create: { programmeId: id, academicYear: input.academicYear || programme.applicationCycle || '2026/2027', amount: input.feeAmount, feePeriod: (input.feePeriod as any) || 'UNKNOWN', currency: 'XAF' },
      });
    }
    return programme;
  }

  // ==================== PROGRAMME CAREER/KEYWORD ASSOCIATIONS ====================

  async addProgrammeCareer(programmeId: string, careerId: string) {
    return this.prisma.programmeCareer.create({
      data: { programmeId, careerId },
      include: { career: true },
    });
  }

  async removeProgrammeCareer(programmeId: string, careerId: string) {
    await this.prisma.programmeCareer.delete({
      where: { programmeId_careerId: { programmeId, careerId } },
    });
    return { message: 'Career removed from programme' };
  }

  async addProgrammeKeyword(programmeId: string, keywordId: string) {
    return this.prisma.programmeKeyword.create({
      data: { programmeId, keywordId },
      include: { keyword: true },
    });
  }

  async removeProgrammeKeyword(programmeId: string, keywordId: string) {
    await this.prisma.programmeKeyword.delete({
      where: { programmeId_keywordId: { programmeId, keywordId } },
    });
    return { message: 'Keyword removed from programme' };
  }

  // ==================== USER MANAGEMENT ====================

  async getAllUsers(page: number = 1, limit: number = 20, search?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (search?.trim()) {
      where.OR = [
        { firstName: { contains: search.trim(), mode: 'insensitive' } },
        { lastName: { contains: search.trim(), mode: 'insensitive' } },
        { email: { contains: search.trim(), mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
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
      this.prisma.user.count({ where }),
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
      throw new NotFoundException('User not found');
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
        include: {
          _count: { select: { requirements: true } },
        },
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
      throw new NotFoundException('Subject not found');
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
      throw new NotFoundException('Subject not found');
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

  // ==================== UNIVERSITY MANAGEMENT ====================

  async createUniversity(input: { name: string; abbreviation: string; description?: string; website?: string }) {
    const existing = await this.prisma.university.findUnique({ where: { abbreviation: input.abbreviation } });
    if (existing) throw new Error(`University with abbreviation "${input.abbreviation}" already exists`);

    return this.prisma.university.create({ data: input });
  }

  async updateUniversity(id: string, input: { name?: string; abbreviation?: string; description?: string; website?: string }) {
    const university = await this.prisma.university.findUnique({ where: { id } });
    if (!university) throw new NotFoundException('University not found');
    return this.prisma.university.update({ where: { id }, data: input });
  }

  async deleteUniversity(id: string) {
    const university = await this.prisma.university.findUnique({ where: { id } });
    if (!university) throw new NotFoundException('University not found');

    const unitCount = await this.prisma.academicUnit.count({ where: { universityId: id } });
    if (unitCount > 0) throw new Error(`Cannot delete "${university.name}" - it has ${unitCount} academic unit(s)`);

    await this.prisma.university.delete({ where: { id } });
    return { message: 'University deleted successfully' };
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
        type: input.type,
      },
    });
  }

  async deleteFaculty(id: string) {
    const faculty = await this.prisma.academicUnit.findUnique({
      where: { id },
      include: { _count: { select: { departments: true } } },
    });
    if (!faculty) throw new NotFoundException('Faculty not found');
    if (faculty._count.departments > 0) {
      throw new Error(
        `Cannot delete "${faculty.name}" - it has ${faculty._count.departments} department(s)`,
      );
    }
    await this.prisma.academicUnit.delete({ where: { id } });
    return { message: 'Faculty deleted successfully' };
  }

  async createDepartment(input: {
    name: string;
    abbreviation?: string;
    description?: string;
    academicUnitId: string;
  }) {
    return this.prisma.department.create({
      data: input,
      include: { _count: { select: { programmes: true } } },
    });
  }

  async updateDepartment(id: string, input: any) {
    return this.prisma.department.update({
      where: { id },
      data: input,
    });
  }

  async deleteDepartment(id: string) {
    const dept = await this.prisma.department.findUnique({
      where: { id },
      include: { _count: { select: { programmes: true } } },
    });
    if (!dept) throw new NotFoundException('Department not found');
    if (dept._count.programmes > 0) {
      throw new Error(
        `Cannot delete "${dept.name}" - it has ${dept._count.programmes} programme(s)`,
      );
    }
    await this.prisma.department.delete({ where: { id } });
    return { message: 'Department deleted successfully' };
  }

  async getAllDepartments(page: number = 1, limit: number = 200, search?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (search?.trim()) {
      where.OR = [
        { name: { contains: search.trim(), mode: 'insensitive' } },
        { abbreviation: { contains: search.trim(), mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.department.findMany({
        where,
        skip,
        take: limit,
        include: {
          academicUnit: {
            select: { id: true, name: true, abbreviation: true },
          },
          _count: { select: { programmes: true } },
        },
        orderBy: { name: 'asc' },
      }),
      this.prisma.department.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // ==================== TUITION MANAGEMENT ====================

  async getAllTuition(page: number = 1, limit: number = 50, programmeId?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (programmeId) where.programmeId = programmeId;

    const [data, total] = await Promise.all([
      this.prisma.tuition.findMany({
        where,
        skip,
        take: limit,
        include: {
          programme: {
            select: { id: true, name: true, code: true },
          },
        },
        orderBy: [{ programme: { name: 'asc' } }, { academicYear: 'desc' }],
      }),
      this.prisma.tuition.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async createTuition(input: {
    programmeId: string;
    academicYear: string;
    amount: number;
    currency?: string;
  }) {
    return this.prisma.tuition.create({
      data: {
        programmeId: input.programmeId,
        academicYear: input.academicYear,
        amount: input.amount,
        currency: input.currency || 'XAF',
      },
      include: {
        programme: { select: { id: true, name: true, code: true } },
      },
    });
  }

  async updateTuition(id: string, input: { academicYear?: string; amount?: number; currency?: string }) {
    const tuition = await this.prisma.tuition.findUnique({ where: { id } });
    if (!tuition) throw new NotFoundException('Tuition record not found');

    return this.prisma.tuition.update({
      where: { id },
      data: {
        ...(input.academicYear !== undefined && { academicYear: input.academicYear }),
        ...(input.amount !== undefined && { amount: input.amount }),
        ...(input.currency !== undefined && { currency: input.currency }),
      },
      include: {
        programme: { select: { id: true, name: true, code: true } },
      },
    });
  }

  async deleteTuition(id: string) {
    await this.prisma.tuition.delete({ where: { id } });
    return { message: 'Tuition record deleted' };
  }

  // ==================== CAREER MANAGEMENT ====================

  async getAllCareers(page: number = 1, limit: number = 50, search?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (search?.trim()) {
      where.name = { contains: search.trim(), mode: 'insensitive' };
    }

    const [data, total] = await Promise.all([
      this.prisma.career.findMany({
        where,
        skip,
        take: limit,
        include: { _count: { select: { programmes: true } } },
        orderBy: { name: 'asc' },
      }),
      this.prisma.career.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async createCareer(input: { name: string; description?: string }) {
    return this.prisma.career.create({ data: input });
  }

  async updateCareer(id: string, input: { name?: string; description?: string }) {
    const career = await this.prisma.career.findUnique({ where: { id } });
    if (!career) throw new NotFoundException('Career not found');
    return this.prisma.career.update({
      where: { id },
      data: {
        ...(input.name !== undefined && { name: input.name }),
        ...(input.description !== undefined && { description: input.description }),
      },
    });
  }

  async deleteCareer(id: string) {
    const count = await this.prisma.programmeCareer.count({ where: { careerId: id } });
    if (count > 0) {
      throw new Error(`Cannot delete - used in ${count} programme(s)`);
    }
    await this.prisma.career.delete({ where: { id } });
    return { message: 'Career deleted' };
  }

  // ==================== KEYWORD MANAGEMENT ====================

  async getAllKeywords(page: number = 1, limit: number = 50, search?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (search?.trim()) {
      where.word = { contains: search.trim(), mode: 'insensitive' };
    }

    const [data, total] = await Promise.all([
      this.prisma.keyword.findMany({
        where,
        skip,
        take: limit,
        include: { _count: { select: { programmes: true } } },
        orderBy: { word: 'asc' },
      }),
      this.prisma.keyword.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async createKeyword(input: { word: string }) {
    return this.prisma.keyword.create({ data: input });
  }

  async updateKeyword(id: string, input: { word?: string }) {
    const keyword = await this.prisma.keyword.findUnique({ where: { id } });
    if (!keyword) throw new NotFoundException('Keyword not found');
    return this.prisma.keyword.update({
      where: { id },
      data: { ...(input.word !== undefined && { word: input.word }) },
    });
  }

  async deleteKeyword(id: string) {
    const count = await this.prisma.programmeKeyword.count({ where: { keywordId: id } });
    if (count > 0) {
      throw new Error(`Cannot delete - used in ${count} programme(s)`);
    }
    await this.prisma.keyword.delete({ where: { id } });
    return { message: 'Keyword deleted' };
  }

  // ==================== ADMISSION RULES MANAGEMENT ====================

  async getAllAdmissionRules(page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.generalAdmissionRule.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.generalAdmissionRule.count(),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async createAdmissionRule(input: { title: string; description: string; isActive?: boolean }) {
    return this.prisma.generalAdmissionRule.create({ data: input });
  }

  async updateAdmissionRule(id: string, input: { title?: string; description?: string; isActive?: boolean }) {
    return this.prisma.generalAdmissionRule.update({
      where: { id },
      data: {
        ...(input.title !== undefined && { title: input.title }),
        ...(input.description !== undefined && { description: input.description }),
        ...(input.isActive !== undefined && { isActive: input.isActive }),
      },
    });
  }

  async deleteAdmissionRule(id: string) {
    await this.prisma.generalAdmissionRule.delete({ where: { id } });
    return { message: 'Admission rule deleted' };
  }

  // ==================== DUPLICATE DETECTION ====================

  async detectDuplicateFaculties() {
    const faculties = await this.prisma.academicUnit.findMany();

    const nameMap = new Map<string, typeof faculties>();
    for (const f of faculties) {
      const key = f.name.toLowerCase().trim();
      if (!nameMap.has(key)) nameMap.set(key, []);
      nameMap.get(key)!.push(f);
    }

    return Array.from(nameMap.entries())
      .filter(([, group]) => group.length > 1)
      .map(([name, group]) => ({
        name,
        count: group.length,
        items: group.map((f) => ({ id: f.id, name: f.name, abbreviation: f.abbreviation })),
      }));
  }

  async detectDuplicateProgrammes() {
    const programmes = await this.prisma.programme.findMany({
      select: { id: true, name: true, code: true },
    });

    const nameMap = new Map<string, typeof programmes>();
    for (const p of programmes) {
      const key = p.name.toLowerCase().trim();
      if (!nameMap.has(key)) nameMap.set(key, []);
      nameMap.get(key)!.push(p);
    }

    const codeMap = new Map<string, typeof programmes>();
    for (const p of programmes) {
      const key = p.code.toLowerCase().trim();
      if (!codeMap.has(key)) codeMap.set(key, []);
      codeMap.get(key)!.push(p);
    }

    const nameDupes = Array.from(nameMap.entries())
      .filter(([, group]) => group.length > 1)
      .map(([name, group]) => ({ field: 'name', value: name, count: group.length, items: group }));

    const codeDupes = Array.from(codeMap.entries())
      .filter(([, group]) => group.length > 1)
      .map(([code, group]) => ({ field: 'code', value: code, count: group.length, items: group }));

    return [...nameDupes, ...codeDupes];
  }

  async detectDuplicateSubjects() {
    const subjects = await this.prisma.subject.findMany();

    const nameMap = new Map<string, typeof subjects>();
    for (const s of subjects) {
      const key = s.name.toLowerCase().trim();
      if (!nameMap.has(key)) nameMap.set(key, []);
      nameMap.get(key)!.push(s);
    }

    return Array.from(nameMap.entries())
      .filter(([, group]) => group.length > 1)
      .map(([name, group]) => ({
        name,
        count: group.length,
        items: group.map((s) => ({ id: s.id, name: s.name, code: s.code, level: s.level })),
      }));
  }

  // ==================== ANNOUNCEMENTS ====================

  async createAnnouncement(input: {
    title: string;
    content: string;
    programmeId?: string;
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
        programme: {
          select: { id: true, name: true, code: true },
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
      throw new NotFoundException('Announcement not found');
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
