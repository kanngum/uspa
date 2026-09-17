import "dotenv/config";
import { PrismaClient, DegreeType, ProgrammeLevel, SubjectLevel, UserRole } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import {
  university,
  academicUnits,
  oLevelSubjects,
  aLevelSubjects,
  programmes,
  generalAdmissionRules,
  commonKeywords,
} from './data';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding USPA database...\n');

  // 1. Create University
  console.log('📚 Creating University...');
  const uba = await prisma.university.upsert({
    where: { abbreviation: university.abbreviation },
    update: {},
    create: university,
  });
  console.log(`   ✅ ${uba.name} (${uba.abbreviation}) ready\n`);

  // 2. Create O Level Subjects
  console.log('📝 Creating O Level Subjects...');
  const oLevelSubjectRecords: Record<string, string> = {};
  for (const name of oLevelSubjects) {
    const subject = await prisma.subject.upsert({
      where: { name },
      update: { level: SubjectLevel.O_LEVEL },
      create: { name, level: SubjectLevel.O_LEVEL },
    });
    oLevelSubjectRecords[name] = subject.id;
  }
  console.log(`   ✅ ${oLevelSubjects.length} O Level subjects ready`);

  // 3. Create A Level Subjects
  console.log('📝 Creating A Level Subjects...');
  const aLevelSubjectRecords: Record<string, string> = {};
  for (const name of aLevelSubjects) {
    const subject = await prisma.subject.upsert({
      where: { name },
      update: { level: SubjectLevel.A_LEVEL },
      create: { name, level: SubjectLevel.A_LEVEL },
    });
    aLevelSubjectRecords[name] = subject.id;
  }
  console.log(`   ✅ ${aLevelSubjects.length} A Level subjects ready\n`);

  // 4. Create Academic Units (Faculties/Schools) and Departments
  console.log('🏛️  Creating Faculties and Departments...');
  const facultyRecords: Record<string, string> = {};
  const departmentRecords: { facultyName: string; deptName: string; id: string }[] = [];

  for (const unit of academicUnits) {
    const faculty = await prisma.academicUnit.upsert({
      where: {
        universityId_name: {
          universityId: uba.id,
          name: unit.name,
        },
      },
      update: {
        abbreviation: unit.abbreviation,
        type: unit.type,
        description: unit.description,
      },
      create: {
        universityId: uba.id,
        name: unit.name,
        abbreviation: unit.abbreviation,
        type: unit.type,
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
  console.log(`   Total: ${academicUnits.length} units with ${departmentRecords.length} departments\n`);

  // 5. Create Careers
  console.log('💼 Creating Careers...');
  const allCareers = [...new Set(programmes.flatMap((p) => p.careers))];
  const careerRecords: Record<string, string> = {};
  for (const careerName of allCareers) {
    const career = await prisma.career.upsert({
      where: { name: careerName },
      update: {},
      create: { name: careerName },
    });
    careerRecords[careerName] = career.id;
  }
  console.log(`   ✅ ${allCareers.length} careers ready`);

  // 6. Create Keywords (common + programme-specific)
  console.log('🔑 Creating Keywords...');
  const allKeywords = [
    ...new Set([...commonKeywords, ...programmes.flatMap((p) => p.keywords)]),
  ];
  const keywordRecords: Record<string, string> = {};
  for (const word of allKeywords) {
    const keywordValue = word.toLowerCase();
    const keyword = await prisma.keyword.upsert({
      where: { word: keywordValue },
      update: {},
      create: { word: keywordValue },
    });
    keywordRecords[keywordValue] = keyword.id;
  }
  console.log(`   ✅ ${allKeywords.length} keywords ready\n`);

  // 7. Create Programmes with Requirements, Careers, Keywords, and Tuition
  console.log('🎓 Creating Programmes...');
  for (const prog of programmes) {
    const { facultyIdx, deptIdx } = prog.departmentIndex;
    const deptInfo = departmentRecords.find(
      (d) =>
        d.facultyName === academicUnits[facultyIdx]!.abbreviation &&
        d.deptName === academicUnits[facultyIdx]!.departments[deptIdx]!.name
    );

    if (!deptInfo) {
      console.warn(`   ⚠️ Department not found for programme: ${prog.name}`);
      continue;
    }

    const programme = await prisma.programme.upsert({
      where: { code: prog.code },
      update: {
        departmentId: deptInfo.id,
        name: prog.name,
        degree: prog.degree as DegreeType,
        level: prog.level as ProgrammeLevel,
        duration: prog.duration,
        description: prog.description,
      },
      create: {
        departmentId: deptInfo.id,
        code: prog.code,
        name: prog.name,
        degree: prog.degree as DegreeType,
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
            requirementType: 'REQUIRED',
            minimumGrade: prog.requirements.minGrades.oLevel,
          },
          create: {
            programmeId: programme.id,
            subjectId,
            requirementType: 'REQUIRED',
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
            requirementType: 'REQUIRED',
            minimumGrade: prog.requirements.minGrades.aLevel,
          },
          create: {
            programmeId: programme.id,
            subjectId,
            requirementType: 'REQUIRED',
            minimumGrade: prog.requirements.minGrades.aLevel,
          },
        });
      }
    }

    // Link Careers
    for (const careerName of prog.careers) {
      const careerId = careerRecords[careerName];
      if (careerId) {
        await prisma.programmeCareer.create({
          data: {
            programmeId: programme.id,
            careerId,
          },
        }).catch(() => {
          // Skip if already exists
        });
      }
    }

    // Link Keywords via ProgrammeKeyword
    for (const keyword of prog.keywords) {
      const keywordId = keywordRecords[keyword.toLowerCase()];
      if (keywordId) {
        await prisma.programmeKeyword.create({
          data: {
            programmeId: programme.id,
            keywordId,
          },
        }).catch(() => {
          // Skip if already exists
        });
      }
    }

    // Create Tuition
    await prisma.tuition.upsert({
      where: {
        programmeId_academicYear: {
          programmeId: programme.id,
          academicYear: '2024/2025',
        },
      },
      update: {
        amount: prog.tuition,
        currency: 'XAF',
      },
      create: {
        programmeId: programme.id,
        academicYear: '2024/2025',
        amount: prog.tuition,
        currency: 'XAF',
      },
    });

    console.log(`   ✅ ${prog.code} - ${prog.name}`);
  }

  console.log(`\n   Total: ${programmes.length} programmes created with requirements, careers, and keywords\n`);

  // 8. Create General Admission Rules
  console.log('📋 Creating General Admission Rules...');
  for (const rule of generalAdmissionRules) {
    const existingRule = await prisma.generalAdmissionRule.findFirst({
      where: { title: rule.title },
    });
    if (!existingRule) {
      await prisma.generalAdmissionRule.create({
        data: rule,
      });
    }
  }
  console.log(`   ✅ ${generalAdmissionRules.length} general admission rules seeded\n`);

  // 9. Create Admin User
  console.log('👤 Creating Admin User...');
  const passwordHash = await bcrypt.hash('kan2026', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'ngumkan@gmail.com' },
    update: {
      firstName: 'Admin',
      lastName: 'User',
      passwordHash,
      role: UserRole.ADMIN,
      isActive: true,
    },
    create: {
      firstName: 'Admin',
      lastName: 'User',
      email: 'ngumkan@gmail.com',
      passwordHash,
      role: UserRole.ADMIN,
      isActive: true,
    },
  });
  console.log(`   ✅ Admin user ready: ${adminUser.email} (password: kan2026)\n`);

  console.log('✅✅✅ Database seeding completed successfully! ✅✅✅');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

