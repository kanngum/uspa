import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProgrammesService } from '../programmes/programmes.service';

export type StudentType = 'FRESHMAN' | 'DIRECT_ENTRY' | 'TRANSFER';

export interface SubjectGrade {
  subjectId: string;
  grade: string;
}

export interface EligibilityCheckInput {
  oLevelSubjects: SubjectGrade[];
  aLevelSubjects?: SubjectGrade[];
  programmeId?: string;
  programmeCode?: string;
  level?: string;
  universityId?: string;
  studentType?: StudentType;
  ugDegree?: {
    degreeName: string;
    institution: string;
    graduationYear: string;
    classification: string;
    degreeLabel?: string;
    previousProgrammeId?: string;
  };
}

export interface EligibilityResult {
  programmeId: string;
  programmeName: string;
  programmeCode: string;
  programmeLevel: string;
  status: 'ELIGIBLE' | 'CONDITIONALLY_ELIGIBLE' | 'NOT_ELIGIBLE';
  reasons: {
    type: 'success' | 'warning' | 'error';
    message: string;
  }[];
  missingRequirements: string[];
  satisfiedRequirements: string[];
}

type RequirementScope = 'UNIVERSITY' | 'ACADEMIC_UNIT' | 'DEPARTMENT' | 'PROGRAMME';

interface HierarchicalRule {
  id: string;
  category: string;
  title: string;
  description: string;
  subjectId: string | null;
  minimumGrade: string | null;
  minimumCount: number | null;
  subject?: {
    id: string;
    name: string;
    level: string;
  } | null;
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

  private countPassedSubjects(
    subjects: SubjectGrade[],
    minimumGrade?: string | null,
  ): number {
    if (!minimumGrade) {
      return subjects.length;
    }

    return subjects.filter((subject) =>
      this.gradeMeetsMinimum(subject.grade, minimumGrade),
    ).length;
  }

  private getScopeLabel(scope: RequirementScope): string {
    switch (scope) {
      case 'UNIVERSITY':
        return 'University';
      case 'ACADEMIC_UNIT':
        return 'Academic Unit';
      case 'DEPARTMENT':
        return 'Department';
      case 'PROGRAMME':
        return 'Programme';
      default:
        return 'Requirement';
    }
  }

  private getLevelLabel(level: string): string {
    return level === 'O_LEVEL' ? 'O Level' : 'A Level';
  }

  private evaluateCountRule(
    rule: HierarchicalRule,
    scope: RequirementScope,
    oLevelSubjects: SubjectGrade[],
    aLevelSubjects: SubjectGrade[],
    reasons: EligibilityResult['reasons'],
    missingRequirements: string[],
    satisfiedRequirements: string[],
  ): void {
    const subjects =
      rule.category === 'O_LEVEL' ? oLevelSubjects : aLevelSubjects;

    const levelLabel = this.getLevelLabel(rule.category);

    if (rule.minimumCount === null || rule.minimumCount === undefined) {
      return;
    }

    const count = this.countPassedSubjects(subjects, rule.minimumGrade);

    const gradeText = rule.minimumGrade
      ? ` with minimum grade ${rule.minimumGrade}`
      : '';

    const scopeLabel = this.getScopeLabel(scope);

    if (count < rule.minimumCount) {
      const message =
        `${scopeLabel} requirement: ${rule.title}. ` +
        `You have ${count} qualifying ${levelLabel} subject(s), ` +
        `but at least ${rule.minimumCount} is required${gradeText}.`;

      reasons.push({
        type: 'error',
        message,
      });

      missingRequirements.push(
        `${scopeLabel}: ${rule.title} (need ${rule.minimumCount} qualifying ${levelLabel} subject(s))`,
      );

      return;
    }

    satisfiedRequirements.push(
      `${scopeLabel}: ${rule.title} (${count} qualifying ${levelLabel} subject(s))`,
    );
  }

