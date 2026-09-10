/** Keep the readable career history available without JavaScript.
 * Edit the experiences array in script.js, then run npm run sync:experience.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const script = readFileSync(new URL('../script.js', import.meta.url), 'utf8');
const match = script.match(/const experiences = (\[[\s\S]*?\n  \])/);
if (!match) throw new Error('Could not find career history in script.js');
const jobs = runInNewContext(match[1], {}, { timeout: 1000 });
const escape = value => String(value).replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
})[char]);
const items = jobs.map(job => `    <li class="timeline-item">
      <p class="timeline-dates">${escape(job.dates)}</p>
      <h3 class="timeline-role">${escape(job.role)}</h3>
      <p class="timeline-company">${escape(job.company)}</p>
      <ul class="timeline-points">
${job.points.map(point => `        <li>${escape(point)}</li>`).join('\n')}
      </ul>
      <div class="timeline-stack">
${job.stack.map(skill => `        <span class="experience-chip">${escape(skill)}</span>`).join('\n')}
      </div>
    </li>`).join('\n');
const file = new URL('../index.html', import.meta.url);
const html = readFileSync(file, 'utf8');
const pattern = /(<ol class="timeline" id="experience-timeline">)[\s\S]*?(<\/ol>)/;
if (!pattern.test(html)) throw new Error('Could not find readable career timeline');
const updated = html.replace(pattern, `$1\n${items}\n  $2`);
if (process.argv.includes('--check')) {
  if (updated !== html) throw new Error('Career history is out of sync. Run npm run sync:experience.');
  console.log(`Career history matches all ${jobs.length} roles in script.js.`);
} else {
  writeFileSync(file, updated);
  console.log(`Updated the readable history for ${jobs.length} roles.`);
}
