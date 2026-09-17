import { execFileSync } from 'node:child_process';

const source = process.argv[2] ?? '../../List of faculties and schools.docx';
const selectedTable = Number(process.argv.find((arg) => arg.startsWith('--table='))?.split('=')[1]);
const xml = execFileSync('tar', ['-xOf', source, 'word/document.xml'], {
  encoding: 'utf8',
  maxBuffer: 10 * 1024 * 1024,
});
const body = xml.match(/<w:body\b[^>]*>([\s\S]*)<\/w:body>/)?.[1];

if (!body) throw new Error('The Word document has no readable document body.');

const decode = (value) => value
  .replace(/<[^>]+>/g, '')
  .replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
  .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number.parseInt(code, 10)))
  .trim();

const text = (fragment) => decode([...fragment.matchAll(/<w:t\b[^>]*>([\s\S]*?)<\/w:t>/g)].map((m) => m[1]).join(''));
const rows = (table) => [...table.matchAll(/<w:tr\b[^>]*>([\s\S]*?)<\/w:tr>/g)]
  .map((row) => [...row[1].matchAll(/<w:tc\b[^>]*>([\s\S]*?)<\/w:tc>/g)].map((cell) => text(cell[1])));

// Extract only top-level body elements; paragraph tags within tables are intentionally ignored.
const events = [];
const tag = /<\/?w:(?:p|tbl)\b[^>]*>/g;
let match;
let current = null;
let depth = 0;
while ((match = tag.exec(body))) {
  const isClose = match[0].startsWith('</');
  const type = match[0].includes(':tbl') ? 'table' : 'paragraph';
  if (!isClose && current === null) {
    current = { type, start: match.index };
    depth = 1;
  } else if (!isClose && current !== null) {
    depth++;
  } else if (isClose && current !== null) {
    depth--;
    if (depth === 0) {
      const fragment = body.slice(current.start, tag.lastIndex);
      events.push(current.type === 'table' ? { type: 'table', rows: rows(fragment) } : { type: 'paragraph', value: text(fragment) });
      current = null;
    }
  }
}

const context = [];
let tableNumber = 0;
for (const event of events) {
  if (event.type === 'paragraph') {
    if (event.value) context.push(event.value);
    continue;
  }
  tableNumber++;
  const nonEmptyRows = event.rows.filter((row) => row.some(Boolean));
  if (selectedTable === tableNumber) {
    console.log(JSON.stringify(nonEmptyRows, null, 2));
    break;
  }
  if (selectedTable) continue;
  console.log(JSON.stringify({
    table: tableNumber,
    precedingHeadings: context.slice(-5),
    rowCount: nonEmptyRows.length,
    header: nonEmptyRows[0] ?? [],
    firstRecord: nonEmptyRows[1] ?? [],
  }));
}
