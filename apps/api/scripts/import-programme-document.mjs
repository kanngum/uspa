import 'dotenv/config';
import { execFileSync } from 'node:child_process';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const source = process.argv[2] ?? '../../List of faculties and schools.docx';
const xml = execFileSync('tar', ['-xOf', source, 'word/document.xml'], {
  encoding: 'utf8', maxBuffer: 10 * 1024 * 1024,
});
const decode = (value) => value.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>').replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(parseInt(n, 10))).replace(/\s+/g, ' ').trim();
const cellText = (value) => decode([...value.matchAll(/<w:t\b[^>]*>([\s\S]*?)<\/w:t>/g)].map((m) => m[1]).join(''));
const tables = [...xml.matchAll(/<w:tbl\b[^>]*>([\s\S]*?)<\/w:tbl>/g)].map((table) =>
  [...table[1].matchAll(/<w:tr\b[^>]*>([\s\S]*?)<\/w:tr>/g)].map((row) =>
    [...row[1].matchAll(/<w:tc\b[^>]*>([\s\S]*?)<\/w:tc>/g)].map((cell) => cellText(cell[1]))));

const sections = [
  [0, 'College of Technology', 'COLTECH'], [1, 'Faculty of Arts', 'FA'],
  [2, 'Faculty of Economics and Management Sciences', 'FEMS'], [3, 'Faculty of Education', 'FED'],
  [4, 'Faculty of Health Sciences', 'FHS'], [5, 'Faculty of Law and Political Science', 'FLPS'],
  [6, 'Faculty of Science', 'FS'], [7, 'Higher Institute of Commerce and Management', 'HICM'],
  [8, 'Higher Institute of Transport and Logistics', 'HITL'], [10, 'National Higher Polytechnic Institute', 'NAHPI'],
  [9, 'HND/HPD/B.Tech Academic Organ', 'HND-HPD-BTECH'],
];
const allUnits = [
  ...sections.map(([, name, abbreviation]) => ({ name, abbreviation })),
  { name: 'Higher Teachers’ Training College', abbreviation: 'ENS / HTTC' },
  { name: 'Higher Technical Teachers’ Training College', abbreviation: 'ENSET / HTTTC' },
];
const normalize = (value) => value.toLowerCase().replace(/[^a-z0-9]/g, '');
const degree = (value, title) => {
  const source = `${value} ${title}`.toLowerCase();
  if (source.includes('doctor')) return 'PHD';
  if (source.includes('hnd')) return 'HND';
  if (source.includes('hpd')) return 'HPD';
  if (source.includes('b.tech') || source.includes('btech')) return 'BTECH';
  if (source.includes('llb') || source.includes('law')) return 'LLB';
  if (source.includes('b.ed') || source.includes('education')) return 'BED';
  if (source.includes('m.eng')) return 'MENG';
  if (source.includes('m.a') || source.includes('master of arts')) return 'MA';
  if (source.includes('master') || source.includes('msc') || source.includes('mba')) return 'MSC';
  if (source.includes('b.a') || source.includes('arts')) return 'BA';
  return 'BSC';
};
const level = (type) => type === 'PHD' ? 'DOCTORATE' : ['MSC', 'MA', 'MENG', 'PGD'].includes(type) ? 'POSTGRADUATE' : ['HND', 'HPD', 'DIPLOMA', 'CERTIFICATE'].includes(type) ? 'PROFESSIONAL' : 'UNDERGRADUATE';
const parseDuration = (value) => Math.max(1, parseInt(value.match(/\d+/)?.[0] ?? '3', 10));
const parseDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};
const fee = (value) => {
  const match = value.match(/(?:fees?|programme fee)\s*[:;]?\s*([\d\s,]+)/i);
  const amount = match ? Number(match[1].replace(/[\s,]/g, '')) || null : null;
  if (!amount) return null;
  const period = /programme fee/i.test(value) ? 'PROGRAMME_TOTAL'
    : /first year/i.test(value) ? 'FIRST_YEAR'
    : /per (academic )?year|\/year/i.test(value) ? 'ANNUAL'
    : 'UNKNOWN';
  return { amount, period };
};
const rulesFrom = (value) => {
  const rules = [];
  if (/GCE\s*O\/?L|ordinary level|probatoire|BEPC/i.test(value)) rules.push(['O_LEVEL', value]);
  if (/GCE\s*A\/?L|advanced level|baccalaureat/i.test(value)) rules.push(['A_LEVEL', value]);
  if (/competitive entrance|entrance examination/i.test(value)) rules.push(['ENTRANCE_EXAM', value]);
  if (/equivalent|equivalence/i.test(value)) rules.push(['EQUIVALENCY', value]);
  if (/bachelor|b\.?(?:sc|a|tech|ed)|HND|HPD|DIPES|DIPET/i.test(value)) rules.push(['QUALIFICATION', value]);
  return rules;
};

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
const summary = { unitsCreated: 0, programmesCreated: 0, programmesUpdated: 0, tuitionUpdated: 0, codeCollisions: [] };

