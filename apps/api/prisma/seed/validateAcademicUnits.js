const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'data.ts');
const text = fs.readFileSync(filePath, 'utf8');
const start = text.indexOf('export const academicUnits = [');
if (start === -1) throw new Error('academicUnits block not found');
const open = text.indexOf('[', start);
let depth = 1;
let pos = open + 1;
while (pos < text.length && depth > 0) {
  if (text[pos] === '[') depth++;
  else if (text[pos] === ']') depth--;
  pos++;
}
const arr = text.slice(open + 1, pos - 1);
const entries = [];
let i = 0;
while (i < arr.length) {
  while (i < arr.length && /[\s,]/.test(arr[i])) i++;
  if (i >= arr.length) break;
  if (arr[i] !== '{') throw new Error('unexpected char at ' + i);
  let brace = 0;
  const startEntry = i;
  while (i < arr.length) {
    if (arr[i] === '{') brace++;
    else if (arr[i] === '}') {
      brace--;
      if (brace === 0) {
        i++;
        break;
      }
    }
    i++;
  }
  const entry = arr.slice(startEntry, i);
  const ab = entry.match(/abbreviation:\s*'([^']+)'/);
  const depsMatch = entry.match(/departments:\s*\[([\s\S]*?)\]/m);
  const deps = depsMatch ? depsMatch[1] : '';
  const depCount = (deps.match(/\{[\s\S]*?\}/g) || []).length;
  entries.push({ abbr: ab ? ab[1] : '?', depCount, text: entry });
}
console.log('academicUnits order:');
entries.forEach((entry, idx) => console.log(`${idx}: ${entry.abbr} (${entry.depCount})`));

const progStart = text.indexOf('export const programmes = [');
const progText = text.slice(progStart);
const progRegex = /\{[\s\S]*?code:\s*'([^']+)'[\s\S]*?departmentIndex:\s*\{\s*facultyIdx:\s*(\d+),\s*deptIdx:\s*(\d+)\s*\}[\s\S]*?\}/gm;
const progs = [];
let m;
while ((m = progRegex.exec(progText))) {
  progs.push({ code: m[1], faculty: +m[2], dept: +m[3] });
}
const invalid = progs.filter(p => !entries[p.faculty] || p.dept >= entries[p.faculty].depCount);
console.log('programmes total:', progs.length);
console.log('invalid refs:', invalid.length);
invalid.slice(0, 50).forEach(p => console.log(JSON.stringify(p)));