  private evaluateSubjectRule(
    rule: HierarchicalRule,
    scope: RequirementScope,
    oLevelSubjects: SubjectGrade[],
    aLevelSubjects: SubjectGrade[],
    reasons: EligibilityResult['reasons'],
    missingRequirements: string[],
    satisfiedRequirements: string[],
  ): void {
    if (!rule.subjectId || !rule.subject) {
      return;
    }

    const subjectLevel = rule.subject.level;
    const inputSubjects =
      subjectLevel === 'O_LEVEL' ? oLevelSubjects : aLevelSubjects;

    const subjectGrade = inputSubjects.find(
      (subject) => subject.subjectId === rule.subjectId,
    );

    const scopeLabel = this.getScopeLabel(scope);
    const levelLabel = this.getLevelLabel(subjectLevel);

    if (!subjectGrade) {
      reasons.push({
        type: 'error',
        message:
          `${scopeLabel} requirement: ${rule.title}. ` +
          `Missing ${levelLabel} subject ${rule.subject.name}.`,
      });

      missingRequirements.push(
        `${scopeLabel}: ${rule.subject.name}`,
      );

      return;
    }

    if (
      rule.minimumGrade &&
      !this.gradeMeetsMinimum(subjectGrade.grade, rule.minimumGrade)
    ) {
      reasons.push({
        type: 'error',
        message:
          `${scopeLabel} requirement: ${rule.subject.name} ` +
          `has grade ${subjectGrade.grade}, but minimum ${rule.minimumGrade} is required.`,
      });

      missingRequirements.push(
        `${scopeLabel}: ${rule.subject.name} (need ${rule.minimumGrade})`,
      );

      return;
    }

    satisfiedRequirements.push(
      `${scopeLabel}: ${rule.subject.name}: ${subjectGrade.grade}` +
        `${rule.minimumGrade ? ` (min ${rule.minimumGrade})` : ''}`,
    );
  }

  private evaluateInformationalRule(
    rule: HierarchicalRule,
    scope: RequirementScope,
    input: EligibilityCheckInput,
    reasons: EligibilityResult['reasons'],
    satisfiedRequirements: string[],
  ): void {
    const scopeLabel = this.getScopeLabel(scope);

    if (rule.category === 'QUALIFICATION') {
      if (input.ugDegree?.degreeName && input.ugDegree.classification) {
        satisfiedRequirements.push(
          `${scopeLabel}: ${rule.title} - undergraduate qualification information provided`,
        );
      } else {
        reasons.push({
          type: 'warning',
          message:
            `${scopeLabel} requirement: ${rule.title}. ` +
            `Qualification information must be verified.`,
        });
      }

      return;
    }

    if (
      rule.category === 'ENTRANCE_EXAM' ||
      rule.category === 'EQUIVALENCY'
    ) {
      reasons.push({
        type: 'warning',
        message:
          `${scopeLabel} requirement: ${rule.title}. ` +
          `${rule.description || 'This requirement requires institutional verification.'}`,
      });

      return;
    }

    if (rule.description) {
      reasons.push({
        type: 'warning',
        message:
          `${scopeLabel} requirement: ${rule.title}. ${rule.description}`,
      });
    }
  }

  private evaluateHierarchicalRule(
    rule: HierarchicalRule,
    scope: RequirementScope,
    input: EligibilityCheckInput,
    reasons: EligibilityResult['reasons'],
    missingRequirements: string[],
    satisfiedRequirements: string[],
  ): void {
    const isPostgraduateCheck =
      !!input.ugDegree ||
      input.level === 'POSTGRADUATE' ||
      input.level === 'DOCTORATE';

    if (
      isPostgraduateCheck &&
      (rule.category === 'O_LEVEL' || rule.category === 'A_LEVEL')
    ) {
      return;
    }

    if (
      !isPostgraduateCheck &&
      (rule.category === 'QUALIFICATION' ||
        rule.category === 'ENTRANCE_EXAM' ||
        rule.category === 'EQUIVALENCY')
    ) {
      this.evaluateInformationalRule(
        rule,
        scope,
        input,
        reasons,
        satisfiedRequirements,
      );
      return;
    }

    if (rule.subjectId) {
      this.evaluateSubjectRule(
        rule,
        scope,
        input.oLevelSubjects,
        input.aLevelSubjects || [],
        reasons,
        missingRequirements,
        satisfiedRequirements,
      );

      return;
    }

    if (
      rule.category === 'O_LEVEL' ||
      rule.category === 'A_LEVEL'
    ) {
      this.evaluateCountRule(
        rule,
        scope,
        input.oLevelSubjects,
        input.aLevelSubjects || [],
        reasons,
        missingRequirements,
        satisfiedRequirements,
      );

      return;
    }

    this.evaluateInformationalRule(
      rule,
      scope,
      input,
      reasons,
      satisfiedRequirements,
    );
  }

