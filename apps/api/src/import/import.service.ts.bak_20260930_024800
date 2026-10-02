import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface ImportValidationResult {
  valid: boolean;
  totalRows: number;
  validRows: number;
  errorRows: number;
  errors: Array<{ row: number; field: string; message: string }>;
  preview: any[];
}

export interface ImportSummary {
  type: string;
  created: number;
  skipped: number;
  errors: Array<{ item: string; reason: string }>;
  message: string;
}

@Injectable()
export class ImportService {
  constructor(private readonly prisma: PrismaService) {}

  async validate(type: string, data: any[]): Promise<ImportValidationResult> {
    switch (type) {
      case 'faculties':
        return this.validateFaculties(data);
      case 'departments':
        return this.validateDepartments(data);
      case 'programmes':
        return this.validateProgrammes(data);
      case 'subjects':
        return this.validateSubjects(data);
      case 'requirements':
        return this.validateRequirements(data);
      case 'tuition':
        return this.validateTuition(data);
      case 'careers':
        return this.validateCareers(data);
      default:
        throw new BadRequestException(`Unknown import type: ${type}`);
    }
  }

  async preview(type: string, data: any[]): Promise<ImportValidationResult> {
    const result = await this.validate(type, data);

    result.preview = result.preview.map((row: any) => ({
      ...row,
      _preview: true,
    }));

    return result;
  }

  async confirm(type: string, data: any[]): Promise<ImportSummary> {
    switch (type) {
      case 'faculties':
        return this.importFaculties(data);
      case 'departments':
        return this.importDepartments(data);
      case 'programmes':
        return this.importProgrammes(data);
      case 'subjects':
        return this.importSubjects(data);
      case 'requirements':
        return this.importRequirements(data);
      case 'tuition':
        return this.importTuition(data);
      case 'careers':
        return this.importCareers(data);
      default:
        throw new BadRequestException(`Unknown import type: ${type}`);
    }
  }

  async upload(data: any): Promise<ImportValidationResult> {
    if (!data) {
      throw new BadRequestException('No data provided for upload');
    }

    const rows = Array.isArray(data)
      ? data
      : Object.values(data).find((value) => Array.isArray(value));

    if (!Array.isArray(rows)) {
      throw new BadRequestException(
        'Upload payload must contain an array of records',
      );
    }

    const type = this.detectImportType(rows);

    if (!type) {
      throw new BadRequestException(
        'Unable to detect import type. Provide a top-level array of objects for faculties, departments, programmes, subjects, requirements, tuition, or careers.',
      );
    }

    return this.validate(type, rows);
  }

  async quick(type: string, data: any[]): Promise<ImportSummary> {
    const validation = await this.validate(type, data);

    if (!validation.valid) {
      throw new BadRequestException(
        `Import validation failed: ${validation.errors
          .map((e) => `${e.field}: ${e.message}`)
          .join(', ')}`,
      );
    }

    return this.confirm(type, data);
  }

  private detectImportType(data: any[]): string | null {
    if (!Array.isArray(data) || data.length === 0) {
      return null;
    }

    const sample = data[0];

    if (sample.programmeId && sample.academicYear && sample.amount) {
      return 'tuition';
    }

    if (sample.programmeId || sample.programmeCode) {
      if (sample.subjectId || sample.requirementType) {
        return 'requirements';
      }

      return 'programmes';
    }

    if (sample.departmentId || sample.departmentName || sample.facultyName) {
      return 'departments';
    }

    if (sample.name && sample.level && !sample.degree) {
      return 'subjects';
    }

    if (sample.name && sample.description && !sample.code) {
      return 'careers';
    }

    if (sample.name && (sample.abbreviation || sample.type)) {
      return 'faculties';
    }

    return null;
  }

  // ==================== FACULTIES ====================

