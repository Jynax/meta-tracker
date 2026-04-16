#!/usr/bin/env node
// Phase 2 Task 3 — Backfill historical tasks from bold-markdown format
// to YAML frontmatter format compatible with generate-tracker-data.mjs.

import fs from 'node:fs';
import path from 'node:path';

// ── Lookup Maps ────────────────────────────────────────────────────

/** Task ID → Session number */
export const TASK_TO_SESSION = {
  1: 18, 3: 16, '3b': 22, 4: 16, 5: 19, 6: 17,
  9: 22, 10: 30, 11: 20, 12: 20, 13: 20, 14: 20, 15: 20, 16: 20,
  17: 27, 18: 35, 19: 27, 20: 22, 21: 23, 22: 23,
  23: 25, 24: 23, 25: 23, 26: 26, 27: 23, 28: 24, 29: 24,
  30: 29, 31: 25, 32: 23, 33: 26, 34: 26, 35: 26, 36: 26, 37: 26,
  38: 27, 39: 27, 40: 29, 41: 28, 42: 32, 43: 30,
  44: 30, 45: 27, 46: 31, 47: 31, 48: 32, 49: 34,
  50: 32, 51: 32, 52: 32, 53: 32, 54: 37, 55: 37, 56: 37, 57: 37,
  58: 40, 59: 39, 60: 39, 61: 39, 62: 39, 63: 39, 64: 39,
  66: 40, 68: 47, 69: 47, 70: 48, 71: 48, 72: 48,
  73: 48, 74: 48, 75: 48, 76: 49, 77: 49, 78: 49, 79: 49,
  81: 70, 82: 70, 83: 71, 85: 76, 86: 85, 89: 81,
  90: '82a', 91: '89d', 92: '82a', 94: 85, 95: 85,
  99: '89d', 100: '89d', 101: 90,
};

/** Session number → chapterId */
export const SESSION_TO_CHAPTER = {
  'Pre-Tracking A': 'meta-ch-inception',
  'Pre-Tracking B': 'meta-ch-inception',
  1: 'meta-ch-inception',
  2: 'meta-ch-horizontal',
  3: 'meta-ch-horizontal',
  4: 'meta-ch-layout-overhaul',
  5: 'meta-ch-spacing-wars',
  7: 'meta-ch-data-alignment',
  8: 'meta-ch-spine-dashboard',
  9: 'meta-ch-ux-polish',
  10: 'meta-ch-ux-polish',
  11: 'meta-ch-ux-polish',
  12: 'meta-ch-dashboard-data-overhaul',
  13: 'meta-ch-stacked-tree-view',
  14: 'meta-ch-ux-final-pass',
  15: 'meta-ch-how-we-work',
  16: 'meta-ch-process-overhaul',
  17: 'meta-ch-mojibake-fix',
  18: 'meta-ch-process-overhaul',
  19: 'meta-ch-process-overhaul',
  20: 'meta-ch-process-overhaul',
  22: 'meta-ch-process-overhaul',
  23: 'meta-ch-process-overhaul',
  24: 'meta-ch-process-overhaul',
  25: 'meta-ch-process-overhaul',
  26: 'meta-ch-process-overhaul',
  27: 'meta-ch-process-overhaul',
  28: 'meta-ch-process-overhaul',
  29: 'meta-ch-process-overhaul',
  30: 'meta-ch-process-overhaul',
  31: 'meta-ch-process-overhaul',
  32: 'meta-ch-process-overhaul',
  34: 'meta-ch-process-overhaul',
  35: 'meta-ch-playwright-testing',
  37: 'meta-ch-playwright-testing',
  39: 'meta-ch-process-overhaul',
  40: 'meta-ch-process-overhaul',
  41: 'meta-ch-process-overhaul',
  43: 'meta-ch-time-machine-data-model',
  44: 'meta-ch-time-machine-data-model',
  45: 'meta-ch-time-machine-data-model',
  46: 'meta-ch-time-machine-data-model',
  47: 'meta-ch-time-machine-data-model',
  48: 'meta-ch-time-machine-data-model',
  49: 'meta-ch-time-machine-data-model',
  50: 'meta-ch-time-machine-data-model',
  52: 'meta-ch-time-machine-data-model',
  53: 'meta-ch-time-machine-data-model',
  58: 'meta-ch-time-machine-data-model',
  62: 'meta-ch-time-machine-data-model',
  '62b': 'meta-ch-time-machine-data-model',
  70: 'meta-ch-time-machine-data-model',
  71: 'meta-ch-time-machine-data-model',
  72: 'meta-ch-time-machine-data-model',
  73: 'meta-ch-time-machine-data-model',
  74: 'meta-ch-time-machine-data-model',
  75: 'meta-ch-time-machine-data-model',
  76: 'meta-ch-time-machine-data-model',
  77: 'meta-ch-time-machine-data-model',
  78: 'meta-ch-time-machine-data-model',
  '79a': 'meta-ch-time-machine-data-model',
  '79b': 'meta-ch-time-machine-data-model',
  '79c': 'meta-ch-time-machine-data-model',
  81: 'meta-ch-time-machine-data-model',
  '82a': 'meta-ch-time-machine-data-model',
  '82b': 'meta-ch-time-machine-data-model',
  85: 'meta-ch-time-machine-data-model',
  '86a': 'meta-ch-time-machine-data-model',
  '86b': 'meta-ch-time-machine-data-model',
  88: 'meta-ch-decision-tree-completeness',
  '89a': 'meta-ch-decision-tree-completeness',
  '89b': 'meta-ch-decision-tree-completeness',
  '89c': 'meta-ch-decision-tree-completeness',
  '89d': 'meta-ch-decision-tree-completeness',
  90: 'meta-ch-decision-tree-completeness',
  91: 'meta-ch-decision-tree-completeness',
};

