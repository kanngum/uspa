import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

try {
  const [
    total,
    programmes,
    reviewQueue,
    missingFee,
    missingDeadline,
    missingRequirements,
    missingCareers,
    missingKeywords,
    tuitionByPeriod,
    rulesByCategory,
    allProgrammes,
  ] = await Promise.all([
    prisma.programme.count(),
    prisma.programme.groupBy({ by: ['applicationStatus'], _count: true }),
    prisma.programme.findMany({
      where: {
        OR: [
          { needsReview: true },
          { applicationDeadline: null },
          { tuition: { none: {} } },
          { requirements: { none: {} } },
          { careers: { none: {} } },
          { keywords: { none: {} } },
        ],
      },
      include: {
        degree: { select: { name: true, code: true } },
        department: {
          include: {
            academicUnit: {
              select: { name: true, abbreviation: true },
            },
          },
        },
        tuition: {
          orderBy: { academicYear: 'desc' },
          take: 1,
        },
      },
      take: 25,
      orderBy: { name: 'asc' },
    }),
    prisma.programme.count({ where: { tuition: { none: {} } } }),
    prisma.programme.count({ where: { applicationDeadline: null } }),
    prisma.programme.count({ where: { requirements: { none: {} } } }),
    prisma.programme.count({ where: { careers: { none: {} } } }),
    prisma.programme.count({ where: { keywords: { none: {} } } }),
    prisma.tuition.groupBy({ by: ['feePeriod'], _count: true }),
    prisma.programmeAdmissionRule.groupBy({ by: ['category'], _count: true }),
    prisma.programme.findMany({
      include: {
        department: {
          include: {
            academicUnit: {
              select: { name: true, abbreviation: true },
            },
          },
        },
        tuition: { orderBy: { academicYear: 'desc' }, take: 1 },
        requirements: { take: 1 },
        careers: { take: 1 },
        keywords: { take: 1 },
      },
    }),
  ]);

  const missingByAcademicUnit = Object.values(
    allProgrammes.reduce((acc, item) => {
      const unitName = item.department?.academicUnit?.name ?? 'Unknown';
      const bucket = acc[unitName] ?? {
        unit: unitName,
        total: 0,
        missingFee: 0,
        missingDeadline: 0,
        missingRequirements: 0,
        missingCareers: 0,
        missingKeywords: 0,
      };

      bucket.total += 1;
      if (!item.tuition.length) bucket.missingFee += 1;
      if (!item.applicationDeadline) bucket.missingDeadline += 1;
      if (!item.requirements.length) bucket.missingRequirements += 1;
      if (!item.careers.length) bucket.missingCareers += 1;
      if (!item.keywords.length) bucket.missingKeywords += 1;

      acc[unitName] = bucket;
      return acc;
    }, {}),
  ).sort((a, b) => b.missingRequirements - a.missingRequirements || b.total - a.total);

  console.log(JSON.stringify({
    total,
    programmes,
    needsReview: reviewQueue.length,
    missingFee,
    missingDeadline,
    missingRequirements,
    missingCareers,
    missingKeywords,
    reviewQueue,
    missingByAcademicUnit,
    tuitionByPeriod,
    rulesByCategory,
  }, null, 2));
} finally {
  await prisma.$disconnect();
}