  private async validateFaculties(
    data: any[],
  ): Promise<ImportValidationResult> {
    const errors: Array<{
      row: number;
      field: string;
      message: string;
    }> = [];

    const preview: any[] = [];

    const university = await this.prisma.university.findFirst();

    if (!university) {
      throw new BadRequestException(
        'No university found. Create a university first.',
      );
    }

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const rowNum = i + 1;
      let rowErrors = 0;

      if (!row.name || typeof row.name !== 'string') {
        errors.push({
          row: rowNum,
          field: 'name',
          message: 'Name is required',
        });
        rowErrors++;
      }

      if (row.name) {
        const existing = await this.prisma.academicUnit.findFirst({
          where: {
            name: {
              equals: row.name,
              mode: 'insensitive',
            },
          },
        });

        if (existing) {
          errors.push({
            row: rowNum,
            field: 'name',
            message: `"${row.name}" already exists`,
          });
          rowErrors++;
        }
      }

      preview.push({
        _valid: rowErrors === 0,
        _errors: rowErrors,
        name: row.name || '',
        abbreviation: row.abbreviation || '',
        description: row.description || '',
        type: row.type || 'FACULTY',
      });
    }

    return {
      valid: errors.length === 0,
      totalRows: data.length,
      validRows: preview.filter((p: any) => p._valid).length,
      errorRows: preview.filter((p: any) => !p._valid).length,
      errors,
      preview,
    };
  }

  private async importFaculties(
    data: any[],
  ): Promise<ImportSummary> {
    const university = await this.prisma.university.findFirst();

    if (!university) {
      throw new BadRequestException(
        'No university found. Create a university first.',
      );
    }

    const created: string[] = [];
    const errors: Array<{ item: string; reason: string }> = [];

    for (const row of data) {
      try {
        const typeValue = String(row.type || 'FACULTY').trim();

        const academicUnitType =
          await this.prisma.academicUnitType.findFirst({
            where: {
              OR: [
                { code: typeValue.toUpperCase() },
                { name: typeValue },
              ],
            },
          });

        if (!academicUnitType) {
          errors.push({
            item: row.name,
            reason: `Academic unit type not found: ${typeValue}`,
          });
          continue;
        }

        await this.prisma.academicUnit.create({
          data: {
            name: row.name,
            abbreviation: row.abbreviation || '',
            description: row.description || '',
            typeId: academicUnitType.id,
            universityId: university.id,
          },
        });

        created.push(row.name);
      } catch (err: any) {
        errors.push({
          item: row.name,
          reason: err.message,
        });
      }
    }

    return {
      type: 'faculties',
      created: created.length,
      skipped: data.length - created.length - errors.length,
      errors,
      message: `Successfully imported ${created.length} faculty/faculties`,
    };
  }

  // ==================== DEPARTMENTS ====================

  private async validateDepartments(
    data: any[],
  ): Promise<ImportValidationResult> {
    const errors: Array<{
      row: number;
      field: string;
      message: string;
    }> = [];

    const preview: any[] = [];
    const faculties = await this.prisma.academicUnit.findMany();

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const rowNum = i + 1;
      let rowErrors = 0;

      if (!row.name) {
        errors.push({
          row: rowNum,
          field: 'name',
          message: 'Name is required',
        });
        rowErrors++;
      }

      if (!row.facultyId && !row.facultyName) {
        errors.push({
          row: rowNum,
          field: 'facultyId/facultyName',
          message: 'Faculty identifier is required',
        });
        rowErrors++;
      }

      const faculty = row.facultyId
        ? faculties.find((f) => f.id === row.facultyId)
        : faculties.find(
            (f) =>
              f.name.toLowerCase() ===
              (row.facultyName || '').toLowerCase(),
          );

      if (!faculty && (row.facultyId || row.facultyName)) {
        errors.push({
          row: rowNum,
          field: 'facultyId',
          message: `Faculty not found: ${
            row.facultyId || row.facultyName
          }`,
        });
        rowErrors++;
      }

      preview.push({
        _valid: rowErrors === 0,
        _errors: rowErrors,
        name: row.name || '',
        abbreviation: row.abbreviation || '',
        description: row.description || '',
        faculty: faculty
          ? {
              id: faculty.id,
              name: faculty.name,
            }
          : null,
        facultyName: row.facultyName || '',
      });
    }

    return {
      valid: errors.length === 0,
      totalRows: data.length,
      validRows: preview.filter((p: any) => p._valid).length,
      errorRows: preview.filter((p: any) => !p._valid).length,
      errors,
      preview,
    };
  }

  private async importDepartments(
    data: any[],
  ): Promise<ImportSummary> {
    const faculties = await this.prisma.academicUnit.findMany();

    const created: string[] = [];
    const errors: Array<{ item: string; reason: string }> = [];

    for (const row of data) {
      try {
        const faculty = row.facultyId
          ? faculties.find((f) => f.id === row.facultyId)
          : faculties.find(
              (f) =>
                f.name.toLowerCase() ===
                (row.facultyName || '').toLowerCase(),
            );

        if (!faculty) {
          errors.push({
            item: row.name,
            reason: 'Faculty not found',
          });
          continue;
        }

        await this.prisma.department.create({
          data: {
            name: row.name,
            abbreviation: row.abbreviation || '',
            description: row.description || '',
            academicUnitId: faculty.id,
          },
        });

        created.push(row.name);
      } catch (err: any) {
        errors.push({
          item: row.name,
          reason: err.message,
        });
      }
    }

    return {
      type: 'departments',
      created: created.length,
      skipped: data.length - created.length - errors.length,
      errors,
      message: `Successfully imported ${created.length} department(s)`,
    };
  }

  // ==================== PROGRAMMES ====================

  private async validateProgrammes(
    data: any[],
  ): Promise<ImportValidationResult> {
    const errors: Array<{
      row: number;
      field: string;
      message: string;
    }> = [];

    const preview: any[] = [];

    const departments =
      await this.prisma.department.findMany({
        include: {
          academicUnit: true,
        },
      });

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const rowNum = i + 1;
      let rowErrors = 0;

      if (!row.name) {
        errors.push({
          row: rowNum,
          field: 'name',
          message: 'Name is required',
        });
        rowErrors++;
      }

      if (!row.code) {
        errors.push({
          row: rowNum,
          field: 'code',
          message: 'Code is required',
        });
        rowErrors++;
      }

      if (!row.degree) {
        errors.push({
          row: rowNum,
          field: 'degree',
          message: 'Degree type is required',
        });
        rowErrors++;
      }

      if (!row.level) {
        errors.push({
          row: rowNum,
          field: 'level',
          message: 'Level is required',
        });
        rowErrors++;
      }

      if (!row.duration) {
        errors.push({
          row: rowNum,
          field: 'duration',
          message: 'Duration is required',
        });
        rowErrors++;
      }

      if (row.code) {
        const existing =
          await this.prisma.programme.findUnique({
            where: { code: row.code },
          });

        if (existing) {
          errors.push({
            row: rowNum,
            field: 'code',
            message: `Code "${row.code}" already exists`,
          });
          rowErrors++;
        }
      }

      const department = row.departmentId
        ? departments.find((d) => d.id === row.departmentId)
        : row.departmentName
          ? departments.find(
              (d) =>
                d.name.toLowerCase() ===
                row.departmentName.toLowerCase(),
            )
          : undefined;

      preview.push({
        _valid: rowErrors === 0,
        _errors: rowErrors,
        name: row.name || '',
        code: row.code || '',
        degree: row.degree || '',
        level: row.level || '',
        duration: row.duration || 0,
        description: row.description || '',
        department: department
          ? {
              id: department.id,
              name: department.name,
              faculty: department.academicUnit.name,
            }
          : null,
        departmentName: row.departmentName || '',
      });
    }

    return {
      valid: errors.length === 0,
      totalRows: data.length,
      validRows: preview.filter((p: any) => p._valid).length,
      errorRows: preview.filter((p: any) => !p._valid).length,
      errors,
      preview,
    };
  }

  private async importProgrammes(
    data: any[],
  ): Promise<ImportSummary> {
    const departments =
      await this.prisma.department.findMany();

    const created: string[] = [];
    const errors: Array<{ item: string; reason: string }> = [];

    for (const row of data) {
      try {
        const dept = row.departmentId
          ? departments.find((d) => d.id === row.departmentId)
          : departments.find(
              (d) =>
                d.name.toLowerCase() ===
                (row.departmentName || '').toLowerCase(),
            );

        if (!dept) {
          errors.push({
            item: `${row.code} - ${row.name}`,
            reason: 'Department not found',
          });
          continue;
        }

        const degreeValue = String(row.degree || '').trim();

        const degreeType =
          await this.prisma.degreeType.findFirst({
            where: {
              OR: [
                { code: degreeValue.toUpperCase() },
                { name: degreeValue },
              ],
            },
          });

        if (!degreeType) {
          errors.push({
            item: `${row.code} - ${row.name}`,
            reason: `Degree type not found: ${degreeValue}`,
          });
          continue;
        }

        await this.prisma.programme.create({
          data: {
            departmentId: dept.id,
            code: row.code,
            name: row.name,
            degreeId: degreeType.id,
            level: row.level,
            duration: parseInt(row.duration, 10) || 3,
            description: row.description || '',
          },
        });

        created.push(`${row.code} - ${row.name}`);
      } catch (err: any) {
        errors.push({
          item: `${row.code} - ${row.name}`,
          reason: err.message,
        });
      }
    }

    return {
      type: 'programmes',
      created: created.length,
      skipped: data.length - created.length - errors.length,
      errors,
      message: `Successfully imported ${created.length} programme(s)`,
    };
  }

  // ==================== SUBJECTS ====================

  private async validateSubjects(
    data: any[],
  ): Promise<ImportValidationResult> {
    const errors: Array<{
      row: number;
      field: string;
      message: string;
    }> = [];

    const preview: any[] = [];

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const rowNum = i + 1;
      let rowErrors = 0;

      if (!row.name) {
        errors.push({
          row: rowNum,
          field: 'name',
          message: 'Name is required',
        });
        rowErrors++;
      }

      if (!row.level) {
        errors.push({
          row: rowNum,
          field: 'level',
          message: 'Level (O_LEVEL/A_LEVEL) is required',
        });
        rowErrors++;
      }

      if (
        row.level &&
        !['O_LEVEL', 'A_LEVEL'].includes(
          row.level.toUpperCase(),
        )
      ) {
        errors.push({
          row: rowNum,
          field: 'level',
          message: 'Level must be O_LEVEL or A_LEVEL',
        });
        rowErrors++;
      }

      if (row.name) {
        const existing =
          await this.prisma.subject.findFirst({
            where: {
              name: {
                equals: row.name,
                mode: 'insensitive',
              },
            },
          });

        if (existing) {
          errors.push({
            row: rowNum,
            field: 'name',
            message: `"${row.name}" already exists`,
          });
          rowErrors++;
        }
      }

      preview.push({
        _valid: rowErrors === 0,
        _errors: rowErrors,
        name: row.name || '',
        code: row.code || '',
        level: row.level || '',
      });
    }

    return {
      valid: errors.length === 0,
      totalRows: data.length,
      validRows: preview.filter((p: any) => p._valid).length,
      errorRows: preview.filter((p: any) => !p._valid).length,
      errors,
      preview,
    };
  }

  private async importSubjects(
    data: any[],
  ): Promise<ImportSummary> {
    const created: string[] = [];
    const errors: Array<{ item: string; reason: string }> = [];

    for (const row of data) {
      try {
        await this.prisma.subject.create({
          data: {
            name: row.name,
            code: row.code || '',
            level: row.level.toUpperCase() as any,
          },
        });

        created.push(row.name);
      } catch (err: any) {
        errors.push({
          item: row.name,
          reason: err.message,
        });
      }
    }

    return {
      type: 'subjects',
      created: created.length,
      skipped: data.length - created.length - errors.length,
      errors,
      message: `Successfully imported ${created.length} subject(s)`,
    };
  }

  // ==================== REQUIREMENTS ====================

  private async validateRequirements(
    data: any[],
  ): Promise<ImportValidationResult> {
    const errors: Array<{
      row: number;
      field: string;
      message: string;
    }> = [];

    const preview: any[] = [];

    const subjects = await this.prisma.subject.findMany();
    const programmes =
      await this.prisma.programme.findMany();

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const rowNum = i + 1;
      let rowErrors = 0;

      if (!row.programmeCode && !row.programmeId) {
        errors.push({
          row: rowNum,
          field: 'programme',
          message: 'Programme code or ID is required',
        });
        rowErrors++;
      }

      if (!row.subjectName && !row.subjectId) {
        errors.push({
          row: rowNum,
          field: 'subject',
          message: 'Subject name or ID is required',
        });
        rowErrors++;
      }

      const subject = row.subjectId
        ? subjects.find((s) => s.id === row.subjectId)
        : subjects.find(
            (s) =>
              s.name.toLowerCase() ===
              (row.subjectName || '').toLowerCase(),
          );

      if (!subject && (row.subjectId || row.subjectName)) {
        errors.push({
          row: rowNum,
          field: 'subject',
          message: `Subject not found: ${
            row.subjectId || row.subjectName
          }`,
        });
        rowErrors++;
      }

      const programme = row.programmeId
        ? programmes.find((p) => p.id === row.programmeId)
        : programmes.find(
            (p) =>
              p.code.toLowerCase() ===
              (row.programmeCode || '').toLowerCase(),
          );

      if (!programme && (row.programmeId || row.programmeCode)) {
        errors.push({
          row: rowNum,
          field: 'programme',
          message: `Programme not found: ${
            row.programmeId || row.programmeCode
          }`,
        });
        rowErrors++;
      }

      preview.push({
        _valid: rowErrors === 0,
        _errors: rowErrors,
        programmeCode:
          row.programmeCode || programme?.code || '',
        programmeName: programme?.name || '',
        subjectName:
          subject?.name || row.subjectName || '',
        requirementType:
          row.requirementType || 'REQUIRED',
        minimumGrade: row.minimumGrade || '',
      });
    }

    return {
      valid: errors.length === 0,
      totalRows: data.length,
      validRows: preview.filter((p: any) => p._valid).length,
      errorRows: preview.filter((p: any) => !p._valid).length,
      errors,
      preview,
    };
  }

  private async importRequirements(
    data: any[],
  ): Promise<ImportSummary> {
    const subjects = await this.prisma.subject.findMany();
    const programmes =
      await this.prisma.programme.findMany();

    const created: string[] = [];
    const errors: Array<{ item: string; reason: string }> = [];

    for (const row of data) {
      try {
        const subject = row.subjectId
          ? subjects.find((s) => s.id === row.subjectId)
          : subjects.find(
              (s) =>
                s.name.toLowerCase() ===
                (row.subjectName || '').toLowerCase(),
            );

        const programme = row.programmeId
          ? programmes.find((p) => p.id === row.programmeId)
          : programmes.find(
              (p) =>
                p.code.toLowerCase() ===
                (row.programmeCode || '').toLowerCase(),
            );

        if (!subject || !programme) {
          errors.push({
            item: `${
              row.programmeCode || row.programmeId
            } -> ${row.subjectName || row.subjectId}`,
            reason: 'Subject or Programme not found',
          });
          continue;
        }

        await this.prisma.programmeRequirement.create({
          data: {
            programmeId: programme.id,
            subjectId: subject.id,
            requirementType:
              row.requirementType?.toUpperCase() ||
              'REQUIRED',
            minimumGrade: row.minimumGrade || null,
          },
        });

        created.push(
          `${programme.code} -> ${subject.name}`,
        );
      } catch (err: any) {
        errors.push({
          item: `${
            row.programmeCode || row.programmeId
          } -> ${row.subjectName || row.subjectId}`,
          reason: err.message,
        });
      }
    }

    return {
      type: 'requirements',
      created: created.length,
      skipped: data.length - created.length - errors.length,
      errors,
      message: `Successfully imported ${created.length} requirement(s)`,
    };
  }

  // ==================== TUITION ====================

  private async validateTuition(
    data: any[],
  ): Promise<ImportValidationResult> {
    const errors: Array<{
      row: number;
      field: string;
      message: string;
    }> = [];

    const preview: any[] = [];

    const programmes =
      await this.prisma.programme.findMany();

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const rowNum = i + 1;
      let rowErrors = 0;

      if (!row.programmeCode && !row.programmeId) {
        errors.push({
          row: rowNum,
          field: 'programme',
          message: 'Programme code or ID is required',
        });
        rowErrors++;
      }

      if (!row.academicYear) {
        errors.push({
          row: rowNum,
          field: 'academicYear',
          message: 'Academic year is required',
        });
        rowErrors++;
      }

      if (!row.amount && row.amount !== 0) {
        errors.push({
          row: rowNum,
          field: 'amount',
          message: 'Amount is required',
        });
        rowErrors++;
      }

      const programme = row.programmeId
        ? programmes.find((p) => p.id === row.programmeId)
        : programmes.find(
            (p) =>
              p.code.toLowerCase() ===
              (row.programmeCode || '').toLowerCase(),
          );

      if (!programme && (row.programmeId || row.programmeCode)) {
        errors.push({
          row: rowNum,
          field: 'programme',
          message: `Programme not found: ${
            row.programmeId || row.programmeCode
          }`,
        });
        rowErrors++;
      }

      preview.push({
        _valid: rowErrors === 0,
        _errors: rowErrors,
        programmeCode:
          programme?.code || row.programmeCode || '',
        programmeName: programme?.name || '',
        academicYear: row.academicYear || '',
        amount: row.amount || 0,
        currency: row.currency || 'XAF',
      });
    }

    return {
      valid: errors.length === 0,
      totalRows: data.length,
      validRows: preview.filter((p: any) => p._valid).length,
      errorRows: preview.filter((p: any) => !p._valid).length,
      errors,
      preview,
    };
  }

  private async importTuition(
    data: any[],
  ): Promise<ImportSummary> {
    const programmes =
      await this.prisma.programme.findMany();

    const created: string[] = [];
    const errors: Array<{ item: string; reason: string }> = [];

    for (const row of data) {
      try {
        const programme = row.programmeId
          ? programmes.find((p) => p.id === row.programmeId)
          : programmes.find(
              (p) =>
                p.code.toLowerCase() ===
                (row.programmeCode || '').toLowerCase(),
            );

        if (!programme) {
          errors.push({
            item: `${row.programmeCode} - ${row.academicYear}`,
            reason: 'Programme not found',
          });
          continue;
        }

        await this.prisma.tuition.create({
          data: {
            programmeId: programme.id,
            academicYear: row.academicYear,
            amount: parseFloat(row.amount),
            currency: row.currency || 'XAF',
          },
        });

        created.push(
          `${programme.code} (${row.academicYear})`,
        );
      } catch (err: any) {
        errors.push({
          item: `${row.programmeCode} - ${row.academicYear}`,
          reason: err.message,
        });
      }
    }

    return {
      type: 'tuition',
      created: created.length,
      skipped: data.length - created.length - errors.length,
      errors,
      message: `Successfully imported ${created.length} tuition record(s)`,
    };
  }

  // ==================== CAREERS ====================

  private async validateCareers(
    data: any[],
  ): Promise<ImportValidationResult> {
    const errors: Array<{
      row: number;
      field: string;
      message: string;
    }> = [];

    const preview: any[] = [];

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const rowNum = i + 1;
      let rowErrors = 0;

      if (!row.name) {
        errors.push({
          row: rowNum,
          field: 'name',
          message: 'Name is required',
        });
        rowErrors++;
      }

      if (row.name) {
        const existing =
          await this.prisma.career.findFirst({
            where: {
              name: {
                equals: row.name,
                mode: 'insensitive',
              },
            },
          });

        if (existing) {
          errors.push({
            row: rowNum,
            field: 'name',
            message: `"${row.name}" already exists`,
          });
          rowErrors++;
        }
      }

      preview.push({
        _valid: rowErrors === 0,
        _errors: rowErrors,
        name: row.name || '',
        description: row.description || '',
      });
    }

    return {
      valid: errors.length === 0,
      totalRows: data.length,
      validRows: preview.filter((p: any) => p._valid).length,
      errorRows: preview.filter((p: any) => !p._valid).length,
      errors,
      preview,
    };
  }

  private async importCareers(
    data: any[],
  ): Promise<ImportSummary> {
    const created: string[] = [];
    const errors: Array<{ item: string; reason: string }> = [];

    for (const row of data) {
      try {
        await this.prisma.career.create({
          data: {
            name: row.name,
            description: row.description || '',
          },
        });

        created.push(row.name);
      } catch (err: any) {
        errors.push({
          item: row.name,
          reason: err.message,
        });
      }
    }

    return {
      type: 'careers',
      created: created.length,
      skipped: data.length - created.length - errors.length,
      errors,
      message: `Successfully imported ${created.length} career(s)`,
    };
  }
}