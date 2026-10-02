import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const total = await prisma.programme.count();

  const [
    degree,
    requirements,
    tuition,
    admissionRules,
    careers,
    keywords,
  ] = await Promise.all([
    prisma.programme.count({
      where: { degree: { isNot: undefined } },
    }),
    prisma.programme.count({
      where: { requirements: { some: {} } },
    }),
    prisma.programme.count({
      where: { tuition: { some: {} } },
    }),
    prisma.programme.count({
      where: { admissionRules: { some: {} } },
    }),
    prisma.programme.count({
      where: { careers: { some: {} } },
    }),
    prisma.programme.count({
      where: { keywords: { some: {} } },
    }),
  ]);

  const pct = (n: number) =>
    total ? `${((n / total) * 100).toFixed(1)}%` : "0%";

  console.log("\nUSPA PROGRAMME DATA AUDIT");
  console.log("=========================\n");

  console.log(`Programmes:          ${total}`);
  console.log(`Degree:              ${degree}/${total} (${pct(degree)})`);
  console.log(`Requirements:        ${requirements}/${total} (${pct(requirements)})`);
  console.log(`Tuition:             ${tuition}/${total} (${pct(tuition)})`);
  console.log(`Admission Rules:     ${admissionRules}/${total} (${pct(admissionRules)})`);
  console.log(`Careers:             ${careers}/${total} (${pct(careers)})`);
  console.log(`Keywords:            ${keywords}/${total} (${pct(keywords)})`);

  console.log("\nMISSING");
  console.log("-------");
  console.log(`Degree:              ${total - degree}`);
  console.log(`Requirements:        ${total - requirements}`);
  console.log(`Tuition:             ${total - tuition}`);
  console.log(`Admission Rules:     ${total - admissionRules}`);
  console.log(`Careers:             ${total - careers}`);
  console.log(`Keywords:            ${total - keywords}`);

  console.log("\nAUDIT COMPLETE\n");
}

main()
  .catch((error) => {
    console.error("AUDIT FAILED");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