  async checkEligibility(
    input: EligibilityCheckInput,
  ): Promise<EligibilityResult[]> {
    const results: EligibilityResult[] = [];

    const studentType = input.studentType || 'FRESHMAN';

    const isPostgraduateCheck =
      input.level === 'POSTGRADUATE' ||
      input.level === 'DOCTORATE' ||
      !!input.ugDegree;

    if (!isPostgraduateCheck && studentType !== 'FRESHMAN') {
      throw new BadRequestException(
        `${studentType === 'TRANSFER' ? 'Transfer' : 'Direct Entry'} eligibility is not supported by the current checker yet.`,
      );
    }

    if (isPostgraduateCheck) {
      if (
        !input.ugDegree?.degreeName ||
        !input.ugDegree.classification
      ) {
        throw new BadRequestException(
          'Previous programme and classification are required for postgraduate and doctorate checks.',
        );
      }
    } else {
      const uniqueOLevelSubjects = new Set(
        input.oLevelSubjects.map((subject) => subject.subjectId),
      );

      const uniqueALevelSubjects = new Set(
        (input.aLevelSubjects || []).map((subject) => subject.subjectId),
      );

      if (
        input.oLevelSubjects.length < 4 ||
        uniqueOLevelSubjects.size < 4
      ) {
        throw new BadRequestException(
          'At least 4 unique O Level subject and grade pairs are required.',
        );
      }

      if (
        (input.aLevelSubjects || []).length < 2 ||
        uniqueALevelSubjects.size < 2
      ) {
        throw new BadRequestException(
          'At least 2 unique A Level subject and grade pairs are required.',
        );
      }
    }

    let programmeIds: string[] = [];

    const programmeFilter: any = {
      select: {
        id: true,
      },
    };

    const programmeWhere: Record<string, any> = {};

    if (input.level) {
      programmeWhere.level = input.level;
    }

    if (input.universityId) {
      programmeWhere.department = {
        academicUnit: {
          universityId: input.universityId,
        },
      };
    }

    if (Object.keys(programmeWhere).length > 0) {
      programmeFilter.where = programmeWhere;
    }

    if (input.programmeId) {
      programmeIds = [input.programmeId];
    } else if (input.programmeCode) {
      const prog = await this.programmesService.findByCode(
        input.programmeCode,
      );

      programmeIds = [prog.id];
    } else {
      const allProgrammes =
        await this.prisma.programme.findMany(programmeFilter);

      programmeIds = allProgrammes.map((programme) => programme.id);
    }

    if (input.universityId) {
      const scopedProgrammes = await this.prisma.programme.findMany({
        where: {
          id: { in: programmeIds },
          department: {
            academicUnit: {
              universityId: input.universityId,
            },
          },
        },
        select: {
          id: true,
        },
      });

      if (scopedProgrammes.length === 0) {
        throw new BadRequestException(
          'No programmes match the selected university.',
        );
      }

      programmeIds = scopedProgrammes.map((programme) => programme.id);
    }

    for (const programmeId of programmeIds) {
      const result = await this.evaluateProgramme(
        programmeId,
        input,
      );

      results.push(result);
    }

    results.sort((a, b) => {
      const order = {
        ELIGIBLE: 0,
        CONDITIONALLY_ELIGIBLE: 1,
        NOT_ELIGIBLE: 2,
      };

      return order[a.status] - order[b.status];
    });

    return results;
  }

