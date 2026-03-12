/**
 * T-2: Migration Script — Convert SessionEntry → DayEntry + WorkBlock
 *
 * Reads all metrics files, groups sessions by date into DayEntry records,
 * maps each session to a WorkBlock, and writes new exported arrays.
 * Original session data is preserved (not deleted).
 *
 * Usage: node scripts/migrate-sessions-to-days.cjs [--dry-run]
 *
 * Idempotent: skips files that already contain Days arrays.
 */

const fs = require('fs');
const path = require('path');

const DRY_RUN = process.argv.includes('--dry-run');
const DATA_DIR = path.join(__dirname, '..', 'src', 'data');

// ── Project config ──────────────────────────────────────────────────

const PROJECTS = [
  { id: 'meta', metricsFile: 'metaMetrics.ts', projectFile: 'metaProject.ts', sessionsVar: 'metaSessions', codeVolVar: 'metaCodeVolume', daysVar: 'metaDays' },
  { id: 'bip', metricsFile: 'bipMetrics.ts', projectFile: 'bipProject.ts', sessionsVar: 'bipSessions', codeVolVar: 'bipCodeVolume', daysVar: 'bipDays' },
  { id: 'remnants', metricsFile: 'remnantsMetrics.ts', projectFile: 'remnantsProject.ts', sessionsVar: 'remnantsSessions', codeVolVar: 'remnantsCodeVolume', daysVar: 'remnantsDays' },
  { id: 'ibg', metricsFile: 'itemBGoneMetrics.ts', projectFile: 'itemBGoneProject.ts', sessionsVar: 'ibgSessions', codeVolVar: 'ibgCodeVolume', daysVar: 'ibgDays' },
  { id: 'vb', metricsFile: 'vulnBankMetrics.ts', projectFile: 'vulnBankProject.ts', sessionsVar: 'vbSessions', codeVolVar: 'vbCodeVolume', daysVar: 'vbDays' },
  { id: 'landing', metricsFile: 'landingMetrics.ts', projectFile: 'landingProject.ts', sessionsVar: 'landingSessions', codeVolVar: 'landingCodeVolume', daysVar: 'landingDays' },
  { id: 'fc', metricsFile: 'feedbackCaptureMetrics.ts', projectFile: 'feedbackCaptureProject.ts', sessionsVar: 'fcSessions', codeVolVar: 'fcCodeVolume', daysVar: 'fcDays' },
];

// ── Field mappings ──────────────────────────────────────────────────

const TOOL_TO_OPERATOR = {
  'Claude Code': 'claude-code',
  'Cowork': 'claude-ai',
  'Codex': 'claude-ai',
  'Mixed': 'mixed',
};

const DRIVER_MAP = {
  'human': 'human',
  'human-only': 'human-only',
  'ai': 'agent-led',
  'agent-led': 'agent-led',
  'collaborative': 'collaborative',
};

// ── Array extraction ────────────────────────────────────────────────

/**
 * Extract a JS array from a TypeScript source file by variable name.
 * Uses bracket-depth counting to find the full array, then evals it.
 */
function extractArray(source, varName) {
  const pattern = new RegExp(`export\\s+const\\s+${varName}[^=]*=\\s*\\[`);
  const match = source.match(pattern);
  if (!match) return null;

  // Find the opening '[' at the END of the match (the array literal, not the type annotation)
  const startIdx = match.index + match[0].length - 1;
  let depth = 0;
  let endIdx = startIdx;
  for (let i = startIdx; i < source.length; i++) {
    if (source[i] === '[') depth++;
    if (source[i] === ']') depth--;
    if (depth === 0) { endIdx = i; break; }
  }

  const raw = source.substring(startIdx, endIdx + 1);
  // Strip single-line comments (but not URLs with //)
  const cleaned = raw.replace(/\/\/(?![\w./-]*\.[a-z]{2,})[^\n]*/g, '');

  try {
    // The array literal is valid JS — eval it in an isolated scope
    return new Function(`return ${cleaned}`)();
  } catch (err) {
    console.error(`  Failed to parse ${varName}: ${err.message}`);
    return null;
  }
}

// ── Slug helper ─────────────────────────────────────────────────────

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// ── Migration logic ─────────────────────────────────────────────────