/** chapterId → epicId */
export const CHAPTER_TO_EPIC = {
  'meta-ch-inception': 'epic-meta-inception',
  'meta-ch-horizontal': 'epic-meta-inception',
  'meta-ch-layout-overhaul': 'epic-meta-layout-wars',
  'meta-ch-spacing-wars': 'epic-meta-layout-wars',
  'meta-ch-data-alignment': 'epic-meta-layout-wars',
  'meta-ch-spine-dashboard': 'epic-meta-dashboard-stacked',
  'meta-ch-ux-polish': 'epic-meta-dashboard-stacked',
  'meta-ch-dashboard-data-overhaul': 'epic-meta-dashboard-stacked',
  'meta-ch-stacked-tree-view': 'epic-meta-dashboard-stacked',
  'meta-ch-ux-final-pass': 'epic-meta-dashboard-stacked',
  'meta-ch-how-we-work': 'epic-meta-dashboard-stacked',
  'meta-ch-process-overhaul': 'epic-meta-process-foundation',
  'meta-ch-mojibake-fix': 'epic-meta-process-foundation',
  'meta-ch-cli-migration': 'epic-meta-process-foundation',
  'meta-ch-all-prs-workflow': 'epic-meta-process-foundation',
  'meta-ch-engineering-foundation': 'epic-meta-process-foundation',
  'meta-ch-playwright-testing': 'epic-meta-process-foundation',
  'meta-ch-bug-sweep': 'epic-meta-process-foundation',
  'meta-ch-sc-theme-a11y': 'epic-meta-process-foundation',
  'meta-ch-time-machine-data-model': 'epic-meta-day-block-v1',
  'meta-ch-day-block-migration': 'epic-meta-day-block-v1',
  'meta-ch-ux-brief-complete': 'epic-meta-day-block-v1',
  'meta-ch-v1-shipped': 'epic-meta-day-block-v1',
  'meta-ch-ux-data-fixes': 'epic-meta-ux-data-fixes',
  'meta-ch-design-polish': 'epic-meta-design-polish',
  'meta-ch-insights-redesign': 'epic-meta-insights-redesign',
  'meta-ch-decision-tree-completeness': 'epic-meta-canvas-mindmap-retired',
  'meta-ch-project-milestones': 'epic-shared-project-milestones',
  'meta-ch-dep-migration': 'epic-shared-infra-dep-migration',
  'meta-ch-nw-sprint': 'epic-meta-insights-redesign',
  'meta-ch-loc-audit-insights': 'epic-meta-insights-redesign',
  'meta-ch-cross-cutting-infra': 'epic-shared-infra-dep-migration',
  'meta-ch-data-viz-pat-audit': 'epic-meta-insights-redesign',
};

