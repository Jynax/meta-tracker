#!/usr/bin/env node
// Data Model Rethink Phase 1 — tracker data generator.
// Reads epic + task markdown files with YAML frontmatter from the
// Co-work Projects directory and emits src/data/generated-tracker-data.ts.
// See Meta Tracker/specs/2026-04-14-data-model-rethink.md.

import matter from 'gray-matter';
import fs from 'node:fs';

export function parseEpicFile(filepath) {
  const raw = fs.readFileSync(filepath, 'utf-8');
  const { data, content } = matter(raw);
  return { ...data, body: content.trim(), _source: filepath };
}

export function parseTaskFile(filepath) {
  const raw = fs.readFileSync(filepath, 'utf-8');
  const { data, content } = matter(raw);
  return { ...data, body: content.trim(), _source: filepath };
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
  const sortedEpics = [...epics].sort((a, b) => a.id.localeCompare(b.id));
  const sortedTasks = [...tasks].sort((a, b) => a.id - b.id);

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
