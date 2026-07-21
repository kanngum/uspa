import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProgrammesService } from '../programmes/programmes.service';

export interface SubjectGrade {
  subjectId: string;
  grade: string;
}

export interface EligibilityCheckInput {
  oLevelSubjects: SubjectGrade[];
  aLevelSubjects?: SubjectGrade[];
  programmeId?: string;
  programmeCode?: string;
}

export interface EligibilityResult {
  programmeId: string;
  programmeName: string;
  programmeCode: string;
  status: 'ELIGIBLE' | 'CONDITIONALLY_ELIGIBLE' | 'NOT_ELIGIBLE';
  reasons: { type: 'success' | 'warning' | 'error'; message: string }[];
  missingRequirements: string[];
  satisfiedRequirements: string[];
}

@Injectable()
export class EligibilityService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly programmesService: ProgrammesService,
  ) {}

  private readonly gradeValue: Record<string, number> = {
    A1: 1,
    B2: 2,
    B3: 3,
    C4: 4,
    C5: 5,
    C6: 6,
    D7: 7,
    E8: 8,
    F9: 9,
    A: 1,
    B: 2,
    C: 3,
    D: 4,
    E: 5,
    F: 6,
  };

  private gradeMeetsMinimum(grade: string, minimum: string): boolean {
    const gVal = this.gradeValue[grade.toUpperCase()] ?? 99;
    const mVal = this.gradeValue[minimum.toUpperCase()] ?? 99;
    return gVal <= mVal;
  }

  async checkEligibility(
    input: EligibilityCheckInput,
  ): Promise<EligibilityResult[]> {
    const results: EligibilityResult[] = [];

    // Determine which programme(s) to check
    let programmeIds: string[] = [];

    if (input.programmeId) {
      programmeIds = [input.programmeId];
    } else if (input.programmeCode) {
      const prog = await this.programmesService.findByCode(input.programmeCode);
      programmeIds = [prog.id];
    } else {
      // Check all programmes if no specific programme is given
      const allProgrammes = await this.prisma.programme.findMany({
        select: { id: true },
      });
      programmeIds = allProgrammes.map((p) => p.id);
    }

    for (const pid of programmeIds) {
      const result = await this.evaluateProgramme(pid, input);
      results.push(result);
    }

    // Sort by eligibility status (eligible first)
    results.sort((a, b) => {
      const order = { ELIGIBLE: 0, CONDITIONALLY_ELIGIBLE: 1, NOT_ELIGIBLE: 2 };
      return order[a.status] - order[b.status];
    });

    return results;
  }

  private async evaluateProgramme(
    programmeId: string,
    input: EligibilityCheckInput,
  ): Promise<EligibilityResult> {
    const programme = await this.prisma.programme.findUnique({
      where: { id: programmeId },
      include: {
        requirements: {
          include: { subject: true },
        },
        department: {
          include: {
            academicUnit: {
              select: { id: true, name: true, abbreviation: true },
            },
          },
        },
      },
    });

    if (!programme) {
      return {
        programmeId,
        programmeName: 'Unknown',
        programmeCode: '',
        status: 'NOT_ELIGIBLE',
        reasons: [{ type: 'error', message: 'Programme not found' }],
        missingRequirements: ['Programme not found'],
        satisfiedRequirements: [],
      };
    }

    const reasons: {
      type: 'success' | 'warning' | 'error';
      message: string;
    }[] = [];
    const missingRequirements: string[] = [];
    const satisfiedRequirements: string[] = [];

    // Check O Level minimum requirements
    const oLevelCount = input.oLevelSubjects.length;
    if (oLevelCount < 4) {
      reasons.push({
        type: 'error',
        message: `Only ${oLevelCount} O Level subjects provided. Minimum 4 required.`,
      });
      missingRequirements.push(`${4 - oLevelCount} more O Level subject(s)`);
    } else {
      satisfiedRequirements.push(`${oLevelCount} O Level subjects provided`);
    }

    // Check A Level minimum requirements
    const aLevelSubjects = input.aLevelSubjects || [];
    if (aLevelSubjects.length < 2) {
      reasons.push({
        type: 'warning',
        message: `Only ${aLevelSubjects.length} A Level subjects provided. Minimum 2 recommended.`,
      });
    }

    // Check each programme requirement
    const oLevelInputMap = new Map(
      input.oLevelSubjects.map((s) => [s.subjectId, s.grade]),
    );
    const aLevelInputMap = new Map(
      aLevelSubjects.map((s) => [s.subjectId, s.grade]),
    );

    for (const req of programme.requirements) {
      const isOLevel = req.subject.level === 'O_LEVEL';
      const inputMap = isOLevel ? oLevelInputMap : aLevelInputMap;
      const levelLabel = isOLevel ? 'O Level' : 'A Level';
      const subjectGrade = inputMap.get(req.subjectId);

      if (!subjectGrade) {
        reasons.push({
          type: 'error',
          message: `Missing ${levelLabel} requirement: ${req.subject.name}`,
        });
        missingRequirements.push(req.subject.name);
      } else if (
        req.minimumGrade &&
        !this.gradeMeetsMinimum(subjectGrade, req.minimumGrade)
      ) {
        reasons.push({
          type: 'error',
          message: `${req.subject.name}: grade ${subjectGrade} does not meet minimum ${req.minimumGrade}`,
        });
        missingRequirements.push(
          `${req.subject.name} (need ${req.minimumGrade})`,
        );
      } else {
        satisfiedRequirements.push(
          `${req.subject.name}: ${subjectGrade}${req.minimumGrade ? ` (min ${req.minimumGrade})` : ''}`,
        );
      }
    }

    // Determine overall status
    let status: 'ELIGIBLE' | 'CONDITIONALLY_ELIGIBLE' | 'NOT_ELIGIBLE';
    const errors = reasons.filter((r) => r.type === 'error');

    if (errors.length === 0) {
      status = 'ELIGIBLE';
      reasons.unshift({
        type: 'success',
        message: `You meet all requirements for ${programme.name}`,
      });
    } else if (errors.length <= 2) {
      status = 'CONDITIONALLY_ELIGIBLE';
      reasons.unshift({
        type: 'warning',
        message: `You partially meet requirements for ${programme.name} (${errors.length} missing)`,
      });
    } else {
      status = 'NOT_ELIGIBLE';
      reasons.unshift({
        type: 'error',
        message: `You do not meet the requirements for ${programme.name}`,
      });
    }

    return {
      programmeId: programme.id,
      programmeName: programme.name,
      programmeCode: programme.code,
      status,
      reasons,
      missingRequirements,
      satisfiedRequirements,
    };
  }
}
