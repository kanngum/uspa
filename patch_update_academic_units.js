const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'apps', 'api', 'prisma', 'seed', 'data.ts');
const original = fs.readFileSync(filePath, 'utf8');
const start = original.indexOf('export const academicUnits = [');
const end = original.indexOf('\n// ==========================================', start);
if (start === -1 || end === -1) {
  throw new Error('Could not find academicUnits block boundaries');
}
const replacement = `export const academicUnits = [
  {
    name: 'Faculty of Health Sciences',
    abbreviation: 'FHS',
    type: 'FACULTY' as const,
    description: 'Offers programmes in health, clinical science, medicine, nursing, pharmacy and public health.',
    departments: [
      {
        name: 'General Medicine',
        abbreviation: 'MD',
        description: 'Offers programmes in general medicine',
      },
      {
        name: 'Nursing/Midwifery',
        abbreviation: 'NMW',
        description: 'Offers programmes in nursing and midwifery',
      },
      {
        name: 'Biomedical Science',
        abbreviation: 'BMS',
        description: 'Offers programmes in biomedical science',
      },
      {
        name: 'Public Health',
        abbreviation: 'PH',
        description: 'Offers programmes in public health',
      },
      {
        name: 'Medical Laboratory Science',
        abbreviation: 'MLS',
        description: 'Offers programmes in medical laboratory science',
      },
      {
        name: 'Clinical Science',
        abbreviation: 'CLS',
        description: 'Offers programmes in clinical science',
      },
      {
        name: 'Medical and BioMedical Sciences',
        abbreviation: 'MBMS',
        description: 'Offers programmes in medical and biomedical sciences',
      },
      {
        name: 'Pharmacy',
        abbreviation: 'PHAM',
        description: 'Offers programmes in pharmacy',
      },
    ],
  },
  {
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
  },
  {
    name: 'Faculty of Law and Political Science',
    abbreviation: 'FLPS',
    type: 'FACULTY' as const,
    description: 'Offers programmes in law, political science and public law.',
    departments: [
      {
        name: 'Capacité en Droit',
        abbreviation: 'CAPA',
        description: 'Offers programmes in legal capacity and law',
      },
      {
        name: 'Political Science',
        abbreviation: 'POS',
        description: 'Offers programmes in political science',
      },
      {
        name: 'International Relations',
        abbreviation: 'IR',
        description: 'Offers programmes in international relations',
      },
      {
        name: 'English Private Law',
        abbreviation: 'EPL',
        description: 'Offers programmes in English private law',
      },
      {
        name: 'French Private Law',
        abbreviation: 'FPL',
        description: 'Offers programmes in French private law',
      },
      {
        name: 'Public Law',
        abbreviation: 'PUL',
        description: 'Offers programmes in public law',
      },
    ],
  },
  {
    name: 'Faculty of Science',
    abbreviation: 'FS',
    type: 'FACULTY' as const,
    description: 'Offers science programmes in biology, chemistry, physics, geology, mathematics and related fields.',
    departments: [
      {
        name: 'Computer Science',
        abbreviation: 'CS',
        description: 'Offers programmes in computer science',
      },
      {
        name: 'Mathematics',
        abbreviation: 'MATH',
        description: 'Offers programmes in mathematics',
      },
      {
        name: 'Physics',
        abbreviation: 'PHY',
        description: 'Offers programmes in physics',
      },
      {
        name: 'Chemistry',
        abbreviation: 'CHM',
        description: 'Offers programmes in chemistry',
      },
      {
        name: 'Biological Science',
        abbreviation: 'BS',
        description: 'Offers programmes in biological science',
      },
      {
        name: 'Geology, Mining and Environmental Science',
        abbreviation: 'GMES',
        description: 'Offers programmes in geology, mining and environmental science',
      },
      {
        name: 'Environmental Science',
        abbreviation: 'ENV',
        description: 'Offers programmes in environmental science',
      },
      {
        name: 'Zoology',
        abbreviation: 'ZOO',
        description: 'Offers programmes in zoology',
      },
      {
        name: 'Biochemistry',
        abbreviation: 'BCH',
        description: 'Offers programmes in biochemistry',
      },
      {
        name: 'Microbiology and Parasitology',
        abbreviation: 'MICP',
        description: 'Offers programmes in microbiology and parasitology',
      },
      {
        name: 'Plant Sciences (Botany)',
        abbreviation: 'BOT',
        description: 'Offers programmes in plant sciences and botany',
      },
      {
        name: 'Thermal and Energy Engineering',
        abbreviation: 'TEE',
        description: 'Offers programmes in thermal and energy engineering',
      },
    ],
  },
  {
    name: 'Faculty of Arts',
    abbreviation: 'FA',
    type: 'FACULTY' as const,
    description: 'Offers programmes in humanities, language studies, arts and communication.',
    departments: [
      {
        name: 'English',
        abbreviation: 'ENG',
        description: 'Offers programmes in English',
      },
      {
        name: 'French',
        abbreviation: 'FREN',
        description: 'Offers programmes in French',
      },
      {
        name: 'History, Heritage and International Studies',
        abbreviation: 'HISA',
        description: 'Offers programmes in history, heritage and international studies',
      },
      {
        name: 'Geography and Planning',
        abbreviation: 'GP',
        description: 'Offers programmes in geography and planning',
      },
      {
        name: 'Philosophy',
        abbreviation: 'PHI',
        description: 'Offers programmes in philosophy',
      },
      {
        name: 'Sociology and Anthropology',
        abbreviation: 'SOC',
        description: 'Offers programmes in sociology and anthropology',
      },
      {
        name: 'Economics',
        abbreviation: 'ECON',
        description: 'Offers programmes in economics',
      },
      {
        name: 'Communication and Development Studies',
        abbreviation: 'CDS',
        description: 'Offers programmes in communication and development studies',
      },
      {
        name: 'Education',
        abbreviation: 'ED',
        description: 'Offers programmes in education',
      },
      {
        name: 'English, Literature and Digital Cultures',
        abbreviation: 'ELDIC',
        description: 'Offers programmes in English, literature and digital cultures',
      },
      {
        name: 'Linguistics and African Languages',
        abbreviation: 'LAL',
        description: 'Offers programmes in linguistics and African languages',
      },
      {
        name: 'Performing and Visual Arts',
        abbreviation: 'PVA',
        description: 'Offers programmes in performing and visual arts',
      },
      {
        name: 'Psychology',
        abbreviation: 'PY',
        description: 'Offers programmes in psychology',
      },
      {
        name: 'University of Bamenda Language Center',
        abbreviation: 'UBALAC',
        description: 'Offers language and cultural programmes',
      },
    ],
  },
  {
    name: 'Higher Technical Teacher Training College Bambili',
    abbreviation: 'HTTTC Bambili',
    type: 'SCHOOL' as const,
    description: 'Trains secondary school teachers in various subject disciplines.',
    departments: [
      {
        name: 'Sciences',
        abbreviation: 'SCI-ED',
        description: 'Trains science teachers',
      },
      {
        name: 'Arts',
        abbreviation: 'ART-ED',
        description: 'Trains arts teachers',
      },
      {
        name: 'Bilingual Studies',
        abbreviation: 'BIL-ED',
        description: 'Trains bilingual teachers',
      },
    ],
  },
  {
    name: 'Faculty of Economics and Management Sciences',
    abbreviation: 'FEMS',
    type: 'FACULTY' as const,
    description: 'Offers programmes in economics, accounting, finance, management and marketing.',
    departments: [
      {
        name: 'Accounting',
        abbreviation: 'ACC',
        description: 'Offers programmes in accounting',
      },
      {
        name: 'Banking and Finance',
        abbreviation: 'BNF',
        description: 'Offers programmes in banking and finance',
      },
      {
        name: 'Business and Finance',
        abbreviation: 'BF',
        description: 'Offers programmes in business and finance',
      },
      {
        name: 'Economics',
        abbreviation: 'ECN',
        description: 'Offers programmes in economics',
      },
      {
        name: 'Management and Marketing',
        abbreviation: 'MGT',
        description: 'Offers programmes in management and marketing',
      },
    ],
  },
  {
    name: 'College of Technology',
    abbreviation: 'COLTECH',
    type: 'SCHOOL' as const,
    description: 'Offers professional and vocational training in technology fields.',
    departments: [
      {
        name: 'Information and Communication Technology',
        abbreviation: 'ICT',
        description: 'Offers programmes in information and communication technology',
      },
      {
        name: 'Electrical Engineering',
        abbreviation: 'ELEC',
        description: 'Offers programmes in electrical engineering',
      },
      {
        name: 'Mechanical Engineering',
        abbreviation: 'MECH',
        description: 'Offers programmes in mechanical engineering',
      },
      {
        name: 'Agribusiness Technology',
        abbreviation: 'ABT',
        description: 'Offers programmes in agribusiness technology',
      },
      {
        name: 'Agricultural and Environmental Engineering',
        abbreviation: 'AEE',
        description: 'Offers programmes in agricultural and environmental engineering',
      },
      {
        name: 'Animal Production Technology',
        abbreviation: 'APT',
        description: 'Offers programmes in animal production technology',
      },
      {
        name: 'Civil Engineering',
        abbreviation: 'CE',
        description: 'Offers programmes in civil engineering',
      },
      {
        name: 'Computer Engineering',
        abbreviation: 'CEN',
        description: 'Offers programmes in computer engineering',
      },
      {
        name: 'Crop Production Technology',
        abbreviation: 'CPT',
        description: 'Offers programmes in crop production technology',
      },
      {
        name: 'Electrical and Electronic Engineering',
        abbreviation: 'EEEP',
        description: 'Offers programmes in electrical and electronic engineering',
      },
      {
        name: 'Engineering and Technology',
        abbreviation: 'ET',
        description: 'Offers programmes in engineering and technology',
      },
      {
        name: 'Forestry and Wildlife Technology',
        abbreviation: 'FWT',
        description: 'Offers programmes in forestry and wildlife technology',
      },
      {
        name: 'Home Economics and Social Work',
        abbreviation: 'HESW',
        description: 'Offers programmes in home economics and social work',
      },
      {
        name: 'Nutrition, Food and Bioresource Technology',
        abbreviation: 'NFBT',
        description: 'Offers programmes in nutrition, food and bioresource technology',
      },
      {
        name: 'Renewable Energy Technology',
        abbreviation: 'REEP',
        description: 'Offers programmes in renewable energy technology',
      },
    ],
  },
  {
    name: 'Higher Institute of Commerce and Management',
    abbreviation: 'HICM',
    type: 'SCHOOL' as const,
    description: 'Offers commerce, management, transport and hospitality programmes.',
    departments: [
      {
        name: 'Accounting and Finance',
        abbreviation: 'AFN',
        description: 'Offers programmes in accounting and finance',
      },
      {
        name: 'Management and Entrepreneurship',
        abbreviation: 'MGTC',
        description: 'Offers programmes in management and entrepreneurship',
      },
      {
        name: 'Marketing',
        abbreviation: 'MKT',
        description: 'Offers programmes in marketing',
      },
      {
        name: 'Money and Banking',
        abbreviation: 'MAB',
        description: 'Offers programmes in money and banking',
      },
      {
        name: 'Information and Communication Management Systems',
        abbreviation: 'IMC',
        description: 'Offers programmes in information and communication management systems',
      },
      {
        name: 'Insurance',
        abbreviation: 'INS',
        description: 'Offers programmes in insurance',
      },
      {
        name: 'Organizational Sciences',
        abbreviation: 'OGS',
        description: 'Offers programmes in organizational sciences',
      },
      {
        name: 'Air Transport',
        abbreviation: 'ATR',
        description: 'Offers programmes in air transport',
      },
      {
        name: 'Customs',
        abbreviation: 'CUS',
        description: 'Offers programmes in customs',
      },
      {
        name: 'General Studies',
        abbreviation: 'GNS',
        description: 'Offers programmes in general studies',
      },
      {
        name: 'Land Transport',
        abbreviation: 'LTP',
        description: 'Offers programmes in land transport',
      },
      {
        name: 'Maritime Transport',
        abbreviation: 'MTT',
        description: 'Offers programmes in maritime transport',
      },
      {
        name: 'Tourism and Hospitality Management',
        abbreviation: 'TM',
        description: 'Offers programmes in tourism and hospitality management',
      },
      {
        name: 'Transit and Logistics',
        abbreviation: 'TLG',
        description: 'Offers programmes in transit and logistics',
      },
    ],
  },
];
`;
const patched = prefix + replacement + suffix;
fs.writeFileSync(filePath, patched, 'utf8');
console.log('academicUnits block updated successfully.');
`;
fs.writeFileSync(filePath, prefix + replacement + suffix, 'utf8');
console.log('academicUnits block updated successfully.');
