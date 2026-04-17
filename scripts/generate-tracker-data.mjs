#!/usr/bin/env node
// Data Model Rethink Phase 1 — tracker data generator.
// Reads epic + task markdown files with YAML frontmatter from the
// Co-work Projects directory and emits src/data/generated-tracker-data.ts.
// See Meta Tracker/specs/2026-04-14-data-model-rethink.md.

import matter from 'gray-matter';
import fs from 'node:fs';
import path from 'node:path';

export function parseEpicFile(filepath) {
  const raw = fs.readFileSync(filepath, 'utf-8');
  const { data, content } = matter(raw);
  return { ...data, body: content.trim(), _source: filepath };
}

export function parseTaskFile(filepath) {
  const raw = fs.readFileSync(filepath, 'utf-8');
  const { data, content } = matter(raw);
  // Skip files without YAML frontmatter (legacy shared-task format).
  // YAML-ify a task file to include it in the generated tracker data.
  if (!data || Object.keys(data).length === 0) return null;
  return { ...data, body: content.trim(), _source: filepath };
}

// Normalize task IDs and depends_on to namespaced strings.
// Frontmatter may have `id: 103` (number) or `id: "meta-103"` (pre-namespaced) — both accepted.
// Output always has `id: "${project}-${rawId}"` and `depends_on: string[]`.
// Numeric depends_on entries are assumed same-project (common case); cross-project refs must be pre-stringified in frontmatter.
export function normalizeTask(t) {
  if (!t) return t;
  const rawId = t.id;
  const project = t.project;
  if (rawId == null || project == null) return t; // let validation catch
  const idStr = String(rawId);
  const id = idStr.startsWith(`${project}-`) ? idStr : `${project}-${idStr}`;
  const depends_on = Array.isArray(t.depends_on)
    ? t.depends_on.map((d) => (typeof d === 'string' ? d : `${project}-${d}`))
    : t.depends_on;
  return { ...t, id, depends_on };
}
const EPIC_REQUIRED = ['id', 'project', 'touches', 'title', 'status', 'startDate'];
const VALID_EPIC_STATUS = new Set(['Queued', 'In Progress', 'Done', 'Cancelled', 'Retired']);

export function validateEpic(epic) {
  const errors = [];
  const src = epic._source || '<unknown>';
  for (const field of EPIC_REQUIRED) {
    if (!(field in epic)) errors.push(`Missing required field '${field}' in ${src}`);
  }
  if (epic.status && !VALID_EPIC_STATUS.has(epic.status)) {
    errors.push(`Invalid status '${epic.status}' in ${src}`);
  }
  return errors;
}
const TASK_REQUIRED = ['id', 'project', 'touches', 'title', 'status', 'priority', 'outputs', 'dates', 'depends_on', 'decisions', 'events'];
const VALID_TASK_STATUS = new Set(['Queued', 'In Progress', 'Blocked', 'Done', 'Cancelled', 'Retired']);
const VALID_PRIORITY = new Set(['Low', 'Medium', 'High', 'Critical']);

export function validateTask(task) {
  const errors = [];
  const src = task._source || '<unknown>';
  for (const field of TASK_REQUIRED) {
    if (!(field in task)) errors.push(`Missing required field '${field}' in ${src}`);
  }
  if (task.status && !VALID_TASK_STATUS.has(task.status)) {
    errors.push(`Invalid status '${task.status}' in ${src}`);
  }
  if (task.priority && !VALID_PRIORITY.has(task.priority)) {
    errors.push(`Invalid priority '${task.priority}' in ${src}`);
  }
  if (task.epic === null || task.epic === undefined) {
    errors.push(`WARN: task ${task.id ?? '<no-id>'} has null epic (orphan) in ${src}`);
  }
  return errors;
}
export function validateReferentialIntegrity(epics, tasks) {
  const errors = [];
  const epicIds = new Set(epics.map(e => e.id));
  for (const t of tasks) {
    if (t.epic && !epicIds.has(t.epic)) {
      errors.push(`Task ${t.id} references unknown epic '${t.epic}' in ${t._source ?? '<unknown>'}`);
    }
  }
  return errors;
}
export function emit(epics, tasks, outputPath) {
  const generatedAt = new Date().toISOString();
  const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
  const sortedEpics = [...epics].sort((a, b) => collator.compare(a.id, b.id));
  const sortedTasks = [...tasks].sort((a, b) => collator.compare(a.id, b.id));

  const stripInternal = (obj) => {
    // eslint-disable-next-line no-unused-vars
    const { _source, body, ...rest } = obj;
    return rest;
  };

  const cleanEpics = sortedEpics.map(stripInternal);
  const cleanTasks = sortedTasks.map(stripInternal);

  const content = `// GENERATED — DO NOT EDIT
// Run 'npm run generate:data' from the repo root to regenerate.
// Source: Co-work Projects/{Meta Tracker,_Shared}/{epics,tasks}
// See specs/2026-04-14-data-model-rethink.md.
import type { Epic, Task } from '../types/tracker';

export const generatedAt: string = ${JSON.stringify(generatedAt)};

export const epics: Epic[] = ${JSON.stringify(cleanEpics, null, 2)};

export const tasks: Task[] = ${JSON.stringify(cleanTasks, null, 2)};
`;
  fs.writeFileSync(outputPath, content, 'utf-8');
  return content;
}

