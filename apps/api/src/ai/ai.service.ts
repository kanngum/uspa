import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProgrammesService } from '../programmes/programmes.service';
import { EligibilityService } from '../eligibility/eligibility.service';
import { RecommendationsService } from '../recommendations/recommendations.service';

// ===== Types =====

export interface ProgrammeInfo {
  id: string;
  name: string;
  code: string;
  degree: string;
  faculty: string;
  duration: number;
  level: string;
  relevance: string;
}

export interface SubjectWithGrade {
  name: string;
  grade: string | null;
}

export interface ConversationTurn {
  role: 'user' | 'assistant';
  content: string;
  programmes?: ProgrammeInfo[];
}

export interface AiQueryInput {
  query: string;
  subjects?: string[];
  userId?: string;
  conversationHistory?: ConversationTurn[];
}

export interface EligibilityCategoryInfo {
  eligible: Array<{ id: string; name: string; code: string; degree: string; faculty: string; duration: number; level: string; reasons: string[] }>;
  conditional: Array<{ id: string; name: string; code: string; degree: string; faculty: string; duration: number; level: string; missing: string[] }>;
  notEligible: Array<{ id: string; name: string; code: string; degree: string; faculty: string; duration: number; level: string; missing: string[] }>;
  generalRules: string[];
}

export interface AiResponse {
  message: string;
  suggestions: string[];
  programmes?: ProgrammeInfo[];
  eligibilityCategories?: EligibilityCategoryInfo;
  flowState?: ConversationFlowState;
  clarificationNeeded?: boolean;
  clarificationQuestions?: string[];
}

type ConversationFlowState =
  | 'GREETING'
  | 'COLLECTING_SUBJECTS'
  | 'COLLECTING_LEVEL'
  | 'COLLECTING_CAREER'
  | 'COLLECTING_FACULTY'
  | 'SUGGESTING_PROGRAMMES'
  | 'DEEP_DIVE'
  | 'ELIGIBILITY_CHECK'
  | 'ELIGIBILITY_RESULT'
  | 'EXPLAIN_DECISION'
  | 'COMPARING'
  | 'GUIDANCE'
  | 'CLARIFYING';

interface EntityStore {
  subjects: string[];
  subjectsWithGrades: SubjectWithGrade[];
  programmeNames: string[];
  programmeCodes: string[];
  faculties: string[];
  levels: string[];
  careerKeywords: string[];
  numericalReferences: number[];
  pronounRef: 'none' | 'first' | 'last' | 'this' | 'that' | number;
  degrees: string[];
  durations: number[];
}

interface UserProfile {
  subjects: string[];
  subjectsWithGrades: SubjectWithGrade[];
  preferredLevel: string | null;
  careerInterest: string | null;
  preferredFaculty: string | null;
  lastProgrammes: Array<{ id: string; name: string; code: string }>;
  pendingQuestions: string[];
  stage: 'new' | 'exploring' | 'narrowing' | 'decided';
  lastEligibilityResult?: EligibilityCategoryInfo;
}

