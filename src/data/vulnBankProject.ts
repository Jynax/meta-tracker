import type { Project } from '../types';

export const vulnBankProject: Project = {
  id: 'vuln-bank',
  name: 'Vuln Bank',
  subtitle: 'DESIGNED BY MICHAEL · BUILT WITH CLAUDE CODE & CURSOR',
  projectType: 'joint',
  currentPhase: 'Build',
  contributors: [
    { name: 'Michael', role: 'Product Owner / Designer', tool: 'manual' },
    { name: 'redacted', role: 'Developer', tool: 'cursor' },
    { name: 'Jynax', role: 'Developer / Coordinator', tool: 'claude-code' },
  ],
  chapters: [
    {
      id: 'vb-ch-getting-organized',
      name: 'Getting Organized',
      period: 'Mar 6, 2026',
      toolLabel: 'Claude Code',
      tool: 'claude',
      chapterType: 'date-range' as const,
      nodes: [
        {
          id: 'vb-multi-model-coordination',
          type: 'decision',
          dayId: 'Mar 6',
          category: 'process',
          title: 'Multi-Model Coordination Protocol',
          description:
            'Adopted a task-index-based coordination protocol with file-level conflict detection, branch isolation per model, and status signaling in the shared task index. Two AI models (Claude Code and Cursor) work on the same repo in parallel.',
          chosenPath: 'Task index coordination with branch prefixes and file-level conflict detection',
          alternatives: [
            'Domain separation (backend vs frontend ownership)',
            'Sequential turns',
            'Forking the repo per model',
          ],
        },
        {
          id: 'vb-workflow-docs-in-repo',
          type: 'decision',
          dayId: 'Mar 6',
          category: 'process',
          title: 'Workflow Documentation in Repo',
          description:
            'Added .workflow/ directory with adapted workflow docs, .cursorrules for Cursor, and CLAUDE.md for Claude Code. Each model has its own entry point but shares the same underlying workflow docs.',
          chosenPath: 'Shared .workflow/ docs with model-specific entry points (.cursorrules, CLAUDE.md)',
          alternatives: ['External docs only', 'Single shared config file'],
        },
      ],
    },
    {
      id: 'vb-ch-solving-coordination-gaps',
      name: 'Solving Coordination Gaps',
      period: 'Mar 9, 2026',
      toolLabel: 'Claude Code',
      tool: 'claude',
      chapterType: 'date-range' as const,
      nodes: [
        {
          id: 'vb-repo-migration',
          type: 'decision',
          dayId: 'Mar 9',
          category: 'process',
          title: 'Repo Migration — Remove Fork Association',
          description:
            'redacted/vuln-bank was a fork of Commando-X/vuln-bank. Git tooling (gh) auto-created PRs against the upstream repo, leaking work to a public project. Deleted the fork and recreated as standalone.',
          chosenPath: 'Delete the fork, recreate as a standalone repo, re-push all content',
          alternatives: [
            'Remove upstream remote only (does not fix GitHub fork association)',
            'Keep the fork and be careful (too error-prone)',
          ],
        },
        {
          id: 'vb-github-issues-coordination',
          type: 'decision',
          dayId: 'Mar 9',
          category: 'process',
          title: 'GitHub Issues Replace Task Index',
          description:
            'Cursor identified that tasks/index.md is broken as a coordination mechanism — both models edit it on branches, so neither can see the other\'s claims until merged. Replaced with GitHub Issues: branch-independent, atomic assignment, native dependencies and sub-issues, timestamped comments for cross-model signaling.',
          chosenPath: 'GitHub Issues as the full coordination system with labels, sub-issues, and dependency tracking',
          alternatives: [
            'Exempt tasks/index.md from no-direct-push rule',
            'Draft PR on claim as secondary signal',
            'Hybrid: Issues for status, task files for specs',
            'Keep current system, rely on verbal operator coordination',
          ],
        },
        {
          id: 'vb-issues-poc-validation',
          type: 'event',
          dayId: 'Mar 9',
          category: 'process',
          title: 'POC Validation — GitHub Issues Coordination',
          description:
            'Built test chain (parent #7, sub-issues #8-10) validating all features: labels, sub-issues with progress roll-up, dependencies via blocked_by API, atomic claiming, cross-model signaling via comments. Key finding: closing a blocker does not auto-flip downstream labels — manual step required.',
        },
      ],
    },
    {
      id: 'vb-ch-workflow-refinements',
      name: 'Workflow Refinements',
      period: 'Mar 10, 2026',
      toolLabel: 'Claude Code',
      tool: 'claude',
      chapterType: 'date-range' as const,
      nodes: [
        {
          id: 'vb-dry-entry-points',
          type: 'decision',
          dayId: 'Mar 10',
          category: 'process',
          title: 'DRY Up Entry Points',
          description:
            'Slimmed CLAUDE.md and .cursorrules to ~33 lines each, moving all shared rules into .workflow/START HERE.md. Each model-specific file now only contains branch prefix, labels, and a pointer to shared docs.',
          chosenPath: 'Centralize rules in START HERE.md, keep entry points model-specific and minimal',
          alternatives: ['Keep duplicated rules in both files', 'Single shared config with model flags'],
        },
        {
          id: 'vb-created-by-labels',
          type: 'decision',
          dayId: 'Mar 10',
          category: 'process',
          title: 'Created-By Labels for Issue Attribution',
          description:
            'Added created-by:claude-code and created-by:cursor labels to GitHub Issues so the origin of each issue is visible at a glance, independent of who is assigned to work on it.',
          chosenPath: 'Dedicated created-by labels per model',
          alternatives: ['Use issue body text for attribution', 'No attribution tracking'],
        },
      ],
    },
    {
      id: 'vb-ch-first-code-fixes',
      name: 'First Code Fixes',
      period: 'Mar 10, 2026',
      toolLabel: 'Claude Code',
      tool: 'claude',
      chapterType: 'date-range' as const,
      nodes: [
        {
          id: 'vb-split-metrics-closeout',
          type: 'decision',
          dayId: 'Mar 10',
          category: 'process',
          title: 'Split Metrics Files + Session Close-Out',
          description:
            'Introduced separate metrics files per model (metrics-claude.md, metrics-cursor.md) to eliminate merge conflicts. Claude Code is the merger — combines both into metrics.md and syncs to Meta Tracker. Added session close-out checklist to START HERE.md.',
          chosenPath: 'Separate write files per model, single merger (Claude Code)',
          alternatives: [
            'Shared metrics.md with merge conflict risk',
            'Metrics only in Meta Tracker (no repo copy)',
            'Each model pushes to Meta Tracker independently',
          ],
        },
      ],
    },
    {
      id: 'vb-ch-codebase-cleanup',
      name: 'Codebase Cleanup',
      period: 'Mar 10, 2026',
      toolLabel: 'Claude Code + Cursor',
      tool: 'mixed',
      chapterType: 'date-range' as const,
      nodes: [
        {
          id: 'vb-sdelements-profile-assumptions',
          type: 'discovery',
          dayId: 'Mar 10',
          category: 'technical',
          title: 'SDElements Profile Assumptions',
          description:
            'Cursor audited SDElements security profile and documented Django framework assumptions, bias patterns, and profile coverage gaps. Created profile documentation for the project\'s actual stack (Flask, not Django) to guide future security scanning configuration.',
        },
        {
          id: 'vb-dead-sqlite-replacement',
          type: 'decision',
          dayId: 'Mar 10',
          category: 'technical',
          title: 'Replace Dead SQLite Code with PostgreSQL',
          description:
            'Removed sqlite3 import and replaced all sqlite3.connect() calls in auth.py API endpoints with execute_query() from database.py. All 3 endpoints (/api/login, /api/check_balance, /api/transfer) now use the same PostgreSQL backend as the rest of the app. Intentional vulnerabilities preserved.',
          chosenPath: 'Replace sqlite3 calls with existing execute_query() PostgreSQL helper',
          alternatives: [
            'Keep dead SQLite code alongside PostgreSQL',
            'Remove the affected endpoints entirely',
          ],
        },
        {
          id: 'vb-commando-refs-debug-prints',
          type: 'decision',
          dayId: 'Mar 10',
          category: 'technical',
          title: 'Fix Commando-X References + Remove Debug Prints',
          description:
            'Updated 3 README clone URLs, openapi.json contact URL, and 2 index.html repo links from Commando-X/vuln-bank to redacted/vuln-bank after the repo migration. Removed 6 debug print statements from login handler and auth.py that exposed usernames, SQL queries, query results, and JWT tokens to stdout.',
          chosenPath: 'Bulk-fix all stale references and strip all debug prints in one PR',
          alternatives: [
            'Fix references only, leave debug prints for development',
            'Address each file in separate PRs',
          ],
        },
      ],
    },
    {
      id: 'vb-ch-docker-modernization',
      name: 'Docker Modernization & Bug Fixes',
      period: 'Mar 10–11, 2026',
      toolLabel: 'Claude Code',
      tool: 'claude',
      chapterType: 'date-range' as const,
      nodes: [
        {
          id: 'vb-docker-modernization',
          type: 'decision',
          dayId: 'Mar 10',
          category: 'technical',
          title: 'Docker Modernization — Python 3.12, Compose V2, Health Checks',
          description:
            'Upgraded base image from python:3.9-slim to python:3.12-slim (3.9 EOL), postgres from 13 to 16. Removed deprecated version field from docker-compose.yml. Added HEALTHCHECK to Dockerfile and pg_isready to db service. Web service now waits for healthy db before starting. Updated README to use docker compose (V2).',
          chosenPath: 'Full modernization pass: Python 3.12, Postgres 16, Compose V2, health checks',
          alternatives: [
            'Upgrade Python only, leave Postgres and Compose as-is',
            'Stay on Python 3.9 until app-level changes require it',
          ],
        },
        {
          id: 'vb-bare-exception-fixes',
          type: 'decision',
          dayId: 'Mar 10',
          category: 'technical',
          title: 'Fix Bare Exception Handlers',
          description:
            'Replaced bare except: with except Exception: in app.py (lines 147, 2040) so KeyboardInterrupt and SystemExit are no longer silently swallowed. These were unintentional bugs, not part of the deliberately vulnerable design.',
          chosenPath: 'Replace bare except: with except Exception: to preserve intentional vulns while fixing unintentional ones',
          alternatives: [
            'Use specific exception types per handler',
            'Leave bare excepts as-is since the app is intentionally vulnerable',
          ],
        },
        {
          id: 'vb-stale-index-references',
          type: 'decision',
          dayId: 'Mar 10',
          category: 'process',
          title: 'Fix Stale Task Index References in Workflow Docs',
          description:
            'Updated two references in How We Work.md that still mentioned the retired file-based task index to say "GitHub Issues" instead, completing the migration from Session 4.',
          chosenPath: 'Update stale references to match current GitHub Issues workflow',
          alternatives: ['Leave old references as historical context'],
        },
      ],
    },
  ],
  stats: {
    totalDays: 6,
    chatGptMessages: '0',
    coworkSessions: 0,
    prsCreated: '19',
    codexTasks: '0',
    linesOfCode: '1166',
    deadEnds: 0,
    majorDecisions: 14,
  },
};
