import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
try {
  const [programmes, reviewQueue, tuitionByPeriod, rulesByCategory] = await Promise.all([
    prisma.programme.groupBy({ by: ['applicationStatus'], _count: true }),
    prisma.programme.findMany({ where: { needsReview: true }, select: { code: true, sourceCode: true, name: true, reviewNotes: true }, take: 50, orderBy: { name: 'asc' } }),
    prisma.tuition.groupBy({ by: ['feePeriod'], _count: true }),
    prisma.programmeAdmissionRule.groupBy({ by: ['category'], _count: true }),
  ]);
  console.log(JSON.stringify({ programmes, reviewQueue, tuitionByPeriod, rulesByCategory }, null, 2));
} finally {
  await prisma.$disconnect();
}