  private async evaluateProgramme(
    programmeId: string,
    input: EligibilityCheckInput,
  ): Promise<EligibilityResult> {
    const programme = await this.prisma.programme.findUnique({
      where: {
        id: programmeId,
      },
      include: {
        requirements: {
          include: {
            subject: true,
          },
        },

        admissionRules: true,

        department: {
          include: {
            admissionRules: {
              include: {
                subject: true,
              },
            },

            academicUnit: {
              include: {
                admissionRules: {
                  include: {
                    subject: true,
                  },
                },

                university: {
                  include: {
                    admissionRules: {
                      include: {
                        subject: true,
                      },
                    },
                  },
                },
              },
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
        programmeLevel: '',
        status: 'NOT_ELIGIBLE',
        reasons: [
          {
            type: 'error',
            message: 'Programme not found',
          },
        ],
        missingRequirements: ['Programme not found'],
        satisfiedRequirements: [],
      };
    }

    const reasons: EligibilityResult['reasons'] = [];
    const missingRequirements: string[] = [];
    const satisfiedRequirements: string[] = [];

    const isPostgraduateCheck =
      !!input.ugDegree ||
      programme.level === 'POSTGRADUATE' ||
      programme.level === 'DOCTORATE';

    const aLevelSubjects = input.aLevelSubjects || [];

    /*
     * Preserve the existing baseline checks.
     *
     * Hierarchical minimum-count rules can increase these
     * requirements, but the old minimums remain the fallback
     * when no university, academic-unit, or department rule
     * specifies a different count.
     */
    if (!isPostgraduateCheck) {
      const oLevelCount = input.oLevelSubjects.length;
      const aLevelCount = aLevelSubjects.length;

      const hierarchicalOLevelRules: HierarchicalRule[] = [
        ...(programme.department.academicUnit.university.admissionRules || []),
        ...(programme.department.academicUnit.admissionRules || []),
        ...(programme.department.admissionRules || []),
      ].filter(
        (rule) =>
          rule.category === 'O_LEVEL' &&
          !rule.subjectId &&
          rule.minimumCount !== null,
      );

      const hierarchicalALevelRules: HierarchicalRule[] = [
        ...(programme.department.academicUnit.university.admissionRules || []),
        ...(programme.department.academicUnit.admissionRules || []),
        ...(programme.department.admissionRules || []),
      ].filter(
        (rule) =>
          rule.category === 'A_LEVEL' &&
          !rule.subjectId &&
          rule.minimumCount !== null,
      );

      const configuredOLevelMinimum = hierarchicalOLevelRules.reduce(
        (maximum, rule) =>
          Math.max(maximum, rule.minimumCount || 0),
        0,
      );

      const configuredALevelMinimum = hierarchicalALevelRules.reduce(
        (maximum, rule) =>
          Math.max(maximum, rule.minimumCount || 0),
        0,
      );

      const requiredOLevelCount = Math.max(
        4,
        configuredOLevelMinimum,
      );

      const requiredALevelCount = Math.max(
        2,
        configuredALevelMinimum,
      );

      if (oLevelCount < requiredOLevelCount) {
        reasons.push({
          type: 'error',
          message:
            `Only ${oLevelCount} O Level subjects provided. ` +
            `Minimum ${requiredOLevelCount} required.`,
        });

        missingRequirements.push(
          `${requiredOLevelCount - oLevelCount} more O Level subject(s)`,
        );
      } else {
        satisfiedRequirements.push(
          `${oLevelCount} O Level subjects provided`,
        );
      }

      if (aLevelCount < requiredALevelCount) {
        reasons.push({
          type: 'error',
          message:
            `Only ${aLevelCount} A Level subjects provided. ` +
            `Minimum ${requiredALevelCount} required.`,
        });

        missingRequirements.push(
          `${requiredALevelCount - aLevelCount} more A Level subject(s)`,
        );
      } else {
        satisfiedRequirements.push(
          `${aLevelCount} A Level subjects provided`,
        );
      }
    } else {
      if (input.ugDegree) {
        satisfiedRequirements.push(
          `Undergraduate degree: ${input.ugDegree.degreeName} - ${input.ugDegree.classification}`,
        );
      } else {
        reasons.push({
          type: 'warning',
          message:
            'Undergraduate degree details not fully provided.',
        });
      }
    }

    /*
     * Evaluate cumulative hierarchical requirements:
     *
     * University
     *      â†“
     * Academic Unit
     *      â†“
     * Department
     *      â†“
     * Programme
     */
    const hierarchyRules: {
      scope: RequirementScope;
      rules: HierarchicalRule[];
    }[] = [
      {
        scope: 'UNIVERSITY',
        rules:
          programme.department.academicUnit.university
            .admissionRules || [],
      },
      {
        scope: 'ACADEMIC_UNIT',
        rules:
          programme.department.academicUnit.admissionRules || [],
      },
      {
        scope: 'DEPARTMENT',
        rules:
          programme.department.admissionRules || [],
      },
    ];

    for (const hierarchy of hierarchyRules) {
      for (const rule of hierarchy.rules) {
        this.evaluateHierarchicalRule(
          rule,
          hierarchy.scope,
          input,
          reasons,
          missingRequirements,
          satisfiedRequirements,
        );
      }
    }

    /*
     * Existing programme-specific subject requirements.
     *
     * This remains unchanged in principle and continues to
     * provide the final programme-specific academic constraints.
     */
    const oLevelInputMap = new Map(
      input.oLevelSubjects.map((subject) => [
        subject.subjectId,
        subject.grade,
      ]),
    );

    const aLevelInputMap = new Map(
      aLevelSubjects.map((subject) => [
        subject.subjectId,
        subject.grade,
      ]),
    );

    for (const req of programme.requirements) {
      const isOLevel = req.subject.level === 'O_LEVEL';

      const inputMap = isOLevel
        ? oLevelInputMap
        : aLevelInputMap;

      const levelLabel = isOLevel
        ? 'O Level'
        : 'A Level';

      const subjectGrade = inputMap.get(
        req.subjectId,
      );

      if (!subjectGrade) {
        reasons.push({
          type: 'error',
          message:
            `Missing ${levelLabel} requirement: ` +
            `${req.subject.name}`,
        });

        missingRequirements.push(
          req.subject.name,
        );
      } else if (
        req.minimumGrade &&
        !this.gradeMeetsMinimum(
          subjectGrade,
          req.minimumGrade,
        )
      ) {
        reasons.push({
          type: 'error',
          message:
            `${req.subject.name}: grade ${subjectGrade} ` +
            `does not meet minimum ${req.minimumGrade}`,
        });

        missingRequirements.push(
          `${req.subject.name} (need ${req.minimumGrade})`,
        );
      } else {
        satisfiedRequirements.push(
          `${req.subject.name}: ${subjectGrade}` +
            `${
              req.minimumGrade
                ? ` (min ${req.minimumGrade})`
                : ''
            }`,
        );
      }
    }

    /*
     * Programme admission rules remain available as descriptive
     * programme-level information. They are not automatically
     * treated as failed requirements because their current model
     * stores free-form text rather than structured conditions.
     */
    for (const rule of programme.admissionRules || []) {
      if (rule.text?.trim()) {
        reasons.push({
          type: 'warning',
          message:
            `Programme admission rule (${rule.category}): ${rule.text}`,
        });
      }
    }

    const errors = reasons.filter(
      (reason) => reason.type === 'error',
    );

    let status:
      | 'ELIGIBLE'
      | 'CONDITIONALLY_ELIGIBLE'
      | 'NOT_ELIGIBLE';

    if (errors.length === 0) {
      status = 'ELIGIBLE';

      reasons.unshift({
        type: 'success',
        message:
          `You meet all automatically verifiable requirements for ${programme.name}`,
      });
    } else if (errors.length <= 2) {
      status = 'CONDITIONALLY_ELIGIBLE';

      reasons.unshift({
        type: 'warning',
        message:
          `You partially meet requirements for ${programme.name} (${errors.length} missing)`,
      });
    } else {
      status = 'NOT_ELIGIBLE';

      reasons.unshift({
        type: 'error',
        message:
          `You do not meet the requirements for ${programme.name}`,
      });
    }

    return {
      programmeId: programme.id,
      programmeName: programme.name,
      programmeCode: programme.code,
      programmeLevel: programme.level,
      status,
      reasons,
      missingRequirements,
      satisfiedRequirements,
    };
  }
}
