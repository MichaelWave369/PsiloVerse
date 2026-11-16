import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve, dirname} from 'node:path';
import {Script} from 'node:vm';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = p => readFileSync(resolve(root,p), 'utf8');
const ledger = JSON.parse(read('data/atlas.json'));
const home = read('index.html');
const js = read('app/main.mjs');
const css = read('app/style.css');
const methods = read('docs/methods.md');
const governance = read('GOVERNANCE.md');
const packageJson = JSON.parse(read('package.json'));
assert.equal(ledger.project,'PsiloVerse');
assert.equal(ledger.authority,'SOURCE_BOUNDED_ATLAS_NOT_EXPERIMENT');
assert.equal(packageJson.scripts.test,'node scripts/validate.mjs');
assert.equal(ledger.claims.length,9);
assert.equal(ledger.sources.length,3);
assert.equal(ledger.hypotheses.length,3);
function unique(items) {assert.equal(new Set(items.map(v=>v.id)).size,items.length,'IDs must be unique');}
unique(ledger.sources); unique(ledger.claims); unique(ledger.hypotheses);
const known=new Set(ledger.sources.map(s=>s.id));
const lanes=new Set(['evolution','biochemistry','taxonomy','methods']);
for(const source of ledger.sources) {
  assert.match(source.url,/^https:\/\/doi\.org\/10\./);
  assert.equal(source.url,'https://doi.org/'+source.doi);
  assert.ok(source.title.length>20 && source.year>=2010 && source.year<=2026);
}
for(const claim of ledger.claims) {
  assert.match(claim.id,/^PVE-\d{3}$/);
  assert.ok(lanes.has(claim.lane));
  assert.ok(Array.isArray(claim.sources) && claim.sources.length>=1);
  for(const id of claim.sources) assert.ok(known.has(id),'Unresolved source: '+id);
  for(const key of ['title','summary','limits','status']) assert.ok(claim[key]?.length>10,'Missing '+key+' in '+claim.id);
  assert.ok(!claim.status.includes('SPECULATIVE'));
}
for(const hyp of ledger.hypotheses) {
  assert.match(hyp.id,/^HYP-[A-Z]+-\d{2}$/);
  assert.match(hyp.status,/(SPECULATIVE|CONTRADICTED|PLAUSIBLE)/);
  assert.ok(hyp.needed.length>20 && hyp.alternative.length>20);
}
for(const id of ['main','evidence','origins','hypotheses','search','lane','export','claims','hypotheses-list']) {
  assert.ok(home.includes('id="'+id+'"'),'Missing element: '+id);
}
assert.match(home,/GENE PRESENCE ≠ COMPOUND DETECTION/);
assert.match(js,/textContent/);
assert.match(js,/noopener noreferrer/);
assert.match(js,/fetch\('\.\/data\/atlas\.json'/);
assert.ok(!/innerHTML|eval\s*\(|new Function/.test(js));
new Script(js,{filename:'app/main.mjs'});
assert.match(css,/@media\(max-width:700px\)/);
assert.match(governance,/GENETIC CAPACITY ≠ EXPRESSION/);
assert.match(methods,/does not implement an evolutionary simulator/);
assert.match(methods,/Eden hypothesis notebook/);
for(const file of ['app/style.css','app/main.mjs','docs/methods.md','.github/workflows/validate.yml','README.md','LICENSE']) {
  assert.ok(existsSync(resolve(root,file)),'Missing '+file);
}
console.log('PASS PsiloVerse v0.1: 9 sourced claims, 3 studies, 3 separated hypotheses, syntactic and governance checks');