const COWORK_ROOT = process.env.COWORK_ROOT || 'C:/Users/jynax/Downloads/Co-work Projects';

export function walkDir(dir, pattern = /\.md$/, nameFilter = null) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      files.push(...walkDir(full, pattern, nameFilter));
    } else if (pattern.test(e.name) && e.name !== 'index.md' && (!nameFilter || nameFilter.test(e.name))) {
      files.push(full);
    }
  }
  return files;
}

export function collectEpics() {
  const epicFiles = [
    ...walkDir(path.join(COWORK_ROOT, 'Meta Tracker', 'epics')),
    ...walkDir(path.join(COWORK_ROOT, '_Shared', 'epics')),
  ];
  return epicFiles.map(parseEpicFile);
}

export function collectTasks() {
  const mtTaskFiles = walkDir(path.join(COWORK_ROOT, 'Meta Tracker', 'tasks'), /\.md$/, /^\d/);
  const sharedTaskFiles = walkDir(path.join(COWORK_ROOT, '_Shared', 'tasks-general'), /\.md$/, /^\d/);
  return [...mtTaskFiles, ...sharedTaskFiles]
    .map(parseTaskFile)
    .filter(Boolean)
    .map(normalizeTask);
}

function main() {
  const args = process.argv.slice(2);
  const verify = args.includes('--verify');

  const epics = collectEpics();
  const tasks = collectTasks();

  const blockers = [];
  const warnings = [];
  for (const e of epics) {
    for (const err of validateEpic(e)) {
      (err.startsWith('WARN:') ? warnings : blockers).push(err);
    }
  }
  for (const t of tasks) {
    for (const err of validateTask(t)) {
      (err.startsWith('WARN:') ? warnings : blockers).push(err);
    }
  }
  for (const err of validateReferentialIntegrity(epics, tasks)) {
    blockers.push(err);
  }

  if (warnings.length > 0) {
    console.warn('Warnings:');
    for (const w of warnings) console.warn(`  ${w}`);
  }

  if (blockers.length > 0) {
    console.error('Validation errors:');
    for (const err of blockers) console.error(`  ${err}`);
    process.exit(1);
  }

  const outputPath = 'src/data/generated-tracker-data.ts';

  if (verify) {
    const existing = fs.existsSync(outputPath) ? fs.readFileSync(outputPath, 'utf-8') : '';
    const tempPath = outputPath + '.verify-tmp';
    emit(epics, tasks, tempPath);
    const fresh = fs.readFileSync(tempPath, 'utf-8');
    fs.unlinkSync(tempPath);

    const normalize = (s) => s.replace(/generatedAt: string = "[^"]*"/, 'generatedAt: string = "NORMALIZED"');

    if (normalize(existing) === normalize(fresh)) {
      console.log('✓ generated-tracker-data.ts is up to date');
      process.exit(0);
    } else {
      console.error('✗ generated-tracker-data.ts is stale. Run `npm run generate:data` and commit.');
      process.exit(1);
    }
  }

  emit(epics, tasks, outputPath);
  console.log(`✓ Wrote ${outputPath} (${epics.length} epics, ${tasks.length} tasks, ${warnings.length} warnings)`);
}

// Only run main() when invoked directly, not when imported by tests
const __argv1 = process.argv[1];
if (__argv1 && (import.meta.url === `file://${__argv1}` || import.meta.url === `file:///${__argv1.replace(/\\/g, '/')}`)) {
  main();
}