// ── Month Lookup ───────────────────────────────────────────────────

const MONTHS = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
  january: 0, february: 1, march: 2, april: 3,
  june: 5, july: 6, august: 7, september: 8,
  october: 9, november: 10, december: 11,
};

// ── normalizeDate ──────────────────────────────────────────────────

/**
 * Convert various date formats to YYYY-MM-DD.
 * @param {string|null} dateStr
 * @returns {string|null}
 */
export function normalizeDate(dateStr) {
  if (dateStr == null) return null;

  let s = String(dateStr).trim();

  // Strip parenthetical suffixes like "(Session 18)"
  s = s.replace(/\s*\(.*\)\s*$/, '').trim();

  // Already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;

  // "Mar 8, 2026" or "March 4, 2026"
  const fullMatch = s.match(/^([A-Za-z]+)\s+(\d{1,2}),?\s+(\d{4})$/);
  if (fullMatch) {
    const monthIdx = MONTHS[fullMatch[1].toLowerCase()];
    if (monthIdx != null) {
      const day = String(fullMatch[2]).padStart(2, '0');
      const month = String(monthIdx + 1).padStart(2, '0');
      return `${fullMatch[3]}-${month}-${day}`;
    }
  }

  // "Mar 4" (no year — default 2026)
  const shortMatch = s.match(/^([A-Za-z]+)\s+(\d{1,2})$/);
  if (shortMatch) {
    const monthIdx = MONTHS[shortMatch[1].toLowerCase()];
    if (monthIdx != null) {
      const day = String(shortMatch[2]).padStart(2, '0');
      const month = String(monthIdx + 1).padStart(2, '0');
      return `2026-${month}-${day}`;
    }
  }

  return s; // best-effort passthrough
}

// ── mapTool ────────────────────────────────────────────────────────

const TOOL_MAP = {
  'claude code': 'claude-code',
  cowork: 'cowork',
  codex: 'cowork',
  mixed: 'mixed',
  manual: 'manual',
};

/**
 * Map executedBy strings to tool enum values.
 * @param {string|null} executedBy
 * @returns {string|null}
 */
export function mapTool(executedBy) {
  if (executedBy == null) return null;
  return TOOL_MAP[String(executedBy).toLowerCase().trim()] ?? null;
}

// ── resolveEpic ────────────────────────────────────────────────────

/**
 * Resolve task ID → session → chapter → epic.
 * @param {number|string} taskId
 * @returns {string|null}
 */
export function resolveEpic(taskId) {
  const session = TASK_TO_SESSION[taskId];
  if (session == null) return null;

  const chapter = SESSION_TO_CHAPTER[session];
  if (chapter == null) return null;

  return CHAPTER_TO_EPIC[chapter] ?? null;
}

// ── normalizeStatus ────────────────────────────────────────────────

const VALID_STATUSES = new Set(['Queued', 'In Progress', 'Blocked', 'Done', 'Cancelled', 'Retired']);
const STATUS_MAP = {
  complete: 'Done',
  completed: 'Done',
  finished: 'Done',
  closed: 'Done',
  'to do': 'Queued',
  todo: 'Queued',
  pending: 'Queued',
  open: 'Queued',
  active: 'In Progress',
  wip: 'In Progress',
  blocked: 'Blocked',
  cancelled: 'Cancelled',
  canceled: 'Cancelled',
  retired: 'Retired',
};

/**
 * Normalize status strings to valid TaskStatus enum values.
 * @param {string} status
 * @returns {string}
 */
export function normalizeStatus(status) {
  if (!status) return 'Queued';
  const trimmed = status.trim();
  if (VALID_STATUSES.has(trimmed)) return trimmed;
  return STATUS_MAP[trimmed.toLowerCase()] ?? trimmed;
}

// ── normalizePriority ──────────────────────────────────────────────

/**
 * Strip parenthetical notes from priority values.
 * @param {string} priority
 * @returns {string}
 */
export function normalizePriority(priority) {
  if (!priority) return 'Medium';
  return priority.replace(/\s*\(.*\)\s*$/, '').trim();
}

// ── escapeYaml ─────────────────────────────────────────────────────