function migrateProject(project) {
  const metricsPath = path.join(DATA_DIR, project.metricsFile);
  const projectPath = path.join(DATA_DIR, project.projectFile);
  const source = fs.readFileSync(metricsPath, 'utf-8');

  // Idempotency: skip if days array already exists
  if (source.includes(`export const ${project.daysVar}`)) {
    console.log(`  ⏭  ${project.id}: ${project.daysVar} already exists — skipping`);
    return { skipped: true };
  }

  // Extract sessions and code volume
  const sessions = extractArray(source, project.sessionsVar);
  const codeVol = extractArray(source, project.codeVolVar);

  if (!sessions) {
    console.log(`  ⚠  ${project.id}: no sessions found — skipping`);
    return { skipped: true };
  }

  // Build code volume lookup: session name → { added, deleted }
  const codeLookup = {};
  if (codeVol) {
    for (const cv of codeVol) {
      codeLookup[cv.session] = { added: cv.added, deleted: cv.deleted };
    }
  }

  // Group sessions by date
  const dateGroups = new Map();
  for (const s of sessions) {
    if (!dateGroups.has(s.date)) dateGroups.set(s.date, []);
    dateGroups.get(s.date).push(s);
  }

  // Build DayEntry array
  const days = [];
  for (const [date, group] of dateGroups) {
    const blocks = group.map((s, idx) => {
      const cv = codeLookup[s.session] || {};
      return {
        id: `${project.id}-${slugify(s.session)}`,
        dayId: date,
        label: s.label || `${s.workCategory || 'Work'} — ${s.tool || 'Unknown'}`,
        workCategory: s.workCategory || 'Feature',
        driver: DRIVER_MAP[s.driver] || 'agent-led',
        operator: TOOL_TO_OPERATOR[s.tool] || 'mixed',
        timeMinutes: Math.round((s.duration || 0) * 60),
        linesAdded: cv.added || 0,
        linesDeleted: cv.deleted || 0,
        note: s.focus || undefined,
        contextWindowOrigin: false,
      };
    });

    // Aggregate metrics
    const totalTimeMinutes = blocks.reduce((sum, b) => sum + b.timeMinutes, 0);
    const linesAdded = blocks.reduce((sum, b) => sum + b.linesAdded, 0);
    const linesDeleted = blocks.reduce((sum, b) => sum + b.linesDeleted, 0);
    const totalDecisions = group.reduce((sum, s) => sum + (s.decisions || 0), 0);

    // Driver summary
    const driverSummary = { human: 0, ai: 0, collaborative: 0 };
    for (const b of blocks) {
      if (b.driver === 'human' || b.driver === 'human-only') driverSummary.human++;
      else if (b.driver === 'agent-led' || b.driver === 'ai') driverSummary.ai++;
      else if (b.driver === 'collaborative') driverSummary.collaborative++;
    }

    // Use first session's phase and chapterId as the day-level values
    const firstSession = group[0];
    const day = {
      date,
      title: group.length === 1 ? firstSession.label : undefined,
      projectId: project.id,
      phase: firstSession.phase || 'Build',
      chapterId: firstSession.chapterId || undefined,
      blocks,
      metrics: { totalTimeMinutes, linesAdded, linesDeleted, totalDecisions },
      driverSummary,
    };
    days.push(day);
  }

  // ── Generate TypeScript source for the Days array ─────────────

  const lines = [];
  lines.push('');
  lines.push(`/** Migrated from ${project.sessionsVar} — each Day groups sessions that share a date. */`);
  lines.push(`export const ${project.daysVar}: DayEntry[] = [`);

  for (const day of days) {
    lines.push(`  {`);
    lines.push(`    date: '${day.date}',`);
    if (day.title) lines.push(`    title: '${day.title.replace(/'/g, "\\'")}',`);
    lines.push(`    projectId: '${day.projectId}',`);
    lines.push(`    phase: '${day.phase}',`);
    if (day.chapterId) lines.push(`    chapterId: '${day.chapterId}',`);
    lines.push(`    blocks: [`);

    for (const b of day.blocks) {
      const notePart = b.note ? `, note: '${b.note.replace(/'/g, "\\'")}'` : '';
      lines.push(`      { id: '${b.id}', dayId: '${b.dayId}', label: '${b.label.replace(/'/g, "\\'")}', workCategory: '${b.workCategory}', driver: '${b.driver}', operator: '${b.operator}', timeMinutes: ${b.timeMinutes}, linesAdded: ${b.linesAdded}, linesDeleted: ${b.linesDeleted}${notePart}, contextWindowOrigin: false },`);
    }

    lines.push(`    ],`);
    lines.push(`    metrics: { totalTimeMinutes: ${day.metrics.totalTimeMinutes}, linesAdded: ${day.metrics.linesAdded}, linesDeleted: ${day.metrics.linesDeleted}, totalDecisions: ${day.metrics.totalDecisions} },`);
    lines.push(`    driverSummary: { human: ${day.driverSummary.human}, ai: ${day.driverSummary.ai}, collaborative: ${day.driverSummary.collaborative} },`);
    lines.push(`  },`);
  }

  lines.push(`];`);
  const daysSource = lines.join('\n');

  // ── Add DayEntry import if missing ────────────────────────────

  let updatedSource = source;
  if (!source.includes('DayEntry')) {
    updatedSource = `import type { DayEntry } from '../types/index';\n` + updatedSource;
  }

  // ── Append Days array to the file ─────────────────────────────

  updatedSource = updatedSource.trimEnd() + '\n' + daysSource + '\n';

  if (!DRY_RUN) {
    fs.writeFileSync(metricsPath, updatedSource, 'utf-8');
  }

  // ── Update chapters with chapterType: 'date-range' ───────────

  let chaptersUpdated = 0;
  if (fs.existsSync(projectPath)) {
    let projSource = fs.readFileSync(projectPath, 'utf-8');
    if (!projSource.includes("chapterType:")) {
      // Add chapterType: 'date-range' after each `tool:` line in chapter objects
      const updated = projSource.replace(
        /(\s+tool:\s*'[^']+'),?\s*\n(\s+nodes:)/g,
        `$1,\n      chapterType: 'date-range' as const,\n$2`
      );
      if (updated !== projSource) {
        chaptersUpdated = (updated.match(/chapterType:/g) || []).length;
        if (!DRY_RUN) {
          fs.writeFileSync(projectPath, updated, 'utf-8');
        }
      }
    }
  }

  return {
    skipped: false,
    sessionsCount: sessions.length,
    daysCount: days.length,
    blocksCount: days.reduce((sum, d) => sum + d.blocks.length, 0),
    chaptersUpdated,
  };
}

