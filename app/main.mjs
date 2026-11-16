const $ = (selector) => document.querySelector(selector);
const claimsTarget = $('#claims');
const hypothesisTarget = $('#hypotheses-list');
let ledger;
function node(tag, attrs = {}, text = '') {
  const el = document.createElement(tag);
  for (const [name, value] of Object.entries(attrs)) el.setAttribute(name, value);
  el.textContent = text;
  return el;
}
function claimCard(claim, byId) {
  const card = node('article', {class: 'claim'});
  card.append(node('span', {class: 'tag'}, claim.lane), node('span', {class: 'id'}, claim.id));
  card.append(node('h3', {}, claim.title), node('p', {class: 'status'}, claim.status), node('p', {}, claim.summary));
  card.append(node('p', {class: 'limits'}, 'Limits: ' + claim.limits));
  const refs = node('div', {class: 'sources'});
  for (const id of claim.sources) {
    const source = byId.get(id);
    if (!source) continue;
    refs.append(node('a', {href: source.url, target: '_blank', rel: 'noopener noreferrer'}, source.authors + ' (' + source.year + ') · ' + source.journal + ' ↗'));
  }
  card.append(refs);
  return card;
}
function renderClaims() {
  const term = $('#search').value.trim().toLowerCase();
  const lane = $('#lane').value;
  const filtered = ledger.claims.filter((item) => (lane === 'all' || item.lane === lane) &&
    [item.id, item.title, item.summary, item.status, item.limits].some((v) => v.toLowerCase().includes(term)));
  const sourceIndex = new Map(ledger.sources.map((s) => [s.id, s]));
  claimsTarget.replaceChildren(...filtered.map((item) => claimCard(item, sourceIndex)));
  if (!filtered.length) claimsTarget.append(node('p', {class: 'empty'}, 'No claims match those filters.'));
}
function renderHypotheses() {
  hypothesisTarget.replaceChildren(...ledger.hypotheses.map((item) => {
    const card = node('article', {class: 'hypothesis'});
    card.append(node('p', {class: 'flag'}, item.status), node('h3', {}, item.title));
    for (const [title, value] of [['The question', item.question], ['Evidence needed', item.needed], ['Alternative', item.alternative]]) {
      card.append(node('strong', {}, title), node('p', {}, value));
    }
    return card;
  }));
}
function downloadLedger() {
  const blob = new Blob([JSON.stringify(ledger, null, 2)], {type: 'application/json'});
  const href = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = href;
  anchor.download = 'psiloverse-evidence-v0.1.json';
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(href);
}
async function main() {
  try {
    const response = await fetch('./data/atlas.json', {cache: 'no-cache'});
    if (!response.ok) throw new Error('HTTP ' + response.status);
    ledger = await response.json();
    if (!Array.isArray(ledger.claims) || !Array.isArray(ledger.sources) || !Array.isArray(ledger.hypotheses)) throw new Error('Invalid ledger structure');
    $('#metric-claims').textContent = ledger.claims.length;
    $('#metric-sources').textContent = ledger.sources.length;
    $('#metric-hyp').textContent = ledger.hypotheses.length;
    renderClaims();
    renderHypotheses();
    $('#search').addEventListener('input', renderClaims);
    $('#lane').addEventListener('change', renderClaims);
    $('#export').disabled = false;
    $('#export').addEventListener('click', downloadLedger);
  } catch (error) {
    claimsTarget.replaceChildren(node('p', {class: 'empty'}, 'Could not load evidence. Please serve this repository through HTTP or view the deployed GitHub Pages site.'));
    hypothesisTarget.replaceChildren(node('p', {class: 'empty'}, 'Evidence unavailable.'));
    console.error('PsiloVerse evidence load failed:', error);
  }
}
main();
