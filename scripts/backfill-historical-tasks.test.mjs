#!/usr/bin/env node
// Unit tests for backfill-historical-tasks.mjs
// Phase 2 Task 3 — node:test + node:assert

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  parseBoldMarkdown,
  normalizeDate,
  mapTool,
  resolveEpic,
  buildYamlFrontmatter,
  normalizeStatus,
  normalizePriority,
  escapeYaml,
  convertDoneTaskFile,
  TASK_TO_SESSION,
  SESSION_TO_CHAPTER,
  CHAPTER_TO_EPIC,
} from './backfill-historical-tasks.mjs';

// ── parseBoldMarkdown ──────────────────────────────────────────────

describe('parseBoldMarkdown', () => {
  it('parses standard **Field:** Value format', () => {
    const content = `# Task #48 — Add Designer Credit to Header

**Status:** Done
**Priority:** Low
**Created:** Mar 8, 2026
**Started:** Mar 8, 2026
**Completed:** Mar 9, 2026
**Executed by:** Claude Code
**PR:** #78 (merged)

---

## Brief
Some body prose here.
`;
    const result = parseBoldMarkdown(content);
    assert.equal(result.id, 48);
    assert.equal(result.title, 'Add Designer Credit to Header');
    assert.equal(result.status, 'Done');
    assert.equal(result.priority, 'Low');
    assert.equal(result.created, 'Mar 8, 2026');
    assert.equal(result.started, 'Mar 8, 2026');
    assert.equal(result.completed, 'Mar 9, 2026');
    assert.equal(result.executedBy, 'Claude Code');
    assert.deepEqual(result.prs, [78]);
    assert.ok(result.body.includes('## Brief'));
  });

  it('parses list-style - **Field:** Value format', () => {
    const content = `# Task #30 — Refine Session Summary

- **Status:** Done
- **Priority:** Medium
- **Created:** Mar 4, 2026
- **Executed by:** Claude Code
- **PR:** #52

## Details
Body text.
`;
    const result = parseBoldMarkdown(content);
    assert.equal(result.id, 30);
    assert.equal(result.title, 'Refine Session Summary');
    assert.equal(result.status, 'Done');
    assert.equal(result.priority, 'Medium');
    assert.deepEqual(result.prs, [52]);
    assert.ok(result.body.includes('## Details'));
  });

  it('parses # Task: Title format (no numeric ID)', () => {
    const content = `# Task: Fix Alignment Bug

**Status:** In Progress
**Priority:** High

## Notes
Something here.
`;
    const result = parseBoldMarkdown(content);
    assert.equal(result.id, null);
    assert.equal(result.title, 'Fix Alignment Bug');
    assert.equal(result.status, 'In Progress');
    assert.equal(result.priority, 'High');
  });
});

// ── normalizeDate ──────────────────────────────────────────────────

describe('normalizeDate', () => {
  it('passes through YYYY-MM-DD', () => {
    assert.equal(normalizeDate('2026-03-08'), '2026-03-08');
  });

  it('converts Mar 8, 2026', () => {
    assert.equal(normalizeDate('Mar 8, 2026'), '2026-03-08');
  });

  it('converts March 4, 2026', () => {
    assert.equal(normalizeDate('March 4, 2026'), '2026-03-04');
  });

  it('strips (Session 18) suffix', () => {
    assert.equal(normalizeDate('March 4, 2026 (Session 18)'), '2026-03-04');
  });

  it('handles Mar 4 without year (defaults 2026)', () => {
    assert.equal(normalizeDate('Mar 4'), '2026-03-04');
  });

  it('returns null for null input', () => {
    assert.equal(normalizeDate(null), null);
  });
});

// ── mapTool ────────────────────────────────────────────────────────

describe('mapTool', () => {
  it('maps Claude Code → claude-code', () => {
    assert.equal(mapTool('Claude Code'), 'claude-code');
  });

  it('maps Cowork → cowork', () => {
    assert.equal(mapTool('Cowork'), 'cowork');
  });

  it('returns null for null', () => {
    assert.equal(mapTool(null), null);
  });

  it('maps Codex → cowork', () => {
    assert.equal(mapTool('Codex'), 'cowork');
  });

  it('maps Mixed → mixed', () => {
    assert.equal(mapTool('Mixed'), 'mixed');
  });

  it('maps Manual → manual', () => {
    assert.equal(mapTool('Manual'), 'manual');
  });

  it('is case-insensitive', () => {
    assert.equal(mapTool('claude code'), 'claude-code');
    assert.equal(mapTool('COWORK'), 'cowork');
  });
});

// ── resolveEpic ────────────────────────────────────────────────────

describe('resolveEpic', () => {
  it('task 20 → epic-meta-process-foundation', () => {
    assert.equal(resolveEpic(20), 'epic-meta-process-foundation');
  });

  it('task 83 → epic-meta-day-block-v1', () => {
    assert.equal(resolveEpic(83), 'epic-meta-day-block-v1');
  });

  it('returns null for unknown task', () => {
    assert.equal(resolveEpic(9999), null);
  });
});

// ── buildYamlFrontmatter ──────────────────────────────────────────

