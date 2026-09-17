require('dotenv/config');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
(async () => {
  try {
    console.log('universities:', await prisma.university.count());
    console.log('subjects:', await prisma.subject.count());
    console.log('programmes:', await prisma.programme.count());
    console.log('users:', await prisma.user.count());
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
