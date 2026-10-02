import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  }),
});

const stopWords = new Set([
  'a','about','above','across','after','again','against','all','also','an','and','any','are','as','at','b','be','because','been','before','being','below','between','both','but','by','can','could','degree','diploma','education','engineering','faculty','for','from','general','higher','hnd','hpd','in','including','into','its','itself','just','management','of','on','or','our','out','over','programme','program','school','science','should','so','some','such','tech','technology','than','that','the','their','them','then','there','these','they','this','those','through','to','under','undergraduate','up','very','was','we','were','what','when','where','which','while','with','without','year','years','bachelor','master','certificate','diploma','national','professional','study','studies','student','students'
]);

const careerMap = [
  { regex: /engineering|engineer/i, name: 'Engineer' },
  { regex: /accounting|finance|banking/i, name: 'Accountant' },
  { regex: /business|administration|management/i, name: 'Business Manager' },
  { regex: /marketing|commerce/i, name: 'Marketing Specialist' },
  { regex: /education|teaching|teacher/i, name: 'Teacher' },
  { regex: /computer|software|it|data|cyber/i, name: 'IT Professional' },
  { regex: /law|legal|political/i, name: 'Legal Practitioner' },
  { regex: /agricult|farm|food/i, name: 'Agricultural Professional' },
  { regex: /health|nursing|medical|lab|pharmacy/i, name: 'Healthcare Professional' },
  { regex: /logistics|supply|transport/i, name: 'Logistics Manager' },
  { regex: /tourism|hotel|hospitality/i, name: 'Hospitality Manager' },
  { regex: /environment|ecology|climate/i, name: 'Environmental Specialist' },
  { regex: /economics|economy|development/i, name: 'Economist' },
  { regex: /media|communication|journal/i, name: 'Communication Specialist' },
  { regex: /security|risk|insurance/i, name: 'Security Professional' },
  { regex: /architecture|design/i, name: 'Designer' },
];

function normalizeText(value = '') {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function inferKeywords(name, description = '', entryRequirements = '') {
  const source = normalizeText(`${name} ${description} ${entryRequirements}`);
  if (!source) return [];

  const tokens = source.split(/\s+/).filter((token) => {
    if (token.length <= 3) return false;
    if (stopWords.has(token)) return false;
    return true;
  });

  const inferred = new Set();
  for (const token of tokens) {
    inferred.add(token);
  }

  for (const { regex, name: careerName } of careerMap) {
    if (regex.test(`${name} ${description} ${entryRequirements}`)) {
      inferred.add(careerName.toLowerCase());
    }
  }

  const fallback = source
    .split(/\s+/)
    .filter((token) => token.length > 4 && !stopWords.has(token));

  for (const token of fallback) {
    inferred.add(token);
  }

  return [...inferred].slice(0, 8);
}

function inferCareers(name, description = '', entryRequirements = '') {
  const source = `${name} ${description} ${entryRequirements}`;
  const results = new Set();

  for (const { regex, name: careerName } of careerMap) {
    if (regex.test(source)) {
      results.add(careerName);
    }
  }

  if (results.size === 0) {
    const lower = normalizeText(source);
    if (lower.includes('education')) results.add('Teacher');
    if (lower.includes('sales')) results.add('Sales Professional');
    if (lower.includes('computer')) results.add('IT Professional');
    if (lower.includes('environment')) results.add('Environmental Specialist');
  }

  return [...results];
}

async function ensureCareer(name) {
  const safeName = name.trim();
  if (!safeName) return null;

  const career = await prisma.career.upsert({
    where: { name: safeName },
    update: {},
    create: { name: safeName },
  });

  return career;
}

async function ensureKeyword(word) {
  const safeWord = String(word).trim().toLowerCase();
  if (!safeWord) return null;

  const keyword = await prisma.keyword.upsert({
    where: { word: safeWord },
    update: {},
    create: { word: safeWord },
  });

  return keyword;
}

async function main() {
  const programmes = await prisma.programme.findMany({
    where: {
      OR: [
        { careers: { none: {} } },
        { keywords: { none: {} } },
      ],
    },
    select: {
      id: true,
      name: true,
      description: true,
      entryRequirements: true,
      careers: { select: { career: { select: { name: true } } } },
      keywords: { select: { keyword: { select: { word: true } } } },
    },
    take: 200,
  });

  let createdCareers = 0;
  let createdKeywords = 0;
  let linkedCareers = 0;
  let linkedKeywords = 0;

  for (const programme of programmes) {
    const inferredCareers = inferCareers(programme.name, programme.description ?? '', programme.entryRequirements ?? '');
    const inferredKeywords = inferKeywords(programme.name, programme.description ?? '', programme.entryRequirements ?? '');

    const existingCareerNames = new Set(programme.careers.map((item) => item.career.name));
    const existingKeywordWords = new Set(programme.keywords.map((item) => item.keyword.word));

    for (const careerName of inferredCareers) {
      if (existingCareerNames.has(careerName)) continue;

      const career = await ensureCareer(careerName);
      if (!career) continue;

      await prisma.programmeCareer.upsert({
        where: {
          programmeId_careerId: {
            programmeId: programme.id,
            careerId: career.id,
          },
        },
        update: {},
        create: {
          programmeId: programme.id,
          careerId: career.id,
        },
      }).catch(() => undefined);

      createdCareers += 1;
      linkedCareers += 1;
      existingCareerNames.add(careerName);
    }

    for (const keywordValue of inferredKeywords) {
      if (existingKeywordWords.has(keywordValue)) continue;

      const keyword = await ensureKeyword(keywordValue);
      if (!keyword) continue;

      await prisma.programmeKeyword.upsert({
        where: {
          programmeId_keywordId: {
            programmeId: programme.id,
            keywordId: keyword.id,
          },
        },
        update: {},
        create: {
          programmeId: programme.id,
          keywordId: keyword.id,
        },
      }).catch(() => undefined);

      createdKeywords += 1;
      linkedKeywords += 1;
      existingKeywordWords.add(keywordValue);
    }
  }

  const remaining = await prisma.programme.count({
    where: {
      OR: [
        { careers: { none: {} } },
        { keywords: { none: {} } },
      ],
    },
  });

  console.log(JSON.stringify({
    processed: programmes.length,
    createdCareers,
    createdKeywords,
    linkedCareers,
    linkedKeywords,
    remaining,
  }, null, 2));
}

try {
  await main();
} finally {
  await prisma.$disconnect();
}
