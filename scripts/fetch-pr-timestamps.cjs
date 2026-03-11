/**
 * Fetch PR timestamps from GitHub for all tracked projects.
 * Outputs prDetails arrays that can be pasted into metrics data files.
 *
 * Usage: node scripts/fetch-pr-timestamps.cjs
 * Requires: gh CLI authenticated
 */

const { execSync } = require('child_process');

const REPOS = {
  meta: { repo: 'Jynax/meta-tracker', sessionPrefix: 'Session' },
  bip: { repo: 'Jynax/buriedinprint-reading-app', sessionPrefix: null },
  remnants: { repo: 'Jynax/remnants-game', sessionPrefix: null },
  'item-b-gone': { repo: 'Jynax/item-b-gone-dashboard', sessionPrefix: null },
  'vuln-bank': { repo: 'hrpatel/vuln-bank', sessionPrefix: 'Session' },
};

const GH = '"C:/Program Files/GitHub CLI/gh.exe"';

function fetchPRs(repo) {
  try {
    const cmd = `${GH} pr list --repo ${repo} --state merged --limit 500 --json number,title,createdAt,mergedAt`;
    const raw = execSync(cmd, { encoding: 'utf-8', timeout: 30000 });
    return JSON.parse(raw);
  } catch (err) {
    console.error(`  Failed to fetch PRs for ${repo}: ${err.message}`);
    return [];
  }
}

function formatDate(isoStr) {
  const d = new Date(isoStr);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[d.getMonth()]} ${d.getDate()}`;
}

function groupByDate(prs) {
  const groups = {};
  for (const pr of prs) {
    const dateKey = formatDate(pr.mergedAt);
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push({
      number: pr.number,
      title: pr.title,
      createdAt: pr.createdAt,
      mergedAt: pr.mergedAt,
    });
  }
  // Sort PRs within each group by mergedAt
  for (const key of Object.keys(groups)) {
    groups[key].sort((a, b) => new Date(a.mergedAt) - new Date(b.mergedAt));
  }
  return groups;
}

function computeSpan(prs) {
  if (!prs.length) return null;
  const first = new Date(Math.min(...prs.map(p => new Date(p.createdAt).getTime())));
  const last = new Date(Math.max(...prs.map(p => new Date(p.mergedAt).getTime())));
  const spanMs = last - first;
  const spanMin = Math.round(spanMs / 60000);
  const hours = Math.floor(spanMin / 60);
  const mins = spanMin % 60;
  return { spanMin, display: hours > 0 ? `${hours}h ${mins}m` : `${mins}m` };
}

function formatPRDetail(pr) {
  return `      { number: ${pr.number}, title: ${JSON.stringify(pr.title)}, createdAt: '${pr.createdAt}', mergedAt: '${pr.mergedAt}' }`;
}

console.log('PR Timestamp Enrichment — Fetching from GitHub\n');
console.log('='.repeat(60));

for (const [projectId, config] of Object.entries(REPOS)) {
  console.log(`\n## ${projectId} (${config.repo})`);
  const prs = fetchPRs(config.repo);
  console.log(`  Found ${prs.length} merged PRs`);

  if (!prs.length) continue;

  const byDate = groupByDate(prs);
  const dates = Object.keys(byDate).sort((a, b) => {
    const months = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
    const [am, ad] = a.split(' ');
    const [bm, bd] = b.split(' ');
    return (months[am] * 100 + parseInt(ad)) - (months[bm] * 100 + parseInt(bd));
  });

  console.log(`  Grouped into ${dates.length} dates\n`);

  for (const date of dates) {
    const datePrs = byDate[date];
    const span = computeSpan(datePrs);
    console.log(`  ${date} — ${datePrs.length} PR(s)${span ? ` — span: ${span.display}` : ''}`);
    console.log(`    prDetails: [`);
    for (const pr of datePrs) {
      console.log(formatPRDetail(pr) + ',');
    }
    console.log(`    ],`);
  }
}

console.log('\n' + '='.repeat(60));
console.log('\nDone. Copy the prDetails arrays into the corresponding session entries.');