try {
  const university = await prisma.university.upsert({
    where: { abbreviation: 'UBa' }, update: {},
    create: { name: 'The University of Bamenda', abbreviation: 'UBa' },
  });
  const units = new Map();
  for (const item of allUnits) {
    const type = item.name.startsWith('Faculty') || item.name === 'HND/HPD/B.Tech Academic Organ'
      ? 'FACULTY'
      : 'SCHOOL';
    const found = await prisma.academicUnit.upsert({
      where: { universityId_name: { universityId: university.id, name: item.name } },
      update: { abbreviation: item.abbreviation, type },
      create: { universityId: university.id, name: item.name, abbreviation: item.abbreviation, type },
    });
    units.set(item.abbreviation, found);
  }

  for (const [tableIndex, unitName, unitCode] of sections) {
    const unit = units.get(unitCode);
    const department = await prisma.department.upsert({
      where: { academicUnitId_name: { academicUnitId: unit.id, name: 'Admissions Programme Catalogue' } },
      update: {}, create: { academicUnitId: unit.id, name: 'Admissions Programme Catalogue', abbreviation: 'CAT' },
    });
    const records = tables[tableIndex].slice(1).filter((row) => row.length >= 6);
    for (const row of records) {
      const offset = row[0].match(/^\d+$/) ? 1 : 0;
      const [name, sourceCode, awardType, durationText, entryRequirements, deadline, status = ''] = row.slice(offset);
      if (!name || !sourceCode || sourceCode === '#') continue;
      const duration = parseDuration(durationText);
      const isCrossFacultyCatalogue = unitCode === 'HND-HPD-BTECH';
      const sameUnitRecord = await prisma.programme.findFirst({
        where: { sourceCode, name, duration, department: { academicUnit: { abbreviation: unitCode } } },
        include: { department: { include: { academicUnit: true } } },
      });
      const existing = sameUnitRecord ?? await prisma.programme.findUnique({ where: { code: sourceCode }, include: { department: { include: { academicUnit: true } } } });
      const sourceMatches = Boolean(sameUnitRecord) || Boolean(existing && (existing.department.academicUnit.abbreviation === unitCode || normalize(existing.name) === normalize(name)));
      let code = sourceCode;
      if (isCrossFacultyCatalogue && !sourceMatches) {
        code = `${unitCode}-${sourceCode}-${normalize(name).slice(0, 36)}-${duration}`.replace(/[^A-Za-z0-9_-]/g, '-');
        let suffix = 2;
        while (await prisma.programme.findUnique({ where: { code } })) code = `${unitCode}-${sourceCode}-${normalize(name).slice(0, 36)}-${duration}-${suffix++}`.replace(/[^A-Za-z0-9_-]/g, '-');
      } else if (existing && !sourceMatches) {
        code = `${unitCode}-${sourceCode}`.replace(/[^A-Za-z0-9_-]/g, '-');
        let suffix = 2;
        while (await prisma.programme.findUnique({ where: { code } })) code = `${unitCode}-${sourceCode}-${suffix++}`.replace(/[^A-Za-z0-9_-]/g, '-');
        summary.codeCollisions.push({ sourceCode, assignedCode: code, unit: unitCode });
      }
      const parsedDeadline = parseDate(deadline);
      const isClosed = /not available|closed/i.test(status) || Boolean(parsedDeadline && parsedDeadline < new Date());
      const hasPublishedStatus = Boolean(status && !/^[-—–]+$/.test(status.trim()));
      const feeInfo = fee(entryRequirements);
      const reviewNotes = [
        !parsedDeadline && 'Missing or unreadable application deadline',
        !feeInfo && 'Fee not identified in the source requirements',
        /[^A-Za-z0-9/_-]/.test(sourceCode) && 'Source code contains non-standard characters',
      ].filter(Boolean).join('; ') || null;
      const data = {
        name, sourceCode, degree: degree(awardType, name), level: level(degree(awardType, name)),
        duration, awardType, entryRequirements,
        applicationDeadline: parsedDeadline, applicationStatus: isClosed ? 'Closed' : (hasPublishedStatus ? status : 'Open'),
        applicationCycle: parsedDeadline ? `${parsedDeadline.getFullYear()}/${parsedDeadline.getFullYear() + 1}` : null,
        sourceDocument: 'List of faculties and schools.docx', sourceImportedAt: new Date(),
        needsReview: Boolean(reviewNotes), reviewNotes,
        isActive: !isClosed,
      };
      const programme = sourceMatches
        ? await prisma.programme.update({ where: { id: existing.id }, data })
        : await prisma.programme.create({ data: { ...data, code, departmentId: department.id } });
      sourceMatches ? summary.programmesUpdated++ : summary.programmesCreated++;
      if (feeInfo) {
        await prisma.tuition.upsert({ where: { programmeId_academicYear: { programmeId: programme.id, academicYear: programme.applicationCycle || '2026/2027' } }, update: { amount: feeInfo.amount, currency: 'XAF', feePeriod: feeInfo.period }, create: { programmeId: programme.id, academicYear: programme.applicationCycle || '2026/2027', amount: feeInfo.amount, currency: 'XAF', feePeriod: feeInfo.period } });
        summary.tuitionUpdated++;
      }
      for (const [category, text] of rulesFrom(entryRequirements)) {
        await prisma.programmeAdmissionRule.upsert({
          where: { programmeId_category_text: { programmeId: programme.id, category, text } },
          update: {}, create: { programmeId: programme.id, category, text },
        });
      }
    }
  }
  console.log(JSON.stringify(summary, null, 2));
} finally {
  await prisma.$disconnect();
}
