import { readFile, writeFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const digest = async path => createHash('sha256').update(await readFile(path)).digest('hex').slice(0, 12);
async function replaceAsync(source, regex, resolveMatch) {
  const matches = [...source.matchAll(regex)];
  const replacements = await Promise.all(matches.map(resolveMatch));
  let i = 0;
  return source.replace(regex, () => replacements[i++]);
}
// Dependencies first, then entry points, so every changed asset gets a fresh URL.
for (const name of ['app.js', 'studio.js']) {
  const path = resolve(root, name);
  const text = await readFile(path, 'utf8');
  const result = await replaceAsync(text, /(['"])(\.\/[^'"?]+\.m?js)(?:\?v=[a-f\d]+)?\1/g,
    async ([, quote, file]) => `${quote}${file}?v=${await digest(resolve(root, file))}${quote}`);
  await writeFile(path, result);
}
async function updateHTML(directory) {
  for (const file of await readdir(directory, { withFileTypes: true })) {
    if (file.name.startsWith('.') || ['node_modules', 'downloads'].includes(file.name)) continue;
    const path = resolve(directory, file.name);
    if (file.isDirectory()) { await updateHTML(path); continue; }
    if (!file.name.endsWith('.html')) continue;
    const source = await readFile(path, 'utf8');
    const result = await replaceAsync(source, /((?:src|href)=")((?:\.\.?\/)[^"?]+\.(?:js|css|svg))(?:\?v=[a-f\d]+)?"/g,
      async ([, prefix, asset]) => `${prefix}${asset}?v=${await digest(resolve(directory, asset))}"`);
    await writeFile(path, result);
  }
}
await updateHTML(root);
console.log('Versioned local CSS, JavaScript and SVG asset URLs.');