// ===== Service =====

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly allSubjectsCache: string[] = [];
  private readonly allProgrammeNames: Map<string, { id: string; code: string; name: string; faculty: string }> = new Map();
  private readonly allFacultyNames: Map<string, string> = new Map();
  private cacheLoaded = false;

  constructor(
    private readonly prisma: PrismaService,
    private readonly programmesService: ProgrammesService,
    private readonly eligibilityService: EligibilityService,
    private readonly recommendationsService: RecommendationsService,
  ) {}

  private async loadCache() {
    if (this.cacheLoaded) return;
    try {
      const subjects = await this.prisma.subject.findMany({ select: { name: true } });
      this.allSubjectsCache.push(...subjects.map((s) => s.name.toLowerCase()));

      const programmes = await this.prisma.programme.findMany({
        select: { id: true, code: true, name: true, department: { select: { academicUnit: { select: { abbreviation: true } } } } },
      });
      for (const p of programmes) {
        const faculty = p.department?.academicUnit?.abbreviation ?? '';
        this.allProgrammeNames.set(p.name.toLowerCase(), {
          id: p.id,
          code: p.code,
          name: p.name,
          faculty,
        });
        this.allProgrammeNames.set(p.code.toLowerCase(), {
          id: p.id,
          code: p.code,
          name: p.name,
          faculty,
        });
      }

      const faculties = await this.prisma.academicUnit.findMany({ select: { name: true, abbreviation: true } });
      for (const f of faculties) {
        this.allFacultyNames.set(f.name.toLowerCase(), f.abbreviation ?? f.name);
        if (f.abbreviation) this.allFacultyNames.set(f.abbreviation.toLowerCase(), f.abbreviation);
      }

      this.cacheLoaded = true;
    } catch (e) {
      this.logger.warn('Failed to load cache, will use DB queries', e);
    }
  }

  // ===== Main Entry Point =====

  async processQuery(input: AiQueryInput): Promise<AiResponse> {
    await this.loadCache();
    const query = input.query.toLowerCase().trim();
    const history = input.conversationHistory || [];

    // Build user profile from conversation history
    const profile = this.buildUserProfile(history, query);

    // Extract entities from current query + history
    const entities = await this.extractEntities(query, history);

    // Detect intent
    const intent = this.detectIntent(query, entities, profile);

    // Route to appropriate handler
    switch (intent) {
      case 'greeting':
        return this.handleGreeting(profile);
      case 'help':
        return this.handleHelp(profile);
      case 'subject_search':
        return this.handleSubjectSearch(entities, query, profile);
      case 'career_search':
        return this.handleCareerSearch(entities, query, profile);
      case 'faculty_search':
        return this.handleFacultySearch(entities, query, profile);
      case 'programme_detail':
        return this.handleProgrammeDetail(entities, query, profile);
      case 'eligibility':
        return this.handleEligibilityQuery(entities, query, profile);
      case 'explain_decision':
        return this.handleExplainDecision(entities, query, profile);
      case 'clarification_response':
        return this.handleClarificationResponse(entities, query, profile);
      case 'pronoun_reference':
        return this.handlePronounReference(entities, query, profile);
      case 'comparison':
        return this.handleComparison(entities, query, profile);
      case 'undecided':
        return this.handleUndecided(profile);
      case 'general':
      default:
        return this.handleGeneralQuery(query, entities, profile);
    }
  }

  // ===== User Profile Builder =====

  private buildUserProfile(history: ConversationTurn[], currentQuery: string): UserProfile {
    const profile: UserProfile = {
      subjects: [],
      subjectsWithGrades: [],
      preferredLevel: null,
      careerInterest: null,
      preferredFaculty: null,
      lastProgrammes: [],
      pendingQuestions: [],
      stage: 'new',
    };

    // Extract from history
    for (const turn of history) {
      if (turn.role === 'user') {
        const text = turn.content.toLowerCase();
        // Detect subjects
        for (const s of this.allSubjectsCache) {
          if (text.includes(s) && !profile.subjects.includes(s)) {
            profile.subjects.push(s);
          }
        }
        // Detect level
        if (text.includes('undergraduate') || text.includes('bachelor') || text.includes('bsc') || text.includes('ba ') || text.includes('beng') || text.includes('bachelor'))
          profile.preferredLevel = 'UNDERGRADUATE';
        if (text.includes('postgraduate') || text.includes('master') || text.includes('msc') || text.includes('ma ') || text.includes('mphil'))
          profile.preferredLevel = 'POSTGRADUATE';
        if (text.includes('doctorate') || text.includes('phd') || text.includes('doctoral'))
          profile.preferredLevel = 'DOCTORATE';
        // Detect career
        const careerPhrases = ['become', 'want to be', 'work as', 'career', 'job', 'profession', 'dream'];
        for (const phrase of careerPhrases) {
          const idx = text.indexOf(phrase);
          if (idx >= 0) {
            const after = text.substring(idx + phrase.length).trim().replace(/[^a-z\s]/g, '').trim();
            if (after.length > 0 && after.length < 50) {
              profile.careerInterest = after;
              break;
            }
          }
        }
        // Detect faculty
        if (text.includes('faculty of') || text.includes('school of')) {
          const match = text.match(/(?:faculty|school)\s+of\s+([a-z\s]+)/i);
          if (match) profile.preferredFaculty = match[1].trim();
        }
        // Store last suggestions
        if (turn.programmes && turn.programmes.length > 0) {
          profile.lastProgrammes = turn.programmes.map((p) => ({ id: p.id, name: p.name, code: p.code }));
        }
      }
    }

    // Also scan current query
    if (currentQuery) {
      const text = currentQuery.toLowerCase();
      for (const s of this.allSubjectsCache) {
        if (text.includes(s) && !profile.subjects.includes(s)) {
          profile.subjects.push(s);
        }
      }
    }

    // Determine stage
    if (profile.subjects.length > 0 || profile.careerInterest || profile.preferredLevel) {
      profile.stage = 'exploring';
    }
    if (profile.lastProgrammes.length > 0) {
      profile.stage = 'narrowing';
    }
    if (profile.lastProgrammes.length > 0 && profile.preferredLevel) {
      profile.stage = 'decided';
    }

    return profile;
  }

  // ===== Entity Extraction =====

  private async extractEntities(query: string, history: ConversationTurn[]): Promise<EntityStore> {
    const entities: EntityStore = {
      subjects: [],
      subjectsWithGrades: [],
      programmeNames: [],
      programmeCodes: [],
      faculties: [],
      levels: [],
      careerKeywords: [],
      numericalReferences: [],
      pronounRef: 'none',
      degrees: [],
      durations: [],
    };

    // Combine all user text
    const allUserText = [
      query,
      ...history.filter((t) => t.role === 'user').map((t) => t.content.toLowerCase()),
    ].join(' ');

    // Subjects with grade extraction
    const gradePattern = /\b([a-z\s]+?)\s*(?:\(|\s)?([a-fA-F][0-9]?|[1-9])\s*(?:\))?/g;
    let match;
    while ((match = gradePattern.exec(allUserText)) !== null) {
      const subjectName = match[1].trim().toLowerCase();
      const grade = match[2].toUpperCase();
      for (const cachedSubject of this.allSubjectsCache) {
        if (subjectName.includes(cachedSubject) || cachedSubject.includes(subjectName)) {
          if (!entities.subjects.includes(cachedSubject)) {
            entities.subjects.push(cachedSubject);
          }
          entities.subjectsWithGrades.push({ name: cachedSubject, grade });
          break;
        }
      }
    }

    // Subjects (without grades - fallback)
    for (const subject of this.allSubjectsCache) {
      if (allUserText.includes(subject)) {
        if (!entities.subjects.includes(subject)) {
          entities.subjects.push(subject);
        }
      }
    }

    // Programme names
    for (const [name, info] of this.allProgrammeNames) {
      if (allUserText.includes(name)) {
        if (name === info.code.toLowerCase()) {
          entities.programmeCodes.push(info.code);
        } else {
          entities.programmeNames.push(info.name);
        }
      }
    }

    // Faculties
    for (const [name, abbr] of this.allFacultyNames) {
      if (allUserText.includes(name)) {
        entities.faculties.push(abbr);
      }
    }

    // Levels
    if (allUserText.includes('undergraduate')) entities.levels.push('UNDERGRADUATE');
    if (allUserText.includes('postgraduate')) entities.levels.push('POSTGRADUATE');
    if (allUserText.includes('doctorate') || allUserText.includes('phd')) entities.levels.push('DOCTORATE');
    if (allUserText.includes('professional')) entities.levels.push('PROFESSIONAL');
    if (allUserText.includes('bachelor') || allUserText.includes('bsc') || allUserText.includes('ba ') || allUserText.includes('beng') || allUserText.includes('bed'))
      entities.levels.push('UNDERGRADUATE');
    if (allUserText.includes('master') || allUserText.includes('msc') || allUserText.includes('ma '))
      entities.levels.push('POSTGRADUATE');

    // Degrees
    const degreePatterns = ['bsc', 'ba', 'beng', 'bed', 'llb', 'mbbs', 'hnd', 'msc', 'ma', 'phd', 'meng', 'pgd', 'diploma', 'btech', 'hpd'];
    for (const deg of degreePatterns) {
      if (allUserText.includes(deg)) entities.degrees.push(deg.toUpperCase());
    }

    // Career keywords
    const careerKeywords = ['doctor', 'engineer', 'teacher', 'lawyer', 'nurse', 'accountant', 'manager', 'scientist', 'researcher', 'analyst', 'developer', 'programmer', 'architect', 'pharmacist', 'journalist', 'pilot', 'surgeon', 'economist', 'psychologist', 'consultant'];
    for (const word of careerKeywords) {
      if (allUserText.includes(word)) entities.careerKeywords.push(word);
    }

    // Numerical references
    if (/\b(first|the first|1st)\b/i.test(allUserText)) entities.pronounRef = 1;
    else if (/\b(second|the second|2nd)\b/i.test(allUserText)) entities.pronounRef = 2;
    else if (/\b(third|the third|3rd)\b/i.test(allUserText)) entities.pronounRef = 3;
    else if (/\b(this|that|this one|that one|it)\b/i.test(allUserText)) entities.pronounRef = 'this';
    else if (/\b(the last|the previous)\b/i.test(allUserText)) entities.pronounRef = 'last';

    // Duration
    const durMatch = allUserText.match(/(\d+)\s*years?\s*(program|programme|course|degree)?/i);
    if (durMatch) entities.durations.push(parseInt(durMatch[1], 10));

    return entities;
  }

  // ===== Intent Detection =====

  private detectIntent(query: string, entities: EntityStore, profile: UserProfile): string {
    const q = query.toLowerCase();

    // Greeting
    if (/^(hi|hello|hey|good\s*(morning|afternoon|evening)|greetings)\b/.test(q)) {
      return 'greeting';
    }

    // Help
    if (/^(help|what can you do|how do you work|commands)/.test(q)) {
      return 'help';
    }

    // Undecided
    if (/^(i don't know|not sure|undecided|what should i|recommend|suggest|what can i|what are my options|help me choose|what is out there|explore|show me everything|i have no idea|what programmes|all programmes)/.test(q)) {
      return 'undecided';
    }

    // Pronoun reference
    if (entities.pronounRef !== 'none' && profile.lastProgrammes.length > 0) {
      if (/tell me more|about|what about|details|info/.test(q)) {
        return 'pronoun_reference';
      }
    }

    // Comparison
    if ((/compare|difference|versus|vs|better|which (one|program|programme).*(better|best|suitable)|recommend|or\s+/.test(q) && entities.programmeCodes.length >= 2)) {
      return 'comparison';
    }

    // Explain decision / why
    if (/why\s+(can'?t\s+i|don'?t\s+i|not|didn'?t|am\s+i\s+not|is\s+it)/i.test(q) && profile.lastEligibilityResult) {
      return 'explain_decision';
    }

    // Career search
    if (entities.careerKeywords.length > 0 || /career|job|work as|become|profession|occupation|dream|want to be/i.test(q)) {
      return 'career_search';
    }

    // Faculty search
    if (entities.faculties.length > 0) {
      return 'faculty_search';
    }

    // Programme detail
    if (entities.programmeNames.length > 0 || entities.programmeCodes.length > 0) {
      if (/tell me about|what is|details|info|show|about|requirements|entrance/.test(q) || entities.programmeNames.length > 0) {
        return 'programme_detail';
      }
    }

    // Eligibility / Subject search
    if (entities.subjects.length > 0) {
      if (/eligible|qualify|can i|requirements|subjects|i have|i took|i studied|i did|what can i/.test(q)) {
        return 'eligibility';
      }
      return 'subject_search';
    }

    // Clarification response
    if (profile.pendingQuestions.length > 0) {
      if (q.includes('yes') || q.includes('no') || entities.subjects.length > 0 || entities.levels.length > 0 || entities.careerKeywords.length > 0) {
        return 'clarification_response';
      }
    }

    // General
    return 'general';
  }

  // ===== Handler: Greeting =====

  private handleGreeting(profile: UserProfile): AiResponse {
    if (profile.stage !== 'new') {
      return {
message: '👋 Hello again! How can I help you continue exploring programmes?',
        suggestions: [
          'I want to study something specific',
          'Show me what I can study with my subjects',
          'I need career guidance',
          'Browse all programmes',
        ],
        flowState: 'GREETING',
      };
    }

    return {
message: `👋 **Welcome to the USPA Programme Advisor!** I'm here to help you find the perfect programme.

Let me ask you a few questions to guide you:

📌 **What brings you here today?**
• Do you already know what you want to study?
• Do you have specific subjects you're interested in?
• Are you looking for career guidance?
• Or just browsing to see what's available?`,
      suggestions: [
        'I know what I want to study',
        'I have subjects, what can I do?',
        'Help me find a career path',
        'Just browsing',
      ],
      flowState: 'GREETING',
      clarificationNeeded: true,
      clarificationQuestions: ['Do you know what you want to study?', 'Do you have subjects you want to work with?', 'Are you looking for career guidance?'],
    };
  }

  // ===== Handler: Help =====

  private handleHelp(profile: UserProfile): AiResponse {
    return {
      message: `🤖 **Here's how I can help you:**

🎓 **Find Programmes** — "Show me programmes in Computer Science" or "What programmes does FEMS offer?"
📚 **Subject-Based Search** — "I have Biology, Chemistry and Physics — what can I study?"
💼 **Career Guidance** — "I want to become a software engineer" or "Careers in healthcare"
✅ **Check Eligibility** — "Can I study Medicine with my subjects?"
🏛️ **Faculty Info** — "Tell me about the Faculty of Science"
🔍 **Programme Details** — "What are the requirements for MBBS?"

Just type naturally, like you're talking to a friend!`,
      suggestions: [
        'What programmes are available?',
        'I want to become a doctor',
        'I have Biology, Chemistry, and Mathematics',
        'Show me faculties',
      ],
      flowState: 'GUIDANCE',
    };
  }

  // ===== Handler: Subject Search =====

  private async handleSubjectSearch(entities: EntityStore, query: string, profile: UserProfile): Promise<AiResponse> {
    const subjects = entities.subjects.length > 0 ? entities.subjects : profile.subjects;

    if (subjects.length === 0) {
      return {
        message: 'I noticed you mentioned some subjects but I couldn\'t identify them clearly. Could you tell me which subjects you studied? For example:\n\n• "I have **Biology, Chemistry** and **Mathematics**"\n• "I studied **Physics, Economics** and **Geography**"',
        suggestions: ['I have Biology, Chemistry and Mathematics', 'I studied Physics, Economics and Geography', 'My subjects are English, History and French'],
        flowState: 'COLLECTING_SUBJECTS',
        clarificationNeeded: true,
      };
    }

    // Find programmes matching these subjects
    const programmes = await this.findProgrammesBySubjects(subjects);

    if (programmes.length === 0) {
      return {
        message: `I checked all programmes but couldn't find any that specifically match **${subjects.join(', ')}**. This could mean:\n\n1. These subjects are combined differently in our programmes\n2. You might need to add more subjects\n\n**Could you tell me:**\n• What **level** are you interested in? (Undergraduate/Postgraduate)\n• Or what **career** are you aiming for?`,
        suggestions: [
          'I want to study at undergraduate level',
          'I\'m looking for postgraduate programmes',
          ...this.getSuggestedQuestions().slice(0, 2),
        ],
        flowState: 'COLLECTING_LEVEL',
        clarificationNeeded: true,
      };
    }

    // If level is known, filter
    let filtered = programmes;
    if (profile.preferredLevel) {
      filtered = programmes.filter((p: any) => p.level === profile.preferredLevel);
    }

    if (filtered.length === 0) {
      filtered = programmes;
    }

    const topProgrammes = filtered.slice(0, 6);

    return {
      message: `🎯 **Great!** With subjects in **${subjects.join(', ')}**, here are some programmes you might be interested in:\n\n${topProgrammes.map((p: any, i: number) => `${i + 1}. **${p.name}** (${p.code}) — ${p.department?.academicUnit?.abbreviation || ''} — ${p.duration} years`).join('\n')}\n\n${filtered.length > 6 ? `\n*And ${filtered.length - 6} more...*` : ''}\n\nWould you like to:\n• Get details on any of these?`,
      programmes: topProgrammes.map((p: any) => ({
        id: p.id,
        name: p.name,
        code: p.code,
        degree: p.degree,
        faculty: p.department?.academicUnit?.abbreviation ?? '',
        duration: p.duration,
        level: p.level,
        relevance: `${p._count?.requirements ?? 0} subject requirements match`,
      })),
      suggestions: [
        'Tell me more about the first one',
        'Check eligibility for these programmes',
        'What level are these programmes?',
        'Show me more options',
      ],
      flowState: 'SUGGESTING_PROGRAMMES',
    };
  }

  // ===== Handler: Career Search =====

  private async handleCareerSearch(entities: EntityStore, query: string, profile: UserProfile): Promise<AiResponse> {
    let careerTerm = '';
    const careerPhrases = ['become', 'want to be', 'work as', 'career in', 'job in', 'profession', 'dream of', 'study'];
    for (const phrase of careerPhrases) {
      const idx = query.toLowerCase().indexOf(phrase);
      if (idx >= 0) {
        careerTerm = query.substring(idx + phrase.length).trim().replace(/[^a-z\s]/g, '').trim();
        break;
      }
    }

    if (!careerTerm && entities.careerKeywords.length > 0) {
      careerTerm = entities.careerKeywords[0];
    }

    if (!careerTerm) {
      return {
        message: `💼 **Career Guidance**\n\nTell me what career you're interested in! For example:\n\n• "I want to become a **doctor**"\n• "I'm interested in **engineering**"\n• "I want to work in **IT**"\n• "Careers in **business**"`,
        suggestions: [
          'I want to become a doctor',
          'I want to be a software engineer',
          'Careers in business and finance',
          'I want to become a teacher',
        ],
        flowState: 'COLLECTING_CAREER',
        clarificationNeeded: true,
      };
    }

    const programmes = await this.prisma.programme.findMany({
      where: {
        OR: [
          { careers: { some: { career: { name: { contains: careerTerm, mode: 'insensitive' } } } } },
          { name: { contains: careerTerm, mode: 'insensitive' } },
          { description: { contains: careerTerm, mode: 'insensitive' } },
        ],
      },
      include: {
        department: { include: { academicUnit: { select: { abbreviation: true } } } },
        careers: { include: { career: true }, take: 3 },
        _count: { select: { requirements: true } },
      },
      take: 8,
    });

    if (programmes.length === 0) {
      return {
        message: `I searched for programmes related to **${careerTerm}** but couldn't find a direct match. Let me help you narrow it down:\n\n• Is **${careerTerm}** related to a specific field like Science, Arts, Business, or Engineering?\n• Do you have specific subjects you want to work with?`,
        suggestions: [
          'It\'s related to Science',
          'It\'s in Business/Finance',
          'It\'s in Engineering/Technology',
          'Show me all available programmes',
        ],
        flowState: 'CLARIFYING',
        clarificationNeeded: true,
      };
    }

    return {
      message: `💼 **Great choice!** Here are programmes that can lead to a career in **${careerTerm}**:\n\n${programmes.slice(0, 6).map((p: any, i: number) => `${i + 1}. **${p.name}** (${p.code})\n   📍 ${p.department.academicUnit.abbreviation} | ⏱ ${p.duration} years | 🎓 ${p.degree}\n   ${p.careers.length > 0 ? `   💼 Careers: ${p.careers.map((c: any) => c.career.name).join(', ')}` : ''}`).join('\n\n')}\n\n${programmes.length > 6 ? `\n*And ${programmes.length - 6} more...*` : ''}`,
      programmes: programmes.slice(0, 6).map((p: any) => ({
        id: p.id,
        name: p.name,
        code: p.code,
        degree: p.degree,
        faculty: p.department.academicUnit.abbreviation ?? '',
        duration: p.duration,
        level: p.level,
        relevance: `Leads to ${p.careers.map((c: any) => c.career.name).join(', ')}`,
      })),
      suggestions: [
        `What are the requirements for ${programmes[0].code}?`,
        'What subjects do I need for these?',
        'How long are these programmes?',
        'Show me more options',
      ],
      flowState: 'SUGGESTING_PROGRAMMES',
    };
  }

  // ===== Handler: Faculty Search =====

  private async handleFacultySearch(entities: EntityStore, query: string, profile: UserProfile): Promise<AiResponse> {
    const facultyAbbr = entities.faculties[0];

    if (!facultyAbbr) {
      const faculties = await this.prisma.academicUnit.findMany({
        include: { _count: { select: { departments: true } } },
      });

      return {
        message: `🏛️ **Faculties & Schools**\n\nHere are all the academic units:\n\n${faculties.map((f) => `• **${f.name}** (${f.abbreviation}) — ${f._count.departments} departments`).join('\n')}\n\nWhich one would you like to explore?`,
        programmes: [],
        suggestions: [
          'Tell me about FHS',
          'What programmes does FET offer?',
          'Show me FEMS departments',
          'What is CBMS?',
        ],
        flowState: 'COLLECTING_FACULTY',
      };
    }

    const faculty = await this.prisma.academicUnit.findFirst({
      where: { OR: [{ abbreviation: facultyAbbr }, { name: { contains: facultyAbbr, mode: 'insensitive' } }] },
      include: {
        _count: { select: { departments: true } },
        departments: {
          include: { _count: { select: { programmes: true } } },
          orderBy: { name: 'asc' },
        },
      },
    });

    if (!faculty) {
      return {
        message: `I couldn't find a faculty matching "${facultyAbbr}". Try one of these: FHS, FET, FLPS, FS, FA, FED, FEMS, CBMS, HTTTC, NAHPI, HICM, HITL, HND.`,
        suggestions: ['Tell me about FHS', 'What is FET?', 'Show me all faculties'],
        flowState: 'CLARIFYING',
      };
    }

    const totalProgrammes = await this.prisma.programme.count({
      where: { department: { academicUnitId: faculty.id } },
    });

    return {
      message: `🏛️ **${faculty.name} (${faculty.abbreviation})**\n${faculty.description || ''}\n\n📊 **Overview:**\n• ${faculty._count.departments} departments\n• ${totalProgrammes} programmes\n\n**Departments:**\n${faculty.departments.map((d) => `• **${d.name}** (${d._count.programmes} programmes)`).join('\n')}\n\nWould you like to see programmes in a specific department?`,
      programmes: [],
      suggestions: [
        `Show all programmes in ${faculty.abbreviation}`,
        `What are the admission requirements for ${faculty.abbreviation}?`,
        'Browse another faculty',
        'Show me career options in this faculty',
      ],
      flowState: 'COLLECTING_FACULTY',
    };
  }

  // ===== Handler: Programme Detail =====

  private async handleProgrammeDetail(entities: EntityStore, query: string, profile: UserProfile): Promise<AiResponse> {
    const programmeName = entities.programmeNames[0];
    const programmeCode = entities.programmeCodes[0];

    let programme: any = null;

    if (programmeCode) {
      programme = await this.prisma.programme.findUnique({
        where: { code: programmeCode },
        include: {
          department: { include: { academicUnit: { select: { name: true, abbreviation: true } } } },
          requirements: { include: { subject: true }, take: 10 },
          tuition: { orderBy: { academicYear: 'desc' }, take: 1 },
          careers: { include: { career: true }, take: 5 },
          _count: { select: { requirements: true, careers: true } },
        },
      });
    }

    if (!programme && programmeName) {
      programme = await this.prisma.programme.findFirst({
        where: { name: { contains: programmeName, mode: 'insensitive' } },
        include: {
          department: { include: { academicUnit: { select: { name: true, abbreviation: true } } } },
          requirements: { include: { subject: true }, take: 10 },
          tuition: { orderBy: { academicYear: 'desc' }, take: 1 },
          careers: { include: { career: true }, take: 5 },
          _count: { select: { requirements: true, careers: true } },
        },
      });
    }

    if (!programme) {
      return {
        message: `I couldn't find a programme matching that. Could you try searching by programme code (like **MBBS-01** or **BSC-CS-01**) or full name?`,
        suggestions: this.getSuggestedQuestions(),
        flowState: 'CLARIFYING',
      };
    }

    const tuition = programme.tuition?.[0];
    const tuitionStr = tuition ? `${Number(tuition.amount).toLocaleString()} ${tuition.currency} / year` : 'Contact university';

    return {
      message: `🎓 **${programme.name} (${programme.code})**\n\n📋 **Key Information:**\n• **Degree:** ${programme.degree}\n• **Level:** ${programme.level.replace('_', ' ')}\n• **Duration:** ${programme.duration} years\n• **Faculty:** ${programme.department.academicUnit.name}\n• **Department:** ${programme.department.name}\n• **Tuition:** ${tuitionStr}\n\n${programme.description ? `📝 **Overview:**\n${programme.description}\n\n` : ''}${programme.requirements.length > 0 ? `📚 **Subject Requirements:**\n${programme.requirements.map((r: any) => `• ${r.subject.name} (${r.requirementType}${r.minimumGrade ? ` - Min: ${r.minimumGrade}` : ''})`).join('\n')}\n\n` : ''}${programme.careers.length > 0 ? `💼 **Career Opportunities:**\n${programme.careers.map((c: any) => `• ${c.career.name}`).join('\n')}` : ''}`,
      programmes: [{
        id: programme.id,
        name: programme.name,
        code: programme.code,
        degree: programme.degree,
        faculty: programme.department.academicUnit.abbreviation ?? '',
        duration: programme.duration,
        level: programme.level,
        relevance: `${programme._count.requirements} requirements`,
      }],
      suggestions: [
        `Check my eligibility for ${programme.code}`,
        'What are the O Level requirements?',
        'Show me similar programmes',
        'Compare with another programme',
      ],
      flowState: 'DEEP_DIVE',
    };
  }

  // ===== Handler: Eligibility =====

  private async handleEligibilityQuery(entities: EntityStore, query: string, profile: UserProfile): Promise<AiResponse> {
    const subjects = entities.subjects.length > 0 ? entities.subjects : profile.subjects;
    const subjectsWithGrades = entities.subjectsWithGrades.length > 0 ? entities.subjectsWithGrades : profile.subjectsWithGrades;

    if (subjects.length === 0) {
      return {
        message: `✅ **Eligibility Check**\n\nTo check which programmes you qualify for, I need to know:\n\n1️⃣ **What subjects did you take?** (O Level and/or A Level)\n2️⃣ **What level** are you applying for? (Undergraduate/Postgraduate)\n3️⃣ **Any specific programme** in mind?\n\nExample: "I have Biology, Chemistry and Physics at A Level, and I want to study Medicine"`,
        suggestions: [
          'I have Biology, Chemistry and Mathematics',
          'I want to study Computer Science',
          'What subjects do I need for Engineering?',
        ],
        flowState: 'COLLECTING_SUBJECTS',
        clarificationNeeded: true,
      };
    }

    // Run full eligibility check using the EligibilityService
    const eligibilityResult = await this.processEligibility(subjects, subjectsWithGrades, profile.preferredLevel);
    profile.lastEligibilityResult = eligibilityResult;

    // Build message
    let message = `✅ **Eligibility Results for: ${subjects.join(', ')}**\n\n`;

    // Admission rules
    if (eligibilityResult.generalRules.length > 0) {
      message += `📋 **General Admission Rules:**\n${eligibilityResult.generalRules.map((r) => `• ${r}`).join('\n')}\n\n`;
    }

    // Eligible programmes
    if (eligibilityResult.eligible.length > 0) {
      message += `✅ **You qualify for:**\n`;
      message += eligibilityResult.eligible.slice(0, 5).map((p) =>
        `• **${p.name}** (${p.code}) — ${p.faculty} — ${p.duration} years\n  ${p.reasons.map((r) => `  ✓ ${r}`).join('\n')}`
      ).join('\n');
      message += '\n\n';
    }

    // Conditional
    if (eligibilityResult.conditional.length > 0) {
      message += `⚠️ **You partially qualify for (may need additional requirements):**\n`;
      message += eligibilityResult.conditional.slice(0, 3).map((p) =>
        `• **${p.name}** (${p.code}) — ${p.faculty}\n  ❌ Missing: ${p.missing.join(', ')}`
      ).join('\n');
      message += '\n\n';
    }

    // Not eligible
    if (eligibilityResult.notEligible.length > 0) {
      message += `❌ **You do NOT qualify for:**\n`;
      message += eligibilityResult.notEligible.slice(0, 5).map((p) =>
        `• **${p.name}** (${p.code}) — ${p.faculty}\n  ❌ Missing: ${p.missing.join(', ')}`
      ).join('\n');
      message += '\n\n';
    }

    if (eligibilityResult.eligible.length === 0 && eligibilityResult.conditional.length === 0) {
      message += `💡 **Alternatives:** With your subjects, consider exploring programmes in related fields. Would you like me to suggest some alternatives?`;
    } else {
      message += `💡 **Tip:** Use the **Admission Checker** for a detailed grade-based verification!`;
    }

    // Build programmes list for UI
    const allProgs = [
      ...eligibilityResult.eligible.map((p) => ({ ...p, relevance: '✅ Eligible' })),
      ...eligibilityResult.conditional.map((p) => ({ ...p, relevance: '⚠️ Partial' })),
      ...eligibilityResult.notEligible.map((p) => ({ ...p, relevance: '❌ Not Eligible' })),
    ];

    return {
      message,
      programmes: allProgs.slice(0, 10).map((p) => ({
        id: p.id,
        name: p.name,
        code: p.code,
        degree: p.degree,
        faculty: p.faculty,
        duration: p.duration,
        level: p.level,
        relevance: p.relevance,
      })),
      eligibilityCategories: eligibilityResult,
      suggestions: [
        'Why can\'t I study Medicine?',
        'What subjects am I missing?',
        'Show me alternatives',
        'Tell me more about the first one',
      ],
      flowState: 'ELIGIBILITY_RESULT',
    };
  }

  // ===== Handler: Explain Decision =====

  private async handleExplainDecision(entities: EntityStore, query: string, profile: UserProfile): Promise<AiResponse> {
    const lastResult = profile.lastEligibilityResult;
    if (!lastResult) {
      return {
        message: `I don't have any previous eligibility results to explain. Could you tell me your subjects first?\n\nExample: "I have Biology, Chemistry and Geography"`,
        suggestions: [
          'I have Biology, Chemistry and Geography',
          'I have Physics, Mathematics and Computer Science',
          'I want to check my eligibility',
        ],
        flowState: 'CLARIFYING',
      };
    }

    // Find which programme they're asking about
    let targetProgramme: string | null = null;
    const q = query.toLowerCase();

    // Check if they mentioned a specific programme name in last results
    const allProgrammes = [
      ...lastResult.eligible,
      ...lastResult.conditional,
      ...lastResult.notEligible,
    ];

    for (const prog of allProgrammes) {
      if (q.includes(prog.name.toLowerCase()) || q.includes(prog.code.toLowerCase())) {
        targetProgramme = prog.name;
        break;
      }
    }

    if (!targetProgramme && allProgrammes.length > 0) {
      // Check if they're asking about "Medicine" or a generic name
      const medMatch = q.match(/medicine|mbbs|nursing|engineering|computer\s*science|law/i);
      if (medMatch) {
        const found = allProgrammes.find((p) =>
          p.name.toLowerCase().includes(medMatch[0].toLowerCase()) ||
          p.code.toLowerCase().includes(medMatch[0].toLowerCase())
        );
        if (found) targetProgramme = found.name;
      }
    }

    if (targetProgramme) {
      const eligible = lastResult.eligible.find((p) => p.name === targetProgramme);
      const conditional = lastResult.conditional.find((p) => p.name === targetProgramme);
      const notEligible = lastResult.notEligible.find((p) => p.name === targetProgramme);

      if (eligible) {
        return {
          message: `✅ **Why you qualify for ${targetProgramme}**\n\nYou meet all the subject requirements:\n${eligible.reasons.map((r) => `✓ ${r}`).join('\n')}\n\nYou're on the right track! Would you like to check the grade requirements too?`,
          suggestions: [
            'What grades do I need for this programme?',
            'Tell me more about this programme',
            'What are the career prospects?',
            'Check another programme',
          ],
          flowState: 'EXPLAIN_DECISION',
        };
      }

      if (conditional) {
        return {
          message: `⚠️ **Why you partially qualify for ${targetProgramme}**\n\nYou have some matching subjects but are missing:\n❌ ${conditional.missing.join('\n❌ ')}\n\n**Recommendation:** Consider taking these subjects or look into alternative programmes that match your current subjects.`,
          suggestions: [
            'What alternatives do I have?',
            'Can I still apply?',
            'Show me similar programmes',
            'Check my eligibility for something else',
          ],
          flowState: 'EXPLAIN_DECISION',
        };
      }

      if (notEligible) {
        // Fetch programme details to show complete requirements
        const programmeDetails = await this.prisma.programme.findFirst({
          where: {
            OR: [
              { name: { contains: targetProgramme, mode: 'insensitive' } },
              { code: { contains: targetProgramme, mode: 'insensitive' } },
            ],
          },
          include: {
            requirements: {
              include: { subject: true },
            },
          },
        });

        let detailsSection = '';
        if (programmeDetails && programmeDetails.requirements.length > 0) {
          detailsSection = `\n\n📚 **Full requirements for ${programmeDetails.name}:**\n${programmeDetails.requirements.map((r) =>
            `• ${r.subject.name} (${r.requirementType}${r.minimumGrade ? ` - Min grade: ${r.minimumGrade}` : ''})`
          ).join('\n')}`;
        }

        return {
          message: `❌ **Why you don't qualify for ${targetProgramme}**\n\nMissing subjects:\n❌ ${notEligible.missing.join('\n❌ ')}

💡 **To qualify for ${targetProgramme}, you would need to have these subjects.**
${detailsSection}

**Alternative suggestion:** Consider these programmes that better match your subjects.`,
          suggestions: [
            'Show me programmes I qualify for',
            'What alternatives are similar to this?',
            'Tell me more about the requirements',
            'Check another programme instead',
          ],
          flowState: 'EXPLAIN_DECISION',
        };
      }
    }

    // No specific programme found - show summary of last eligibility
    return {
      message: `📊 **Summary of your eligibility check**\n\n✅ **Qualify for:** ${lastResult.eligible.length > 0 ? lastResult.eligible.map((p) => `${p.name} (${p.code})`).join(', ') : 'None'}

⚠️ **Partially qualify for:** ${lastResult.conditional.length > 0 ? lastResult.conditional.map((p) => `${p.name} (${p.code})`).join(', ') : 'None'}

❌ **Don't qualify for:** ${lastResult.notEligible.length > 0 ? lastResult.notEligible.map((p) => `${p.name} (${p.code})`).join(', ') : 'None'}

Which programme would you like me to explain in detail?`,
      suggestions: [
        ...(lastResult.notEligible.length > 0 ? [`Why can't I study ${lastResult.notEligible[0].name}?`] : []),
        ...(lastResult.eligible.length > 0 ? [`Tell me more about ${lastResult.eligible[0].name}`] : []),
        'Show me alternative programmes',
      ],
      flowState: 'EXPLAIN_DECISION',
    };
  }

  // ===== Handler: Clarification Response =====

  private async handleClarificationResponse(entities: EntityStore, query: string, profile: UserProfile): Promise<AiResponse> {
    const q = query.toLowerCase();

    // If user answered with subjects, proceed to subject search
    if (entities.subjects.length > 0) {
      return this.handleSubjectSearch(entities, query, profile);
    }

    // If user answered with a level
    if (entities.levels.length > 0) {
      profile.preferredLevel = entities.levels[0];
      if (!profile.subjects.length && !profile.careerInterest) {
        return {
          message: `Great, **${entities.levels[0].charAt(0) + entities.levels[0].slice(1).toLowerCase()}** level! Now, to find the right programme for you:\n\n📌 **Do you have specific subjects you studied?**\nOr\n📌 **Is there a particular career you're interested in?**`,
          suggestions: [
            'I have Biology, Chemistry and Mathematics',
            'I want to become an engineer',
            'I\'m interested in business',
            'Show me all programmes at this level',
          ],
          flowState: 'COLLECTING_SUBJECTS',
          clarificationNeeded: true,
        };
      }
      return this.handleSubjectSearch(entities, query, profile);
    }

    // If user answered with a career
    if (entities.careerKeywords.length > 0) {
      return this.handleCareerSearch(entities, query, profile);
    }

    // If user said yes
    if (/^yes|yeah|sure|okay|alright|please/i.test(q)) {
      if (profile.lastProgrammes.length > 0) {
        return this.handlePronounReference({ ...entities, pronounRef: 'first' as const }, query, profile);
      }
      return {
        message: 'Great! What would you like to know more about?',
        suggestions: this.getSuggestedQuestions(),
        flowState: 'GUIDANCE',
      };
    }

    if (/^no|nope|not really|nah/i.test(q)) {
      return {
        message: 'No problem! Let me help you find something else. What are you interested in?\n\n• **Subjects** you studied?\n• A **career** you want to pursue?\n• A specific **faculty**?',
        suggestions: [
          'I have some subjects',
          'I want to explore careers',
          'Show me faculties',
          'Just show me what\'s available',
        ],
        flowState: 'GUIDANCE',
      };
    }

    return this.handleGeneralQuery(query, entities, profile);
  }

  // ===== Handler: Pronoun Reference =====

  private async handlePronounReference(entities: EntityStore, query: string, profile: UserProfile): Promise<AiResponse> {
    let index = 0;
    if (typeof entities.pronounRef === 'number') {
      index = entities.pronounRef - 1;
    }

    const programme = profile.lastProgrammes[index];
    if (!programme) {
      return {
        message: 'I couldn\'t find which programme you\'re referring to. Could you please specify the name or code?',
        suggestions: ['Tell me about the first programme', 'What about the second one?', 'Show me the list again'],
        flowState: 'CLARIFYING',
      };
    }

    const fullProgramme = await this.prisma.programme.findUnique({
      where: { id: programme.id },
      include: {
        department: { include: { academicUnit: { select: { name: true, abbreviation: true } } } },
        requirements: { include: { subject: true }, take: 10 },
        tuition: { orderBy: { academicYear: 'desc' }, take: 1 },
        careers: { include: { career: true }, take: 5 },
        _count: { select: { requirements: true, careers: true } },
      },
    });

    if (!fullProgramme) {
      return {
        message: `I'm sorry, I couldn't find details for **${programme.name}**. It may have been removed or updated.`,
        suggestions: ['Show me the list again', 'Tell me about another programme'],
        flowState: 'CLARIFYING',
      };
    }

    const tuition = fullProgramme.tuition?.[0];
    const tuitionStr = tuition ? `${Number(tuition.amount).toLocaleString()} ${tuition.currency} / year` : 'Contact university';

    return {
      message: `Here are the details for **${fullProgramme.name} (${fullProgramme.code})**:\n\n📋 **Details:**\n• **Degree:** ${fullProgramme.degree}\n• **Level:** ${fullProgramme.level.replace('_', ' ')}\n• **Duration:** ${fullProgramme.duration} years\n• **Faculty:** ${fullProgramme.department.academicUnit.name}\n• **Tuition:** ${tuitionStr}\n\n${fullProgramme.description ? `📝 **Overview:** ${fullProgramme.description.substring(0, 200)}...\n\n` : ''}${fullProgramme.requirements.length > 0 ? `📚 **Key Requirements:** ${fullProgramme.requirements.slice(0, 5).map((r: any) => r.subject.name).join(', ')}` : ''}`,
      programmes: [{
        id: fullProgramme.id,
        name: fullProgramme.name,
        code: fullProgramme.code,
        degree: fullProgramme.degree,
        faculty: fullProgramme.department.academicUnit.abbreviation ?? '',
        duration: fullProgramme.duration,
        level: fullProgramme.level,
        relevance: `${fullProgramme._count.requirements} requirements`,
      }],
      suggestions: [
        `Check my eligibility for ${fullProgramme.code}`,
        'What are the O Level requirements?',
        'Show me similar programmes',
        'Compare with another programme',
      ],
      flowState: 'DEEP_DIVE',
    };
  }

  // ===== Handler: Comparison =====

  private async handleComparison(entities: EntityStore, query: string, profile: UserProfile): Promise<AiResponse> {
    const codes = entities.programmeCodes.slice(0, 3);
    if (codes.length < 2) {
      return {
        message: 'To compare programmes, please mention two or more programmes. For example: "Compare **MBBS-01** and **BSC-NUR-01**"',
        suggestions: ['Compare MBBS and BSc Nursing', 'Compare Computer Science and Computer Engineering', 'Show me differences between programmes'],
        flowState: 'CLARIFYING',
      };
    }

    const programmes = await this.prisma.programme.findMany({
      where: { code: { in: codes } },
      include: {
        department: { include: { academicUnit: { select: { abbreviation: true } } } },
        tuition: { orderBy: { academicYear: 'desc' }, take: 1 },
        _count: { select: { requirements: true, careers: true } },
      },
    });

    if (programmes.length < 2) {
      return {
        message: 'I could only find one of those programmes. Could you check the programme codes?',
        suggestions: ['Compare MBBS and BSc Nursing', 'Show me available programmes'],
        flowState: 'CLARIFYING',
      };
    }

    return {
      message: `📊 **Comparison: ${programmes.map((p) => p.name).join(' vs ')}**\n\n${programmes.map((p) => {
        const t = p.tuition?.[0];
        const tuitionStr = t ? `${Number(t.amount).toLocaleString()} XAF` : 'N/A';
        return `• **${p.name}** (${p.code})\n  📍 ${p.department.academicUnit.abbreviation} | ⏱ ${p.duration} years | 🎓 ${p.degree}\n  💰 ${tuitionStr}/yr | 📚 ${p._count.requirements} requirements | 💼 ${p._count.careers} careers`;
      }).join('\n\n')}\n\n💡 **Tip:** Use the **Compare tool** for a detailed side-by-side comparison!`,
      programmes: programmes.map((p: any) => ({
        id: p.id,
        name: p.name,
        code: p.code,
        degree: p.degree,
        faculty: p.department.academicUnit.abbreviation ?? '',
        duration: p.duration,
        level: p.level,
        relevance: `${p._count.requirements} requirements, ${p._count.careers} careers`,
      })),
      suggestions: [
        'Which one is better for my career?',
        'What are the entry requirements?',
        'Check my eligibility for these',
        'Show me similar programmes',
      ],
      flowState: 'COMPARING',
    };
  }

  // ===== Handler: Undecided =====

  private async handleUndecided(profile: UserProfile): Promise<AiResponse> {
    const faculties = await this.prisma.academicUnit.findMany({
      include: {
        _count: { select: { departments: true } },
        departments: {
          include: { _count: { select: { programmes: true } } },
        },
      },
      orderBy: { name: 'asc' },
    });

    const totalProgrammes = await this.prisma.programme.count();
    const totalFaculties = faculties.length;

    return {
      message: `🎯 **Let's find the perfect programme for you!**\n\nWe offer **${totalProgrammes} programmes** across **${totalFaculties} faculties and schools**. That's a lot to choose from, so let me help you narrow it down!\n\n**Tell me about yourself:**\n\n🔬 **Are you interested in Sciences?** (Biology, Chemistry, Physics, Computer Science)\n📚 **Do you prefer Arts & Humanities?** (English, History, Languages, Philosophy)\n⚖️ **Maybe Law & Political Science?**\n💼 **Or Business & Management?**\n🔧 **What about Engineering & Technology?**\n🏥 **Or Health Sciences?** (Medicine, Nursing, Public Health)\n\nOr just pick a faculty below to explore!`,
      programmes: [],
      suggestions: [
        'I\'m interested in Sciences',
        'I prefer Arts and Humanities',
        'I want something in Business',
        'Show me Engineering programmes',
        'I\'m interested in Health Sciences',
        'Show me all faculties',
      ],
      flowState: 'GUIDANCE',
      clarificationNeeded: true,
      clarificationQuestions: [
        'Are you interested in Sciences?',
        'Do you prefer Arts & Humanities?',
        'Are you interested in Business?',
        'Do you want Engineering?',
      ],
    };
  }

  // ===== Handler: General =====

  private async handleGeneralQuery(query: string, entities: EntityStore, profile: UserProfile): Promise<AiResponse> {
    const searchResults = await this.programmesService.search({ query, limit: 4 });

    if (searchResults.data.length > 0) {
      return {
        message: `I found some information related to your query. Here are matching programmes:\n\n${searchResults.data.map((p: any, i: number) => `${i + 1}. **${p.name}** (${p.code}) — ${p.department?.academicUnit?.abbreviation || ''} — ${p.duration} years`).join('\n')}`,
        programmes: searchResults.data.map((p: any) => ({
          id: p.id,
          name: p.name,
          code: p.code,
          degree: p.degree,
          faculty: p.department?.academicUnit?.abbreviation ?? '',
          duration: p.duration,
          level: p.level,
          relevance: `${p._count?.requirements ?? 0} requirements`,
        })),
        suggestions: [
          'Tell me more about the first one',
          'Check eligibility for these',
          'What level are these programmes?',
          'Show me more options',
        ],
        flowState: 'SUGGESTING_PROGRAMMES',
      };
    }

    if (profile.subjects.length > 0) {
      return this.handleSubjectSearch(entities, query, profile);
    }

    if (profile.careerInterest) {
      return this.handleCareerSearch(entities, query, profile);
    }

    return {
      message: `I'm not sure I understood your question. Let me help you get started!\n\n**I can help you with:**\n\n1️⃣ **Find by Subject** — Tell me what subjects you studied\n2️⃣ **Career Guidance** — Tell me your dream career\n3️⃣ **Browse Faculties** — Explore by faculty/school\n4️⃣ **Browse All** — See everything available\n\nWhat sounds best?`,
      suggestions: [
        'I have Biology, Chemistry and Mathematics',
        'I want to become a software engineer',
        'Show me all faculties',
        'Show me all programmes',
      ],
      flowState: 'GREETING',
    };
  }

  // ===== Eligibility Processing Engine =====

  private async processEligibility(
    subjects: string[],
    subjectsWithGrades: SubjectWithGrade[],
    preferredLevel: string | null,
  ): Promise<EligibilityCategoryInfo> {
    const result: EligibilityCategoryInfo = {
      eligible: [],
      conditional: [],
      notEligible: [],
      generalRules: [],
    };

    // Load general admission rules
    try {
      const rules = await this.prisma.generalAdmissionRule.findMany({
        where: { isActive: true },
        take: 3,
      });
      result.generalRules = rules.map((r) => `${r.title}: ${r.description.substring(0, 100)}`);
    } catch (e) {
      this.logger.warn('Could not load admission rules', e);
    }

    // Look up subject IDs
    const subjectRecords = await this.prisma.subject.findMany({
      where: { name: { in: subjects, mode: 'insensitive' } },
    });

    if (subjectRecords.length === 0) return result;

    const subjectIds = subjectRecords.map((s) => s.id);
    const subjectNameToId = new Map(subjectRecords.map((s) => [s.name.toLowerCase(), s.id]));

    // Build O Level and A Level subject inputs for EligibilityService
    const oLevelSubjects: Array<{ subjectId: string; grade: string }> = [];
    const aLevelSubjects: Array<{ subjectId: string; grade: string }> = [];

    // Determine level for each subject from DB
    for (const swg of subjectsWithGrades) {
      const subjectId = subjectNameToId.get(swg.name.toLowerCase());
      if (subjectId) {
        const subjectRec = subjectRecords.find((s) => s.id === subjectId);
        if (subjectRec) {
          const grade = swg.grade || 'C6';
          if (subjectRec.level === 'O_LEVEL') {
            oLevelSubjects.push({ subjectId, grade });
          } else {
            aLevelSubjects.push({ subjectId, grade });
          }
        }
      }
    }

    // Also add subjects without grades as O Level (assuming O Level)
    for (const subjectName of subjects) {
      const subjectId = subjectNameToId.get(subjectName.toLowerCase());
      if (subjectId && !oLevelSubjects.find((o) => o.subjectId === subjectId) && !aLevelSubjects.find((a) => a.subjectId === subjectId)) {
        oLevelSubjects.push({ subjectId, grade: 'C6' });
      }
    }

    // Build where clause
    const whereClause: any = {
      requirements: {
        some: {
          subjectId: { in: subjectIds },
        },
      },
    };
    if (preferredLevel) {
      whereClause.level = preferredLevel;
    }

    // Find all programmes that have requirements matching these subjects
    const matchingProgrammes = await this.prisma.programme.findMany({
      where: whereClause,
      include: {
        department: {
          include: {
            academicUnit: { select: { abbreviation: true, name: true } },
          },
        },
        requirements: {
          include: { subject: true },
        },
        _count: { select: { requirements: true } },
      },
      take: 20,
    });

    if (matchingProgrammes.length === 0) return result;

    // For each programme, check eligibility
    for (const programme of matchingProgrammes) {
      const missingSubjects: string[] = [];
      const satisfiedSubjects: string[] = [];
      let hasAllRequired = true;

      for (const req of programme.requirements) {
        const subjectName = req.subject.name;
        const matchedSubject = subjectsWithGrades.find(
          (s) => s.name.toLowerCase() === subjectName.toLowerCase()
        ) || subjects.find((s) => s.toLowerCase() === subjectName.toLowerCase());

        if (matchedSubject) {
          satisfiedSubjects.push(subjectName);
        } else {
          hasAllRequired = false;
          missingSubjects.push(subjectName);
        }
      }

      const programmeEntry = {
        id: programme.id,
        name: programme.name,
        code: programme.code,
        degree: programme.degree,
        faculty: programme.department?.academicUnit?.abbreviation ?? programme.department?.academicUnit?.name ?? '',
        duration: programme.duration,
        level: programme.level,
      };

      if (hasAllRequired && programme.requirements.length > 0) {
        result.eligible.push({
          ...programmeEntry,
          reasons: satisfiedSubjects.map((s) => `${s} ✓`),
        });
      } else if (missingSubjects.length <= Math.ceil(programme.requirements.length / 2) && programme.requirements.length > 0) {
        result.conditional.push({
          ...programmeEntry,
          missing: missingSubjects,
        });
      } else if (missingSubjects.length > 0) {
        result.notEligible.push({
          ...programmeEntry,
          missing: missingSubjects,
        });
      }
    }

    // Sort: programmes with fewer missing requirements first for notEligible
    result.notEligible.sort((a, b) => a.missing.length - b.missing.length);
    result.conditional.sort((a, b) => a.missing.length - b.missing.length);

    return result;
  }

  // ===== Helpers =====

  private async findProgrammesBySubjects(subjects: string[]): Promise<any[]> {
    const subjectRecords = await this.prisma.subject.findMany({
      where: { name: { in: subjects, mode: 'insensitive' } },
    });

    if (subjectRecords.length === 0) return [];

    const subjectIds = subjectRecords.map((s) => s.id);

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
      take: 12,
    });

    return programmes;
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