describe('buildYamlFrontmatter', () => {
  it('produces valid YAML with all fields', () => {
    const parsed = {
      id: 48,
      title: 'Add Designer Credit to Header',
      status: 'Done',
      priority: 'Low',
      created: '2026-03-08',
      started: '2026-03-08',
      completed: '2026-03-09',
      executedBy: 'claude-code',
      prs: [78],
      dependsOn: [],
      body: '## Brief\nSome body prose here.',
      epic: 'epic-meta-process-foundation',
    };
    const result = buildYamlFrontmatter(parsed);

    // Check frontmatter markers
    assert.ok(result.startsWith('---\n'));
    assert.ok(result.includes('\n---\n'));

    // Check key fields
    assert.ok(result.includes('id: 48'));
    assert.ok(result.includes('project: meta'));
    assert.ok(result.includes('epic: epic-meta-process-foundation'));
    assert.ok(result.includes('title: Add Designer Credit to Header'));
    assert.ok(result.includes('status: Done'));
    assert.ok(result.includes('priority: Low'));
    assert.ok(result.includes('tool: claude-code'));
    assert.ok(result.includes('created: "2026-03-08"'));
    assert.ok(result.includes('started: "2026-03-08"'));
    assert.ok(result.includes('completed: "2026-03-09"'));
    assert.ok(result.includes('{ type: PR, ref: 78 }'));
    assert.ok(result.includes('driver: ~'));
    assert.ok(result.includes('effort: { estimate: ~, actual: ~ }'));
    assert.ok(result.includes('depends_on: []'));
    assert.ok(result.includes('decisions: []'));
    assert.ok(result.includes('events: []'));

    // Check body after frontmatter
    assert.ok(result.includes('# Task #48 — Add Designer Credit to Header'));
    assert.ok(result.includes('## Brief'));
  });

  it('handles null fields correctly with ~', () => {
    const parsed = {
      id: null,
      title: 'No ID Task',
      status: 'Queued',
      priority: 'Medium',
      created: '2026-03-01',
      started: null,
      completed: null,
      executedBy: null,
      prs: [],
      dependsOn: [],
      body: '',
      epic: null,
    };
    const result = buildYamlFrontmatter(parsed);
    assert.ok(result.includes('epic: ~'));
    assert.ok(result.includes('tool: ~'));
    assert.ok(result.includes('started: ~'));
    assert.ok(result.includes('completed: ~'));
    assert.ok(result.includes('outputs: []'));
  });
});

// ── normalizeStatus ────────────────────────────────────────────────

describe('normalizeStatus', () => {
  it('passes through valid statuses', () => {
    assert.equal(normalizeStatus('Done'), 'Done');
    assert.equal(normalizeStatus('In Progress'), 'In Progress');
    assert.equal(normalizeStatus('Queued'), 'Queued');
  });

  it('maps common variants', () => {
    assert.equal(normalizeStatus('Complete'), 'Done');
    assert.equal(normalizeStatus('Completed'), 'Done');
    assert.equal(normalizeStatus('To Do'), 'Queued');
    assert.equal(normalizeStatus('Pending'), 'Queued');
  });
});

// ── normalizePriority ──────────────────────────────────────────────

describe('normalizePriority', () => {
  it('strips parenthetical notes', () => {
    assert.equal(normalizePriority('Medium (correctness bug)'), 'Medium');
    assert.equal(normalizePriority('High (security)'), 'High');
  });

  it('passes through clean values', () => {
    assert.equal(normalizePriority('Low'), 'Low');
    assert.equal(normalizePriority('Critical'), 'Critical');
  });
});

// ── escapeYaml ─────────────────────────────────────────────────────

describe('escapeYaml', () => {
  it('wraps strings with colons in quotes', () => {
    assert.equal(escapeYaml('Title: With Colon'), '"Title: With Colon"');
  });

  it('leaves simple strings unwrapped', () => {
    assert.equal(escapeYaml('Simple Title'), 'Simple Title');
  });
});

// ── convertDoneTaskFile ────────────────────────────────────────────

describe('convertDoneTaskFile', () => {
  it('converts an old-format file and preserves prose', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'convert-'));
    const filePath = path.join(tmpDir, '48-designer-credit-header.md');
    fs.writeFileSync(filePath, `# Task #48 — Add Designer Credit to Header

**Status:** Done
**Priority:** Low
**Depends On:** None
**Created:** Mar 8, 2026
**Completed:** Mar 9, 2026
**Executed by:** Claude Code
**PR:** #78

## Brief

Update the "Built with" attribution line.
`);

    const result = convertDoneTaskFile(filePath);
    assert.ok(result.startsWith('---\n'));
    assert.ok(result.includes('id: 48'));
    assert.ok(result.includes('epic: epic-meta-process-foundation'));
    assert.ok(result.includes('status: Done'));
    assert.ok(result.includes('- { type: PR, ref: 78 }'));
    assert.ok(result.includes('## Brief'));
    assert.ok(result.includes('Update the "Built with" attribution line.'));

    fs.rmSync(tmpDir, { recursive: true });
  });

  it('skips files that already have YAML frontmatter', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'convert-skip-'));
    const filePath = path.join(tmpDir, '99-test.md');
    const yamlContent = '---\nid: 99\ntitle: Test\n---\n# Body';
    fs.writeFileSync(filePath, yamlContent);

    const result = convertDoneTaskFile(filePath);
    assert.strictEqual(result, yamlContent); // unchanged

    fs.rmSync(tmpDir, { recursive: true });
  });
});

// ── lookup map exports ─────────────────────────────────────────────

describe('lookup maps', () => {
  it('exports TASK_TO_SESSION', () => {
    assert.equal(TASK_TO_SESSION[1], 18);
    assert.equal(TASK_TO_SESSION[20], 22);
  });

  it('exports SESSION_TO_CHAPTER', () => {
    assert.equal(SESSION_TO_CHAPTER[22], 'meta-ch-process-overhaul');
  });

  it('exports CHAPTER_TO_EPIC', () => {
    assert.equal(CHAPTER_TO_EPIC['meta-ch-process-overhaul'], 'epic-meta-process-foundation');
  });
});
