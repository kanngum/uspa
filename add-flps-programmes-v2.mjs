// Script to add FLPS programmes - using public programmes endpoint
const API = 'http://localhost:3001/api';

const programmes = [
  {
    name: 'English Private Law',
    code: 'EPLW',
    degree: 'LLB',
    level: 'UNDERGRADUATE',
    duration: 3,
    description: 'Bachelor Degree in English Private Law. Requires: Four O/L papers excluding Religious Studies but including English Language. BEPC and Probatoire. Two A/L subjects obtained in one sitting excluding Religious Studies or Baccalaureate. Capacité en Droit. Fees: 50,000 FRS.',
    departmentId: 'cmrxq8t7y0035tokchtk5vtqh',
  },
  {
    name: 'Masters in English Private Law',
    code: 'LLM-EPLW',
    degree: 'LLB',
    level: 'POSTGRADUATE',
    duration: 2,
    description: 'Master Degree in English Private Law. Requires: LL.B (Hons) in Public Law (Second Class Lower). LL.B (Hons) in Private Law depending on electives. Licence en Droit Public with at least Assez-Bien. PGD in Law or Maîtrise in Law. Tuition: 50,000 CFA/year.',
    departmentId: 'cmrxq8t7y0035tokchtk5vtqh',
  },
  {
    name: 'Conversion Masters in English Private Law',
    code: 'EPLL',
    degree: 'LLB',
    level: 'POSTGRADUATE',
    duration: 1,
    description: "Conversion Master Degree in English Private Law. Requires: Professional Master's Degree in any field of Law or equivalent. Registration: 25,000 FRS. Tuition: 500,000 FRS.",
    departmentId: 'cmrxq8t7y0035tokchtk5vtqh',
  },
  {
    name: 'LL.B Public Law',
    code: 'PUL',
    degree: 'LLB',
    level: 'UNDERGRADUATE',
    duration: 3,
    description: 'Bachelor Degree in Public Law. Requires: Four O/L papers excluding Religious Studies but including English Language. BEPC and Probatoire with pass in English Language. Two A/L subjects in one sitting excluding Religious Studies. Baccalaureate. Capacité en Droit. Fees: 50,000 FRS.',
    departmentId: 'cmrxq8t840038tokczr86yy7b',
  },
  {
    name: 'Capacité en Droit',
    code: 'CAP',
    degree: 'DIPLOMA',
    level: 'UNDERGRADUATE',
    duration: 2,
    description: 'Diploma in Legal Capacity. Requires: GCE A/L in at least two (2) subjects in one sitting or Baccalaureate or equivalent. GCE O/L in at least five (5) subjects including English Language or Probatoire with pass in English Language. Fees: 150,000 FRS.',
    departmentId: 'cmrxq8t7w0034tokcrcsijmcd',
  },
  {
    name: 'LL.M. in Public Law',
    code: 'LLM-PULL',
    degree: 'LLB',
    level: 'POSTGRADUATE',
    duration: 2,
    description: 'Master Degree in Public Law. Requires: LL.B (Hons) in Public Law (Second Class Lower). LL.B (Hons) in Private Law depending on electives. Licence en Droit Public with at least Assez-Bien. PGD in Law or Maîtrise in Law. Tuition: 50,000 CFA/year.',
    departmentId: 'cmrxq8t840038tokczr86yy7b',
  },
  {
    name: 'BSc Political Science',
    code: 'POLS',
    degree: 'BSC',
    level: 'UNDERGRADUATE',
    duration: 3,
    description: 'Bachelor Degree in Political Science. Requires: GCE A/L in at least two (2) papers in one sitting excluding Religious Studies, or BAC (A, B, C, D, G2, G3) with pass in English Language at Probatoire. Four O/L papers in one sitting excluding Religious Studies including English Language. Capacité en Droit. Fees: 50,000 FRS.',
    departmentId: 'cmrxq8t820037tokccmdybeij',
  },
  {
    name: 'French Private Law',
    code: 'FPLW',
    degree: 'LLB',
    level: 'UNDERGRADUATE',
    duration: 3,
    description: 'Bachelor Degree in French Private Law. Requires: Four O/L papers excluding Religious Studies but including English Language. BEPC and Probatoire with pass in English Language. Two A/L subjects in one sitting excluding Religious Studies. Baccalaureate. Capacité en Droit. Fees: 50,000 FRS.',
    departmentId: 'cmrxq8t800036tokcdsj4rjwc',
  },
];

async function main() {
  console.log(`📋 Adding ${programmes.length} FLPS programmes...\n`);

  for (const prog of programmes) {
    console.log(`  ➡️  Adding: ${prog.name} (${prog.code})...`);
    try {
      const res = await fetch(`${API}/programmes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prog),
      });
      const data = await res.json();
      if (data.success) {
        console.log(`  ✅ ${prog.code} — ID: ${data.data.id}`);
      } else {
        console.log(`  ❌ ${prog.code} — ${data.message || JSON.stringify(data)}`);
      }
    } catch (err) {
      console.log(`  ❌ ${prog.code} — Network error: ${err.message}`);
    }
  }

  console.log('\n✅ Done!');
}

main().catch(console.error);
