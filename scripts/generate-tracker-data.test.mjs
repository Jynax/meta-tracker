import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  parseEpicFile,
  parseTaskFile,
  normalizeTask,
  validateEpic,
  validateTask,
  validateReferentialIntegrity,
  emit,
  walkDir,
} from './generate-tracker-data.mjs';

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tracker-gen-test-'));

function writeFixture(name, content) {
  const p = path.join(tmpDir, name);
  fs.writeFileSync(p, content, 'utf-8');
  return p;
}

test('parseEpicFile returns frontmatter + body', () => {
  const p = writeFixture('epic-test.md', `---
id: epic-test
project: meta
touches: []
title: Test Epic
status: Done
startDate: 2026-01-01
endDate: 2026-01-02
---

# Epic: Test

Body content here.
`);
  const result = parseEpicFile(p);
  assert.equal(result.id, 'epic-test');
  assert.equal(result.title, 'Test Epic');
  assert.equal(result.status, 'Done');
  assert.deepEqual(result.touches, []);
  assert.equal(result._source, p);
  assert.ok(result.body.includes('Body content here'));
});

test('parseTaskFile returns numeric id and preserves prose', () => {
  const p = writeFixture('task-test.md', `---
id: 42
project: meta
touches: []
epic: epic-test
title: Test task
status: Done
priority: High
outputs: [{ type: PR, ref: 999 }]
dates:
  created: 2026-01-01
  started: 2026-01-01
  completed: 2026-01-02
tool: claude-code
driver: collaborative
effort: { estimate: 1h, actual: 1h }
depends_on: []
decisions: []
events: []
---

# Task #42 — Test task

## Description

Some task prose.
`);
  const result = parseTaskFile(p);
  assert.equal(result.id, 42);
  assert.equal(result.title, 'Test task');
  assert.equal(result.epic, 'epic-test');
  assert.equal(result.outputs.length, 1);
  assert.equal(result.outputs[0].type, 'PR');
  assert.equal(result.outputs[0].ref, 999);
  assert.ok(result.body.includes('Some task prose'));
});

test('validateEpic passes on a valid epic', () => {
  const epic = {
    id: 'epic-test',
    project: 'meta',
    touches: [],
    title: 'Test',
    status: 'Done',
    startDate: '2026-01-01',
    endDate: '2026-01-02',
    _source: '/fake/path.md',
  };
  const errors = validateEpic(epic);
  assert.deepEqual(errors, []);
});

test('validateEpic errors on missing id', () => {
  const epic = {
    project: 'meta',
    touches: [],
    title: 'Test',
    status: 'Done',
    startDate: '2026-01-01',
    _source: '/fake/path.md',
  };
  const errors = validateEpic(epic);
  assert.equal(errors.length, 1);
  assert.match(errors[0], /id/);
  assert.match(errors[0], /fake\/path\.md/);
});

test('validateEpic errors on invalid status', () => {
  const epic = {
    id: 'epic-test',
    project: 'meta',
    touches: [],
    title: 'Test',
    status: 'Bogus',
    startDate: '2026-01-01',
    _source: '/fake/path.md',
  };
  const errors = validateEpic(epic);
  assert.equal(errors.length, 1);
  assert.match(errors[0], /status/);
});

test('validateTask passes on a valid task', () => {
  const task = {
    id: 42,
    project: 'meta',
    touches: [],
    epic: 'epic-test',
    title: 'Test',
    status: 'Done',
    priority: 'High',
    outputs: [{ type: 'PR', ref: 174 }],
    dates: { created: '2026-01-01', started: '2026-01-01', completed: '2026-01-02' },
    tool: 'claude-code',
    driver: 'collaborative',
    effort: { estimate: '1h', actual: '1h' },
    depends_on: [],
    decisions: [],
    events: [],
    _source: '/fake/path.md',
  };
  assert.deepEqual(validateTask(task), []);
});

