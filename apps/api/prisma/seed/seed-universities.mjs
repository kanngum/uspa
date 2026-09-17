import "dotenv/config";
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const universities = [
  { name: "University of Bamenda", abbreviation: "UBa", description: "The second major English-language state university, featuring prominent teacher training, polytechnic, and transport/logistics institutes in Bambili." },
  { name: "École nationale supérieure polytechnique de Bamenda", abbreviation: "ENSPB", description: "National Advanced School of Engineering focused on polytechnic and engineering education." },
  { name: "University of Yaoundé I", abbreviation: "UYI", description: "The mother of state universities in Cameroon, focusing heavily on human sciences, medicine, engineering, and core scientific research." },
  { name: "University of Yaoundé II", abbreviation: "UYII", description: "Specialized in law, political science, economics, and management, located just outside the capital in Soa." },
  { name: "University of Buea", abbreviation: "UB", description: "The premier Anglo-Saxon style university situated on the slopes of Mount Cameroon, operating entirely in the English educational tradition." },
  { name: "University of Douala", abbreviation: "UD", description: "Highly commercial and professionalized campus hosting renowned institutions like ESSEC for business and ENSET for technical teacher training." },
  { name: "University of Dschang", abbreviation: "UDs", description: "Spread across multiple regional campuses with an agricultural, environmental, and veterinary vocation at its core." },
  { name: "University of Ngaoundéré", abbreviation: "UN", description: "Serves the northern regions with a unique academic strength in food engineering, technology, and industry-oriented sciences." },
  { name: "University of Maroua", abbreviation: "UM", description: "Located in the Far North, strongly recognized for specialized climate, textile, and teacher training institutions." },
  { name: "University of Bertoua", abbreviation: "UBT", description: "A newer public university institution established in 2022 to expand professional programs and schools in the East region." },
  { name: "Université des Montagnes", abbreviation: "UDM", description: "A private, non-profit university in Bangangté widely respected for its competitive medical, pharmaceutical, and engineering schools." },
  { name: "Catholic University of Central Africa", abbreviation: "UCAC", description: "A regional sub-Saharan Catholic institution based in Yaoundé offering competitive degrees in social sciences, management, and theology." },
  { name: "Protestant University of Central Africa", abbreviation: "UPAC", description: "A confession-based university in Yaoundé focused on theology, information sciences, and social development studies." },
  { name: "Catholic University of Cameroon", abbreviation: "CATUC", description: "Located in Bamenda, providing robust options in engineering, humanities, and business from a values-driven approach." },
];

const sampleProgrammes = [
  { abbreviation: "ENSPB", code: "ENSPB-CE-01", name: "Computer Engineering", degree: "BENG", level: "UNDERGRADUATE", duration: 5, description: "A comprehensive computer engineering programme covering hardware and software systems." },
  { abbreviation: "UYI", code: "UYI-MED-01", name: "General Medicine (MBBS)", degree: "MBBS", level: "UNDERGRADUATE", duration: 7, description: "Professional medical training programme at the Faculty of Medicine and Biomedical Sciences." },
  { abbreviation: "UYII", code: "UYII-LAW-01", name: "Bachelor of Laws (LLB)", degree: "LLB", level: "UNDERGRADUATE", duration: 4, description: "Comprehensive law programme covering Cameroonian and common law systems." },
  { abbreviation: "UB", code: "UB-CS-01", name: "Computer Science", degree: "BSC", level: "UNDERGRADUATE", duration: 3, description: "Study of computational systems, programming, and software development." },
  { abbreviation: "UD", code: "UD-BBA-01", name: "Bachelor of Business Administration", degree: "BSC", level: "UNDERGRADUATE", duration: 3, description: "Business administration programme offered at ESSEC Douala." },
  { abbreviation: "UDs", code: "UDS-AGR-01", name: "Agricultural Engineering", degree: "BENG", level: "UNDERGRADUATE", duration: 5, description: "Agricultural engineering programme focusing on sustainable farming and food production." },
  { abbreviation: "UN", code: "UN-FEN-01", name: "Food Engineering and Technology", degree: "BENG", level: "UNDERGRADUATE", duration: 5, description: "Specialized programme in food processing, preservation, and quality control." },
  { abbreviation: "UM", code: "UM-TEX-01", name: "Textile and Fashion Design", degree: "BSC", level: "UNDERGRADUATE", duration: 3, description: "Programme focused on textile engineering, fashion design, and clothing technology." },
  { abbreviation: "UBT", code: "UBT-BUS-01", name: "Business Management", degree: "BSC", level: "UNDERGRADUATE", duration: 3, description: "Modern business management programme covering entrepreneurship and leadership." },
  { abbreviation: "UDM", code: "UDM-PHA-01", name: "Pharmacy", degree: "BSC", level: "UNDERGRADUATE", duration: 5, description: "Pharmaceutical sciences programme with clinical and industrial pharmacy training." },
  { abbreviation: "UCAC", code: "UCAC-THE-01", name: "Theology and Religious Studies", degree: "BA", level: "UNDERGRADUATE", duration: 3, description: "Study of theology, philosophy, and religious traditions in the Catholic tradition." },
  { abbreviation: "UPAC", code: "UPAC-INF-01", name: "Information Sciences and Communication", degree: "BA", level: "UNDERGRADUATE", duration: 3, description: "Programme covering library science, documentation, and digital information management." },
  { abbreviation: "CATUC", code: "CATUC-ENG-01", name: "Civil Engineering", degree: "BENG", level: "UNDERGRADUATE", duration: 5, description: "Civil engineering programme focusing on structural design, construction, and infrastructure." },
];

async function main() {
  console.log("🌱 Seeding universities and sample programmes...\n");

  // 1. Create all universities
  console.log("📚 Creating Universities...");
  const uniRecords = {};
  for (const uni of universities) {
    const record = await prisma.university.upsert({
      where: { abbreviation: uni.abbreviation },
      update: { description: uni.description },
      create: uni,
    });
    uniRecords[uni.abbreviation] = record;
    console.log(`   ✅ ${record.name} (${record.abbreviation})`);
  }
  console.log(`\n   Total: ${Object.keys(uniRecords).length} universities\n`);

  // 2. Get an existing department (use UBa's first department as default)
  const firstDept = await prisma.department.findFirst();
  if (!firstDept) {
    console.log("   ⚠️ No departments found in database. Skipping sample programmes.");
    console.log("\n✅✅✅ Universities seeded successfully! ✅✅✅");
    return;
  }

  // 3. Create sample programmes for non-UBa universities
  console.log("🎓 Creating Sample Programmes...");
  let progCount = 0;
  for (const prog of sampleProgrammes) {
    try {
      await prisma.programme.upsert({
        where: { code: prog.code },
        update: {
          name: prog.name,
          degree: prog.degree,
          level: prog.level,
          duration: prog.duration,
          description: prog.description,
        },
        create: {
          departmentId: firstDept.id,
          code: prog.code,
          name: prog.name,
          degree: prog.degree,
          level: prog.level,
          duration: prog.duration,
          description: prog.description,
        },
      });
      console.log(`   ✅ ${prog.code} - ${prog.name} (${prog.abbreviation})`);
      progCount++;
    } catch (err) {
      console.log(`   ⚠️ Could not create ${prog.code}: ${err.message}`);
    }
  }
  console.log(`\n   Total: ${progCount} sample programmes created\n`);

  console.log("✅✅✅ Seeding completed successfully! ✅✅✅");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