const YAML_SPECIAL = /[:#\[\]{}&*!|>'"%@`]/;

/**
 * Wrap strings in double quotes if they contain YAML-special characters.
 * @param {string} str
 * @returns {string}
 */
export function escapeYaml(str) {
  if (!str) return str;
  if (YAML_SPECIAL.test(str)) {
    // Escape existing double quotes
    return `"${str.replace(/"/g, '\\"')}"`;
  }
  return str;
}

// ── parseBoldMarkdown ──────────────────────────────────────────────

/**
 * Parse old-format task files (bold-markdown headers) into structured data.
 * @param {string} content
 * @returns {object}
 */
export function parseBoldMarkdown(content) {
  const lines = content.split('\n');

  let id = null;
  let title = '';
  let status = null;
  let priority = null;
  let created = null;
  let started = null;
  let completed = null;
  let executedBy = null;
  let prs = [];
  let dependsOn = [];
  let bodyStartIdx = -1;

  // Parse H1
  const h1Match = lines[0]?.match(/^#\s+Task\s+#(\d+)\s*[—–-]\s*(.+)$/);
  if (h1Match) {
    id = parseInt(h1Match[1], 10);
    title = h1Match[2].trim();
  } else {
    const h1AltMatch = lines[0]?.match(/^#\s+Task:\s*(.+)$/);
    if (h1AltMatch) {
      title = h1AltMatch[1].trim();
    }
  }

  // Parse fields and find body start
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];

    // Body starts at first ## heading or ---
    if (/^##\s/.test(line) || /^---\s*$/.test(line)) {
      bodyStartIdx = i;
      break;
    }

    // Match **Field:** Value or - **Field:** Value
    // Handles both **Field:** Value (colon inside bold) and **Field**: Value (colon outside)
    const fieldMatch = line.match(/^(?:-\s*)?\*\*([^*:]+):?\*\*:?\s*(.*)$/);
    if (fieldMatch) {
      const key = fieldMatch[1].trim().toLowerCase();
      const val = fieldMatch[2].trim() || null;

      switch (key) {
        case 'status':
          status = val;
          break;
        case 'priority':
          priority = val;
          break;
        case 'created':
          created = val;
          break;
        case 'started':
          started = val;
          break;
        case 'completed':
          completed = val;
          break;
        case 'executed by':
          executedBy = val;
          break;
        case 'pr':
          if (val) {
            const prMatches = val.matchAll(/#(\d+)/g);
            for (const m of prMatches) {
              prs.push(parseInt(m[1], 10));
            }
          }
          break;
        case 'depends on':
          if (val) {
            const depMatches = val.matchAll(/#(\d+)/g);
            for (const m of depMatches) {
              dependsOn.push(parseInt(m[1], 10));
            }
          }
          break;
      }
    }
  }

  // Extract body
  let body = '';
  if (bodyStartIdx >= 0) {
    body = lines.slice(bodyStartIdx).join('\n').trim();
  }

  return { id, title, status, priority, created, started, completed, executedBy, prs, dependsOn, body };
}

// ── buildYamlFrontmatter ──────────────────────────────────────────

/**
 * Build a complete YAML frontmatter file from parsed task data.
 * The parsed object should already have normalized dates, mapped tool, and resolved epic.
 * @param {object} parsed — { id, title, status, priority, created, started, completed,
 *                            executedBy (already mapped tool string), prs, dependsOn, body, epic }
 * @returns {string}
 */
export function buildYamlFrontmatter(parsed) {
  const {
    id,
    title,
    status,
    priority,
    created,
    started,
    completed,
    executedBy,
    prs,
    dependsOn,
    body,
    epic,
  } = parsed;

  const yamlId = id != null ? id : '~';
  const yamlEpic = epic ?? '~';
  const yamlTitle = escapeYaml(title);
  const yamlStatus = normalizeStatus(status);
  const yamlPriority = normalizePriority(priority);
  const yamlTool = executedBy ?? '~';

  // Outputs
  let outputsLine;
  if (!prs || prs.length === 0) {
    outputsLine = 'outputs: []';
  } else {
    const items = prs.map(pr => `  - { type: PR, ref: ${pr} }`).join('\n');
    outputsLine = `outputs:\n${items}`;
  }

  // Dates — quote YYYY-MM-DD so YAML doesn't interpret as Date objects
  const fmtDate = (d) => d ? `"${d}"` : '~';

  // Depends_on
  let dependsLine;
  if (!dependsOn || dependsOn.length === 0) {
    dependsLine = 'depends_on: []';
  } else {
    const items = dependsOn.map(d => `  - ${d}`).join('\n');
    dependsLine = `depends_on:\n${items}`;
  }

  // Title line for the body section
  const titleHeading = id != null
    ? `# Task #${id} — ${title}`
    : `# Task: ${title}`;

  const frontmatter = `---
id: ${yamlId}
project: meta
touches: []
epic: ${yamlEpic}
title: ${yamlTitle}
status: ${yamlStatus}
priority: ${yamlPriority}
${outputsLine}
dates:
  created: ${fmtDate(created)}
  started: ${fmtDate(started)}
  completed: ${fmtDate(completed)}
tool: ${yamlTool}
driver: ~
effort: { estimate: ~, actual: ~ }
${dependsLine}
decisions: []
events: []
---

${titleHeading}

${body}
`.trimEnd() + '\n';

  return frontmatter;
}

// ── convertDoneTaskFile ────────────────────────────────────────────

/**
 * Convert a single done/ task file from bold-markdown to YAML frontmatter.
 * Returns the file content unchanged if it already has YAML frontmatter.
 * @param {string} filepath — absolute path to the .md file
 * @returns {string}
 */
export function convertDoneTaskFile(filepath) {
  const content = fs.readFileSync(filepath, 'utf-8');

  // Skip files that already have YAML frontmatter
  if (content.trimStart().startsWith('---')) {
    return content;
  }

  // Extract ID from filename if not in H1
  const filename = path.basename(filepath, '.md');
  const fileIdMatch = filename.match(/^(\d+)/);

  const parsed = parseBoldMarkdown(content);

  // Use filename ID as fallback
  if (parsed.id === null && fileIdMatch) {
    parsed.id = parseInt(fileIdMatch[1], 10);
  }

  // Enrich with resolved epic and normalized dates/tool
  parsed.epic = resolveEpic(parsed.id);
  parsed.created = normalizeDate(parsed.created);
  parsed.started = normalizeDate(parsed.started);
  parsed.completed = normalizeDate(parsed.completed);
  parsed.executedBy = mapTool(parsed.executedBy);

  return buildYamlFrontmatter(parsed);
}

// ── main (CLI entry point) ─────────────────────────────────────────

const COWORK_ROOT = process.env.COWORK_ROOT || 'C:/Users/jynax/Downloads/Co-work Projects';

function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const mode = args.includes('--convert-done') ? 'convert-done'
             : args.includes('--create-historical') ? 'create-historical'
             : args.includes('--all') ? 'all'
             : null;

  if (!mode) {
    console.log('Usage: node backfill-historical-tasks.mjs [--convert-done|--create-historical|--all] [--dry-run]');
    process.exit(1);
  }

  const doneDir = path.join(COWORK_ROOT, 'Meta Tracker', 'tasks', 'done');

  if (mode === 'convert-done' || mode === 'all') {
    console.log(`Converting done task files in ${doneDir}...`);
    const files = fs.readdirSync(doneDir).filter(f => f.match(/^\d+.*\.md$/));
    let converted = 0, skipped = 0, errors = 0;

    for (const file of files) {
      const filepath = path.join(doneDir, file);
      try {
        const content = fs.readFileSync(filepath, 'utf-8');
        if (content.trimStart().startsWith('---')) {
          skipped++;
          continue;
        }
        const result = convertDoneTaskFile(filepath);
        if (dryRun) {
          console.log(`  [dry-run] Would convert: ${file}`);
        } else {
          fs.writeFileSync(filepath, result, 'utf-8');
          console.log(`  Converted: ${file}`);
        }
        converted++;
      } catch (err) {
        console.error(`  ERROR converting ${file}: ${err.message}`);
        errors++;
      }
    }
    console.log(`Done: ${converted} converted, ${skipped} already YAML, ${errors} errors`);
  }
}

// Only run main() when invoked directly
if (import.meta.url === `file://${process.argv[1]}` || import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  main();
}