// ── Main ────────────────────────────────────────────────────────────

console.log(`\n📦 Meta Tracker Migration: Session → Day/Block`);
console.log(`   Mode: ${DRY_RUN ? 'DRY RUN (no files written)' : 'LIVE'}\n`);

let totalSessions = 0;
let totalDays = 0;
let totalBlocks = 0;
let totalChapters = 0;
let skippedCount = 0;

for (const project of PROJECTS) {
  console.log(`▸ ${project.id} (${project.metricsFile})`);
  const result = migrateProject(project);

  if (result.skipped) {
    skippedCount++;
  } else {
    totalSessions += result.sessionsCount;
    totalDays += result.daysCount;
    totalBlocks += result.blocksCount;
    totalChapters += result.chaptersUpdated;
    console.log(`  ✓ ${result.sessionsCount} sessions → ${result.daysCount} days (${result.blocksCount} blocks)`);
    if (result.chaptersUpdated > 0) {
      console.log(`  ✓ ${result.chaptersUpdated} chapters tagged as date-range`);
    }
  }
}

console.log(`\n─── Summary ───`);
console.log(`Sessions migrated: ${totalSessions}`);
console.log(`Days created:      ${totalDays}`);
console.log(`Work blocks:       ${totalBlocks}`);
console.log(`Chapters updated:  ${totalChapters}`);
console.log(`Projects skipped:  ${skippedCount}`);
console.log(`\nOriginal session arrays preserved (deprecated, not deleted).`);
if (DRY_RUN) console.log(`\n⚠  DRY RUN — no files were modified. Run without --dry-run to apply.`);
console.log('');
