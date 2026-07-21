import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProgrammesService } from '../programmes/programmes.service';

export interface AiQueryInput {
  query: string;
  subjects?: string[];
  userId?: string;
}

export interface AiResponse {
  message: string;
  suggestions: string[];
  programmes?: Array<{
    id: string;
    name: string;
    code: string;
    degree: string;
    faculty: string | null;
    relevance: string;
  }>;
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly programmesService: ProgrammesService,
  ) {}

  async processQuery(input: AiQueryInput): Promise<AiResponse> {
    const query = input.query.toLowerCase().trim();
    const suggestions = this.getSuggestedQuestions();

    // Step 1: Extract subjects from the query
    const detectedSubjects = await this.detectSubjects(query);

    // Step 2: Detect intent (programmes, eligibility, career, faculty, general)
    const intent = this.detectIntent(query);

    // Step 3: Process based on intent
    switch (intent) {
      case 'subject_search':
        return this.handleSubjectSearch(query, detectedSubjects);
      case 'career_search':
        return this.handleCareerSearch(query);
      case 'faculty_search':
        return this.handleFacultySearch(query);
      case 'programme_detail':
        return this.handleProgrammeDetail(query);
      case 'eligibility':
        return this.handleEligibilityQuery(query, detectedSubjects);
      case 'general':
      default:
        return this.handleGeneralQuery(query, detectedSubjects);
    }
  }

  private async detectSubjects(query: string): Promise<string[]> {
    const allSubjects = await this.prisma.subject.findMany({
      select: { id: true, name: true },
    });

    return allSubjects
      .filter((s) => query.includes(s.name.toLowerCase()))
      .map((s) => s.name);
  }

  private detectIntent(query: string): string {
    const careerWords = [
      'career',
      'job',
      'work as',
      'become a',
      'profession',
      'occupation',
    ];
    const facultyWords = ['faculty', 'school of', 'department of'];
    const programmeWords = [
      'tell me about',
      'what is',
      'details',
      'information about',
      'programme',
    ];
    const eligibilityWords = [
      'qualify',
      'eligible',
      'can i study',
      'can i do',
      'requirements',
      'subjects',
      'i have',
    ];
    const subjectWords = [
      'i have',
      'i study',
      'my subjects',
      'i took',
      'biology',
      'chemistry',
      'physics',
      'mathematics',
      'english',
      'french',
      'geography',
      'economics',
      'history',
    ];

    if (careerWords.some((w) => query.includes(w))) return 'career_search';
    if (facultyWords.some((w) => query.includes(w))) return 'faculty_search';
    if (programmeWords.some((w) => query.includes(w)))
      return 'programme_detail';
    if (eligibilityWords.some((w) => query.includes(w))) return 'eligibility';
    if (subjectWords.some((w) => query.includes(w))) return 'subject_search';

    return 'general';
  }

  private async handleSubjectSearch(
    query: string,
    detectedSubjects: string[],
  ): Promise<AiResponse> {
    // Find programmes matching detected subjects
    if (detectedSubjects.length > 0) {
      const subjects = await this.prisma.subject.findMany({
        where: { name: { in: detectedSubjects } },
      });

      const subjectIds = subjects.map((s) => s.id);

      const programmes = await this.prisma.programme.findMany({
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
              academicUnit: { select: { abbreviation: true } },
            },
          },
          _count: { select: { requirements: true } },
        },
        take: 8,
      });

      if (programmes.length === 0) {
        return {
          message: `I couldn't find programmes specifically matching: ${detectedSubjects.join(', ')}. Try searching for a specific programme name or career interest.`,
          suggestions: this.getSuggestedQuestions(),
        };
      }

      return {
        message: `Based on your subjects (${detectedSubjects.join(', ')}), here are programmes you might be interested in:`,
        programmes: programmes.map((p) => ({
          id: p.id,
          name: p.name,
          code: p.code,
          degree: p.degree,
          faculty: p.department?.academicUnit?.abbreviation ?? '',
          relevance: `Shares ${p._count.requirements} subject requirements`,
        })),
        suggestions: [
          'What are the requirements for these programmes?',
          'Tell me more about a specific programme',
          'What careers can I pursue with these subjects?',
        ],
      };
    }

    // If no specific subjects detected, search by keywords
    const searchResults = await this.programmesService.search({
      query,
      limit: 5,
    });

    if (searchResults.data.length === 0) {
      return {
        message: `I couldn't find programmes matching "${query}". Try searching by subject name, career interest, or programme name.`,
        suggestions: this.getSuggestedQuestions(),
      };
    }

    return {
      message: `I found ${searchResults.total} programme(s) related to "${query}". Here are the top results:`,
      programmes: searchResults.data.map((p: any) => ({
        id: p.id,
        name: p.name,
        code: p.code,
        degree: p.degree,
        faculty: p.department?.academicUnit?.abbreviation ?? '',
        relevance: `${p._count?.requirements ?? 0} requirements`,
      })),
      suggestions: [
        'Narrow down by faculty',
        'Check eligibility for these programmes',
        'Compare programmes',
      ],
    };
  }

  private async handleCareerSearch(query: string): Promise<AiResponse> {
    // Extract career term from query
    const careerTerm = query
      .replace(/career|job|work as|become a|profession|occupation/i, '')
      .trim();

    if (!careerTerm) {
      return {
        message:
          'What career are you interested in? For example: "I want to become a doctor" or "Careers in engineering"',
        suggestions: [
          'I want to become a doctor',
          'Careers in engineering',
          'Jobs in IT and technology',
          'Teaching careers',
        ],
      };
    }

    const programmes = await this.prisma.programme.findMany({
      where: {
        careers: {
          some: {
            career: {
              name: { contains: careerTerm, mode: 'insensitive' },
            },
          },
        },
      },
      include: {
        department: {
          include: {
            academicUnit: { select: { abbreviation: true } },
          },
        },
        careers: {
          include: { career: true },
          take: 3,
        },
      },
      take: 6,
    });

    if (programmes.length === 0) {
      return {
        message: `I couldn't find programmes leading to a career in "${careerTerm}". Try a different career interest or browse by faculty.`,
        suggestions: [
          'What programmes lead to medical careers?',
          'Engineering career options',
          'Careers in business and finance',
        ],
      };
    }

    return {
      message: `Here are programmes that can lead to a career ${careerTerm ? 'in ' + careerTerm : ''}:`,
      programmes: programmes.map((p) => ({
        id: p.id,
        name: p.name,
        code: p.code,
        degree: p.degree,
        faculty: p.department.academicUnit.abbreviation,
        relevance: `Careers: ${p.careers.map((c) => c.career.name).join(', ')}`,
      })),
      suggestions: [
        'What are the entry requirements?',
        'How long is the programme?',
        'Show similar programmes',
      ],
    };
  }

  private async handleFacultySearch(query: string): Promise<AiResponse> {
    const faculties = await this.prisma.academicUnit.findMany({
      include: {
        _count: { select: { departments: true } },
      },
    });

    const matchedFaculty = faculties.find(
      (f) =>
        query.includes(f.name.toLowerCase()) ||
        (f.abbreviation && query.includes(f.abbreviation.toLowerCase())),
    );

    if (matchedFaculty) {
      const departments = await this.prisma.department.findMany({
        where: { academicUnitId: matchedFaculty.id },
        include: {
          _count: { select: { programmes: true } },
        },
      });

      return {
        message: `**${matchedFaculty.name} (${matchedFaculty.abbreviation})**\n${matchedFaculty.description ?? ''}\n\nDepartments (${departments.length}):\n${departments.map((d) => `• ${d.name} (${d._count.programmes} programmes)`).join('\n')}`,
        programmes: [],
        suggestions: [
          'Show all programmes in this faculty',
          'What are the admission requirements?',
          'Browse another faculty',
        ],
      };
    }

    return {
      message: `Here are all faculties at the University of Bamenda:\n${faculties.map((f) => `• **${f.name}** (${f.abbreviation}) - ${f._count.departments} departments`).join('\n')}`,
      programmes: [],
      suggestions: [
        'Tell me about FHS',
        'What programmes does FET offer?',
        'Show me CBMS departments',
      ],
    };
  }

  private async handleProgrammeDetail(query: string): Promise<AiResponse> {
    // Try to find a specific programme
    const programmes = await this.prisma.programme.findMany({
      take: 5,
      include: {
        department: {
          include: {
            academicUnit: { select: { abbreviation: true } },
          },
        },
      },
    });

    const matchedProgramme = programmes.find(
      (p) =>
        query.includes(p.name.toLowerCase()) ||
        query.includes(p.code.toLowerCase()),
    );

    if (matchedProgramme) {
      return {
        message: `I can help you learn more about **${matchedProgramme.name} (${matchedProgramme.code})**.\n\nClick on the programme to view:\n• Full admission requirements\n• Tuition fees\n• Career opportunities\n• Similar programmes\n• Eligibility check`,
        programmes: [
          {
            id: matchedProgramme.id,
            name: matchedProgramme.name,
            code: matchedProgramme.code,
            degree: matchedProgramme.degree,
            faculty: matchedProgramme.department.academicUnit.abbreviation,
            relevance: `${matchedProgramme.duration} years`,
          },
        ],
        suggestions: [
          'Check my eligibility for this programme',
          'What are the O Level requirements?',
          'Show similar programmes',
        ],
      };
    }

    return {
      message: `Try searching for a specific programme by name or code. For example:\n• "Tell me about MBBS"\n• "Information on BSc in Computer Science"\n• "What is BENG-CIV-01?"`,
      suggestions: this.getSuggestedQuestions(),
    };
  }

  private async handleEligibilityQuery(
    query: string,
    detectedSubjects: string[],
  ): Promise<AiResponse> {
    if (detectedSubjects.length === 0) {
      return {
        message:
          'To check your eligibility, please tell me which subjects you have. For example:\n• "I have Biology, Chemistry and Geography"\n• "I studied Physics, Mathematics and Computer Science"\n• "My subjects are English, History and Literature"',
        suggestions: [
          'I have Biology, Chemistry and Mathematics',
          'I studied Physics, Economics and Geography',
          'What can I do with English, History and French?',
        ],
      };
    }

    // Find programmes that accept these subjects
    const matchingProgrammes = await this.prisma.programme.findMany({
      where: {
        requirements: {
          some: {
            subject: {
              name: { in: detectedSubjects },
            },
          },
        },
      },
      include: {
        department: {
          include: {
            academicUnit: { select: { abbreviation: true } },
          },
        },
        requirements: {
          include: { subject: true },
        },
        _count: { select: { requirements: true } },
      },
      take: 6,
    });

    if (matchingProgrammes.length === 0) {
      return {
        message: `With subjects like ${detectedSubjects.join(', ')}, you might want to check specific faculties. Try searching by faculty or programme name.`,
        suggestions: [
          'Show me all programmes in FSE',
          'What programmes are in FHS?',
          'Browse CBMS programmes',
        ],
      };
    }

    return {
      message: `With subjects in ${detectedSubjects.join(', ')}, you may qualify for these programmes. Use the **Admission Checker** to verify your eligibility:`,
      programmes: matchingProgrammes.map((p) => {
        const matchingReqs = p.requirements.filter((r) =>
          detectedSubjects.includes(r.subject.name),
        );
        return {
          id: p.id,
          name: p.name,
          code: p.code,
          degree: p.degree,
          faculty: p.department.academicUnit.abbreviation,
          relevance: `${matchingReqs.length}/${p._count.requirements} subject requirements met`,
        };
      }),
      suggestions: [
        'Check my eligibility for a specific programme',
        'What subjects am I missing for Medicine?',
        'Show me alternative programmes',
      ],
    };
  }

  private async handleGeneralQuery(
    query: string,
    detectedSubjects: string[],
  ): Promise<AiResponse> {
    // Try broad search
    const searchResults = await this.programmesService.search({
      query,
      limit: 4,
    });

    if (searchResults.data.length > 0) {
      return {
        message: `I found some information related to "${query}". Here are relevant programmes:`,
        programmes: searchResults.data.map((p: any) => ({
          id: p.id,
          name: p.name,
          code: p.code,
          degree: p.degree,
          faculty: p.department?.academicUnit?.abbreviation ?? '',
          relevance: p.level,
        })),
        suggestions: this.getSuggestedQuestions(),
      };
    }

    return {
      message: `Hello! I'm the USPA AI Advisor. I can help you with:\n\n📚 **Programme Discovery** - Find programmes by subject, career, or interest\n✅ **Eligibility Check** - See if you qualify for a programme\n🏛️ **Faculty Info** - Browse faculties and departments\n💼 **Career Guidance** - Discover programmes for your dream career\n\nHow can I help you today?`,
      suggestions: this.getSuggestedQuestions(),
    };
  }

  private getSuggestedQuestions(): string[] {
    return [
      'What programmes are available?',
      'I have Biology, Chemistry and Geography - what can I study?',
      'I want to become a software engineer',
      'What are the requirements for MBBS?',
      'Show me faculties and their programmes',
      'Which programmes can I study with Physics and Mathematics?',
    ];
  }
}
