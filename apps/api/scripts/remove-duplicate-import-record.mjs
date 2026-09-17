import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

try {
  const duplicates = await prisma.programme.findMany({
    where: {
      sourceCode: 'MACC',
      department: { academicUnit: { abbreviation: 'NAHPI' } },
    },
    orderBy: { code: 'asc' },
  });
  if (duplicates.length === 2 && duplicates[0].name === duplicates[1].name && duplicates[0].duration === duplicates[1].duration) {
    await prisma.programme.delete({ where: { id: duplicates[1].id } });
    console.log(`Removed duplicate import record ${duplicates[1].code}; retained ${duplicates[0].code}.`);
  } else {
    console.log(`No exact duplicate to remove (found ${duplicates.length} NAHPI records with source code MACC).`);
  }
} finally {
  await prisma.$disconnect();
}