test('validateTask permits null epic with a warning-class error prefix', () => {
  const task = {
    id: 97,
    project: 'meta',
    touches: [],
    epic: null,
    title: 'Orphan',
    status: 'Queued',
    priority: 'Medium',
    outputs: [],
    dates: { created: '2026-04-14', started: null, completed: null },
    tool: null,
    driver: null,
    effort: { estimate: null, actual: null },
    depends_on: [],
    decisions: [],
    events: [],
    _source: '/fake/path.md',
  };
  const errors = validateTask(task);
  assert.equal(errors.length, 1);
  assert.match(errors[0], /^WARN:/);
  assert.match(errors[0], /orphan|null epic/i);
});

test('validateTask errors on missing id', () => {
  const task = {
    project: 'meta',
    touches: [],
    epic: 'epic-test',
    title: 'Test',
    status: 'Done',
    priority: 'High',
    outputs: [],
    dates: { created: '2026-01-01', started: null, completed: null },
    tool: null,
    driver: null,
    effort: { estimate: null, actual: null },
    depends_on: [],
    decisions: [],
    events: [],
    _source: '/fake/path.md',
  };
  const errors = validateTask(task);
  assert.ok(errors.some(e => /id/.test(e) && !/^WARN:/.test(e)));
});

test('validateReferentialIntegrity passes when every task.epic resolves', () => {
  const epics = [{ id: 'epic-a' }, { id: 'epic-b' }];
  const tasks = [
    { id: 1, epic: 'epic-a', _source: '/t1.md' },
    { id: 2, epic: 'epic-b', _source: '/t2.md' },
    { id: 3, epic: null, _source: '/t3.md' },
  ];
  assert.deepEqual(validateReferentialIntegrity(epics, tasks), []);
});

test('validateReferentialIntegrity errors on dangling epic reference', () => {
  const epics = [{ id: 'epic-a' }];
  const tasks = [{ id: 1, epic: 'epic-ghost', _source: '/t1.md' }];
  const errors = validateReferentialIntegrity(epics, tasks);
  assert.equal(errors.length, 1);
  assert.match(errors[0], /epic-ghost/);
  assert.match(errors[0], /t1\.md/);
});

test('emit produces deterministic TypeScript with sorted epics and tasks', () => {
  const outputPath = path.join(tmpDir, 'out.ts');
  const epics = [
    { id: 'epic-b', project: 'meta', touches: [], title: 'B', status: 'Done', startDate: '2026-01-02', endDate: null, _source: '/b.md', body: 'ignored' },
    { id: 'epic-a', project: 'meta', touches: [], title: 'A', status: 'Done', startDate: '2026-01-01', endDate: null, _source: '/a.md', body: 'ignored' },
  ];
  // tasks arrive at emit post-normalization with string ids
  const tasks = [
    { id: 'meta-2', project: 'meta', touches: [], epic: 'epic-a', title: 'T2', status: 'Done', priority: 'Low', outputs: [], dates: { created: '2026-01-01', started: null, completed: null }, tool: null, driver: null, effort: { estimate: null, actual: null }, depends_on: [], decisions: [], events: [], _source: '/t2.md', body: 'ignored' },
    { id: 'meta-1', project: 'meta', touches: [], epic: 'epic-a', title: 'T1', status: 'Done', priority: 'Low', outputs: [], dates: { created: '2026-01-01', started: null, completed: null }, tool: null, driver: null, effort: { estimate: null, actual: null }, depends_on: [], decisions: [], events: [], _source: '/t1.md', body: 'ignored' },
  ];

  emit(epics, tasks, outputPath);
  const content = fs.readFileSync(outputPath, 'utf-8');

  assert.ok(content.includes('GENERATED — DO NOT EDIT'));
  assert.ok(content.includes("import type { Epic, Task } from '../types/tracker'"));
  assert.ok(content.includes('export const epics: Epic[]'));
  assert.ok(content.includes('export const tasks: Task[]'));
  // Epics sorted by id
  const aIdx = content.indexOf('"epic-a"');
  const bIdx = content.indexOf('"epic-b"');
  assert.ok(aIdx < bIdx, 'epic-a should appear before epic-b');
  // Tasks sorted by string id with numeric-aware collator
  const t1Idx = content.indexOf('"meta-1"');
  const t2Idx = content.indexOf('"meta-2"');
  assert.ok(t1Idx < t2Idx, 'meta-1 should appear before meta-2');
  // _source and body stripped
  assert.ok(!content.includes('_source'));
  assert.ok(!content.includes('"body":'));
});

