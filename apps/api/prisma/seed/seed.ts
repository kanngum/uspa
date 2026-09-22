import "dotenv/config";
import {
  PrismaClient,
  ProgrammeLevel,
  SubjectLevel,
  UserRole,
} from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as bcrypt from "bcrypt";
import {
  university,
  academicUnits,
  oLevelSubjects,
  aLevelSubjects,
  programmes,
  generalAdmissionRules,
  commonKeywords,
} from "./data";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding USPA database...\n");

  // 1. Create University
  console.log("📚 Creating University...");

  const uba = await prisma.university.upsert({
    where: {
      abbreviation: university.abbreviation,
    },
    update: {},
    create: university,
  });

  console.log(`   ✅ ${uba.name} (${uba.abbreviation}) ready\n`);

  // 2. Create Academic Unit Types
  console.log("🏛️  Creating Academic Unit Types...");

  const academicUnitTypes = [
    {
      name: "Faculty",
      code: "FACULTY",
      description: "Faculty-level academic unit",
    },
    {
      name: "School",
      code: "SCHOOL",
      description: "School-level academic unit",
    },
  ];

  const academicUnitTypeRecords: Record<string, string> = {};

  for (const unitType of academicUnitTypes) {
    const record = await prisma.academicUnitType.upsert({
      where: {
        code: unitType.code,
      },
      update: {
        name: unitType.name,
        description: unitType.description,
        isActive: true,
      },
      create: {
        name: unitType.name,
        code: unitType.code,
        description: unitType.description,
        isActive: true,
      },
    });

    academicUnitTypeRecords[unitType.code] = record.id;
  }

  console.log(
    `   ✅ ${academicUnitTypes.length} academic unit types ready\n`,
  );

  // 3. Create Degree Types
  console.log("🎓 Creating Degree Types...");

  const degreeTypes = [
    {
      name: "Bachelor of Science",
      code: "BSC",
      description: "Bachelor of Science",
    },
    {
      name: "Bachelor of Arts",
      code: "BA",
      description: "Bachelor of Arts",
    },
    {
      name: "Bachelor of Engineering",
      code: "BENG",
      description: "Bachelor of Engineering",
    },
    {
      name: "Bachelor of Education",
      code: "BED",
      description: "Bachelor of Education",
    },
    {
      name: "Bachelor of Laws",
      code: "LLB",
      description: "Bachelor of Laws",
    },
    {
      name: "Bachelor of Medicine and Bachelor of Surgery",
      code: "MBBS",
      description: "Bachelor of Medicine and Bachelor of Surgery",
    },
    {
      name: "Higher National Diploma",
      code: "HND",
      description: "Higher National Diploma",
    },
    {
      name: "Diploma",
      code: "DIPLOMA",
      description: "Diploma",
    },
    {
      name: "Postgraduate Diploma",
      code: "PGD",
      description: "Postgraduate Diploma",
    },
    {
      name: "Master of Science",
      code: "MSC",
      description: "Master of Science",
    },
    {
      name: "Master of Arts",
      code: "MA",
      description: "Master of Arts",
    },
    {
      name: "Master of Engineering",
      code: "MENG",
      description: "Master of Engineering",
    },
    {
      name: "Doctor of Philosophy",
      code: "PHD",
      description: "Doctor of Philosophy",
    },
    {
      name: "Certificate",
      code: "CERTIFICATE",
      description: "Certificate",
    },
    {
      name: "Bachelor of Technology",
      code: "BTECH",
      description: "Bachelor of Technology",
    },
    {
      name: "HPD",
      code: "HPD",
      description: "HPD",
    },
  ];

  const degreeTypeRecords: Record<string, string> = {};

  for (const degreeType of degreeTypes) {
    const record = await prisma.degreeType.upsert({
      where: {
        code: degreeType.code,
      },
      update: {
        name: degreeType.name,
        description: degreeType.description,
        isActive: true,
      },
      create: {
        name: degreeType.name,
        code: degreeType.code,
        description: degreeType.description,
        isActive: true,
      },
    });

    degreeTypeRecords[degreeType.code] = record.id;
  }

  console.log(`   ✅ ${degreeTypes.length} degree types ready\n`);

  // 4. Create O Level Subjects
  console.log("📝 Creating O Level Subjects...");

  const oLevelSubjectRecords: Record<string, string> = {};

  for (const name of oLevelSubjects) {
    const subject = await prisma.subject.upsert({
      where: {
        name,
      },
      update: {
        level: SubjectLevel.O_LEVEL,
      },
      create: {
        name,
        level: SubjectLevel.O_LEVEL,
      },
    });

    oLevelSubjectRecords[name] = subject.id;
  }

  console.log(`   ✅ ${oLevelSubjects.length} O Level subjects ready`);

  // 5. Create A Level Subjects
  console.log("📝 Creating A Level Subjects...");

  const aLevelSubjectRecords: Record<string, string> = {};

  for (const name of aLevelSubjects) {
    const subject = await prisma.subject.upsert({
      where: {
        name,
      },
      update: {
        level: SubjectLevel.A_LEVEL,
      },
      create: {
        name,
        level: SubjectLevel.A_LEVEL,
      },
    });

    aLevelSubjectRecords[name] = subject.id;
  }

  console.log(`   ✅ ${aLevelSubjects.length} A Level subjects ready\n`);

  // 6. Create Academic Units and Departments
  console.log("🏛️  Creating Academic Units and Departments...");

  const facultyRecords: Record<string, string> = {};

  const departmentRecords: {
    facultyName: string;
    deptName: string;
    id: string;
  }[] = [];

  for (const unit of academicUnits) {
    const typeId = academicUnitTypeRecords[unit.type];

    if (!typeId) {
      console.warn(
        `   ⚠️ Academic Unit Type not found for ${unit.name}: ${unit.type}`,
      );
      continue;
    }

    const faculty = await prisma.academicUnit.upsert({
      where: {
        universityId_name: {
          universityId: uba.id,
          name: unit.name,
        },
      },
      update: {
        abbreviation: unit.abbreviation,
        typeId,
        description: unit.description,
      },
      create: {
        universityId: uba.id,
        name: unit.name,
        abbreviation: unit.abbreviation,
        typeId,
        description: unit.description,
      },
    });

    facultyRecords[unit.abbreviation!] = faculty.id;

    for (const dept of unit.departments) {
      const department = await prisma.department.upsert({
        where: {
          academicUnitId_name: {
            academicUnitId: faculty.id,
            name: dept.name,
          },
        },
        update: {
          abbreviation: dept.abbreviation,
          description: dept.description,
        },
        create: {
          academicUnitId: faculty.id,
          name: dept.name,
          abbreviation: dept.abbreviation,
          description: dept.description,
        },
      });

      departmentRecords.push({
        facultyName: unit.abbreviation!,
        deptName: dept.name,
        id: department.id,
      });
    }

    console.log(`   ✅ ${unit.name}`);
  }

  console.log(
    `   Total: ${academicUnits.length} units with ${departmentRecords.length} departments\n`,
  );

  // 7. Create Careers
  console.log("💼 Creating Careers...");

  const allCareers = [
    ...new Set(programmes.flatMap((p) => p.careers)),
  ];

  const careerRecords: Record<string, string> = {};

  for (const careerName of allCareers) {
    const career = await prisma.career.upsert({
      where: {
        name: careerName,
      },
      update: {},
      create: {
        name: careerName,
      },
    });

    careerRecords[careerName] = career.id;
  }

  console.log(`   ✅ ${allCareers.length} careers ready`);

  // 8. Create Keywords
  console.log("🔑 Creating Keywords...");

  const allKeywords = [
    ...new Set([
      ...commonKeywords,
      ...programmes.flatMap((p) => p.keywords),
    ]),
  ];

  const keywordRecords: Record<string, string> = {};

  for (const word of allKeywords) {
    const keywordValue = word.toLowerCase();

    const keyword = await prisma.keyword.upsert({
      where: {
        word: keywordValue,
      },
      update: {},
      create: {
        word: keywordValue,
      },
    });

    keywordRecords[keywordValue] = keyword.id;
  }

  console.log(`   ✅ ${allKeywords.length} keywords ready\n`);

  // 9. Create Programmes with Requirements, Careers, Keywords, and Tuition
  console.log("🎓 Creating Programmes...");

  for (const prog of programmes) {
    const { facultyIdx, deptIdx } = prog.departmentIndex;

    const deptInfo = departmentRecords.find(
      (d) =>
        d.facultyName ===
          academicUnits[facultyIdx]!.abbreviation &&
        d.deptName ===
          academicUnits[facultyIdx]!.departments[deptIdx]!.name,
    );

    if (!deptInfo) {
      console.warn(
        `   ⚠️ Department not found for programme: ${prog.name}`,
      );
      continue;
    }

    const degreeId = degreeTypeRecords[prog.degree];

    if (!degreeId) {
      console.warn(
        `   ⚠️ Degree Type not found for programme: ${prog.name} (${prog.degree})`,
      );
      continue;
    }

    const programme = await prisma.programme.upsert({
      where: {
        code: prog.code,
      },
      update: {
        departmentId: deptInfo.id,
        name: prog.name,
        degreeId,
        level: prog.level as ProgrammeLevel,
        duration: prog.duration,
        description: prog.description,
      },
      create: {
        departmentId: deptInfo.id,
        code: prog.code,
        name: prog.name,
        degreeId,
        level: prog.level as ProgrammeLevel,
        duration: prog.duration,
        description: prog.description,
      },
    });

    // Create Programme Requirements (O Level)
    for (const subjectName of prog.requirements.oLevel) {
      const subjectId = oLevelSubjectRecords[subjectName];

      if (subjectId) {
        await prisma.programmeRequirement.upsert({
          where: {
            programmeId_subjectId: {
              programmeId: programme.id,
              subjectId,
            },
          },
          update: {
            requirementType: "REQUIRED",
            minimumGrade: prog.requirements.minGrades.oLevel,
          },
          create: {
            programmeId: programme.id,
            subjectId,
            requirementType: "REQUIRED",
            minimumGrade: prog.requirements.minGrades.oLevel,
          },
        });
      }
    }

    // Create Programme Requirements (A Level)
    for (const subjectName of prog.requirements.aLevel) {
      const subjectId = aLevelSubjectRecords[subjectName];

      if (subjectId) {
        await prisma.programmeRequirement.upsert({
          where: {
            programmeId_subjectId: {
              programmeId: programme.id,
              subjectId,
            },
          },
          update: {
            requirementType: "REQUIRED",
            minimumGrade: prog.requirements.minGrades.aLevel,
          },
          create: {
            programmeId: programme.id,
            subjectId,
            requirementType: "REQUIRED",
            minimumGrade: prog.requirements.minGrades.aLevel,
          },
        });
      }
    }

    // Link Careers
    for (const careerName of prog.careers) {
      const careerId = careerRecords[careerName];

      if (careerId) {
        await prisma.programmeCareer
          .create({
            data: {
              programmeId: programme.id,
              careerId,
            },
          })
          .catch(() => {
            // Skip if already exists
          });
      }
    }

    // Link Keywords
    for (const keyword of prog.keywords) {
      const keywordId =
        keywordRecords[keyword.toLowerCase()];

      if (keywordId) {
        await prisma.programmeKeyword
          .create({
            data: {
              programmeId: programme.id,
              keywordId,
            },
          })
          .catch(() => {
            // Skip if already exists
          });
      }
    }

    // Create Tuition
    await prisma.tuition.upsert({
      where: {
        programmeId_academicYear: {
          programmeId: programme.id,
          academicYear: "2024/2025",
        },
      },
      update: {
        amount: prog.tuition,
        currency: "XAF",
      },
      create: {
        programmeId: programme.id,
        academicYear: "2024/2025",
        amount: prog.tuition,
        currency: "XAF",
      },
    });

    console.log(
      `   ✅ ${prog.code} - ${prog.name}`,
    );
  }

  console.log(
    `\n   Total: ${programmes.length} programmes created with requirements, careers, and keywords\n`,
  );

  // 10. Create General Admission Rules
  console.log("📋 Creating General Admission Rules...");

  for (const rule of generalAdmissionRules) {
    const existingRule =
      await prisma.generalAdmissionRule.findFirst({
        where: {
          title: rule.title,
        },
      });

    if (!existingRule) {
      await prisma.generalAdmissionRule.create({
        data: rule,
      });
    }
  }

  console.log(
    `   ✅ ${generalAdmissionRules.length} general admission rules seeded\n`,
  );

  // 11. Create Admin User
  console.log("👤 Creating Admin User...");

  const passwordHash = await bcrypt.hash(
    "kan2026",
    10,
  );

  const adminUser = await prisma.user.upsert({
    where: {
      email: "ngumkan@gmail.com",
    },
    update: {
      firstName: "Admin",
      lastName: "User",
      passwordHash,
      role: UserRole.ADMIN,
      isActive: true,
    },
    create: {
      firstName: "Admin",
      lastName: "User",
      email: "ngumkan@gmail.com",
      passwordHash,
      role: UserRole.ADMIN,
      isActive: true,
    },
  });

  console.log(
    `   ✅ Admin user ready: ${adminUser.email} (password: kan2026)\n`,
  );

  console.log(
    "✅✅✅ Database seeding completed successfully! ✅✅✅",
  );
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });