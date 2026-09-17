const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'data.ts');
const text = fs.readFileSync(filePath, 'utf8');
const marker = 'export const academicUnits = [';
const start = text.indexOf(marker);
if (start === -1) {
  throw new Error('Could not locate academicUnits block');
}
const open = text.indexOf('[', start);
let depth = 1;
let pos = open + 1;
while (pos < text.length && depth > 0) {
  if (text[pos] === '[') depth++;
  else if (text[pos] === ']') depth--;
  pos++;
}
if (depth !== 0) {
  throw new Error('Malformed academicUnits array');
}
const arrayText = text.slice(open + 1, pos - 1);
const entries = [];
let idx = 0;
while (idx < arrayText.length) {
  while (idx < arrayText.length && /[\s,]/.test(arrayText[idx])) idx++;
  if (idx >= arrayText.length) break;
  if (arrayText[idx] !== '{') {
    throw new Error(`Unexpected character at ${idx}: ${arrayText[idx]}`);
  }
  let brace = 0;
  const entryStart = idx;
  while (idx < arrayText.length) {
    if (arrayText[idx] === '{') brace++;
    else if (arrayText[idx] === '}') {
      brace--;
      if (brace === 0) {
        idx++;
        break;
      }
    }
    idx++;
  }
  if (brace !== 0) {
    throw new Error('Malformed unit entry');
  }
  entries.push(arrayText.slice(entryStart, idx).trim());
}
const extractAbbreviation = (entry) => {
  const match = entry.match(/abbreviation:\s*'([^']+)'/);
  return match ? match[1] : null;
};
const unitMap = new Map(entries.map((entry) => [extractAbbreviation(entry), entry]));
const createFET = `{
  name: 'Faculty of Engineering and Technology',
  abbreviation: 'FET',
  type: 'FACULTY' as const,
  description: 'Provides engineering and technology programmes including Civil, Electrical, Mechanical, Computer, and Telecommunications Engineering.',
  departments: [
    {
      name: 'Civil Engineering',
      abbreviation: 'CIV',
      description: 'Offers programmes in civil engineering',
    },
    {
      name: 'Electrical and Electronic Engineering',
      abbreviation: 'EEE',
      description: 'Offers programmes in electrical and electronic engineering',
    },
    {
      name: 'Mechanical Engineering',
      abbreviation: 'MEC',
      description: 'Offers programmes in mechanical engineering',
    },
    {
      name: 'Computer Engineering',
      abbreviation: 'CPE',
      description: 'Offers programmes in computer engineering',
    },
    {
      name: 'Telecommunications Engineering',
      abbreviation: 'TEL',
      description: 'Offers programmes in telecommunications engineering',
    },
  ],
}`;
const createCBMS = `{
  name: 'College of Business and Management Sciences',
  abbreviation: 'CBMS',
  type: 'SCHOOL' as const,
  description: 'Offers business, accounting, management and finance programmes.',
  departments: [
    {
      name: 'Accounting',
      abbreviation: 'ACCT',
      description: 'Offers programmes in accounting',
    },
    {
      name: 'Banking and Finance',
      abbreviation: 'BF',
      description: 'Offers programmes in banking and finance',
    },
    {
      name: 'Business and Finance',
      abbreviation: 'BFN',
      description: 'Offers programmes in business and finance',
    },
    {
      name: 'Marketing',
      abbreviation: 'MKT',
      description: 'Offers programmes in marketing',
    },
  ],
}`;
const desiredOrder = [
  'FHS',
  'FET',
  'FLPS',
  'FS',
  'FA',
  'FED',
  'FEMS',
  'HTTTC',
  'CBMS',
  'HICM',
  'HITL',
  'HND',
  'NAHPI',
  'DT',
];
if (!unitMap.has('FET')) {
  unitMap.set('FET', createFET);
}
if (!unitMap.has('CBMS')) {
  unitMap.set('CBMS', createCBMS);
}
for (const key of desiredOrder) {
  if (!unitMap.has(key)) {
    throw new Error(`Missing unit ${key}`);
  }
}
const reordered = desiredOrder.map((key) => unitMap.get(key));
const newArrayText = '\n  ' + reordered.join(',\n\n  ') + '\n';
const newText = text.slice(0, open + 1) + newArrayText + text.slice(pos - 1);
fs.writeFileSync(filePath, newText, 'utf8');
console.log('academicUnits reordered and missing units inserted successfully');
