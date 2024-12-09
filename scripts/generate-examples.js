import { dirname, resolve } from 'path';
import { readdirSync, readFile, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const files = readdirSync(resolve(__dirname, '../examples/'));

const tmpl =
  '<a class="text-airforce text-dark-2 font-w600 font-s4 py-2 capitalize" target="_blank" href="/examples/{{LINK}}">{{NAME}}</a>';

const links = [];
files.map((file) => {
  let tp = tmpl.replace('{{LINK}}', file);
  tp = tp.replace('{{NAME}}', file.split('.')[0]);

  links.push(tp);
});

readFile(resolve(__dirname, './index.tmpl'), 'utf-8', (err, data) => {
  if (err) throw err;

  const content = data.replace('{{LINKS}}', links.join('\n'));
  err = writeFileSync(resolve(__dirname, '../index.html'), content, 'utf-8');
  if (err) throw err;
});