test('emit sorts numeric-aware so meta-100 comes after meta-82', () => {
  const outputPath = path.join(tmpDir, 'out-numeric.ts');
  const tasks = [
    { id: 'meta-100', project: 'meta', touches: [], epic: null, title: 'T100', status: 'Done', priority: 'Low', outputs: [], dates: { created: '2026-01-01', started: null, completed: null }, tool: null, driver: null, effort: { estimate: null, actual: null }, depends_on: [], decisions: [], events: [] },
    { id: 'meta-82', project: 'meta', touches: [], epic: null, title: 'T82', status: 'Done', priority: 'Low', outputs: [], dates: { created: '2026-01-01', started: null, completed: null }, tool: null, driver: null, effort: { estimate: null, actual: null }, depends_on: [], decisions: [], events: [] },
  ];
  emit([], tasks, outputPath);
  const content = fs.readFileSync(outputPath, 'utf-8');
  const i82 = content.indexOf('"meta-82"');
  const i100 = content.indexOf('"meta-100"');
  assert.ok(i82 < i100, 'meta-82 should sort before meta-100 (numeric-aware)');
});

test('normalizeTask prefixes numeric id and depends_on with project namespace', () => {
  const raw = {
    id: 103,
    project: 'meta',
    touches: [],
    epic: 'epic-x',
    title: 'T',
    status: 'Done',
    priority: 'Medium',
    outputs: [],
    dates: { created: '2026-01-01', started: null, completed: null },
    tool: null,
    driver: null,
    effort: { estimate: null, actual: null },
    depends_on: [101, 102],
    decisions: [],
    events: [],
  };
  const out = normalizeTask(raw);
  assert.equal(out.id, 'meta-103');
  assert.deepEqual(out.depends_on, ['meta-101', 'meta-102']);
});

test('normalizeTask leaves pre-namespaced ids alone', () => {
  const raw = {
    id: 'shared-11',
    project: 'shared',
    touches: [],
    epic: 'epic-shared-x',
    title: 'T',
    status: 'Done',
    priority: 'Medium',
    outputs: [],
    dates: { created: '2026-01-01', started: null, completed: null },
    tool: null,
    driver: null,
    effort: { estimate: null, actual: null },
    depends_on: ['meta-50', 12],
    decisions: [],
    events: [],
  };
  const out = normalizeTask(raw);
  assert.equal(out.id, 'shared-11');
  // cross-project string dep passes through; numeric dep gets same-project prefix
  assert.deepEqual(out.depends_on, ['meta-50', 'shared-12']);
});

test('parseTaskFile returns null for files without frontmatter', () => {
  const p = writeFixture('no-frontmatter.md', '# Just a markdown heading\n\nNo YAML here.\n');
  assert.equal(parseTaskFile(p), null);
});

test('walkDir includes files from done/ subdirectory', (t) => {
  const tmpWalkDir = fs.mkdtempSync(path.join(os.tmpdir(), 'walkdir-done-'));
  const doneDir = path.join(tmpWalkDir, 'done');
  fs.mkdirSync(doneDir);
  fs.writeFileSync(path.join(tmpWalkDir, 'active.md'), '---\nid: 1\n---\n# Active');
  fs.writeFileSync(path.join(doneDir, 'completed.md'), '---\nid: 2\n---\n# Done');
  fs.writeFileSync(path.join(tmpWalkDir, 'index.md'), '# Index'); // should be skipped

  const files = walkDir(tmpWalkDir);
  const names = files.map(f => path.basename(f));

  assert.ok(names.includes('active.md'), 'should include active task');
  assert.ok(names.includes('completed.md'), 'should include done task');
  assert.ok(!names.includes('index.md'), 'should skip index.md');
  assert.strictEqual(files.length, 2);

  fs.rmSync(tmpWalkDir, { recursive: true });
});
