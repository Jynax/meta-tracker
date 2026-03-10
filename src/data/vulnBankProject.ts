import type { Project } from '../types';

export const vulnBankProject: Project = {
  id: 'vuln-bank',
  name: 'Vuln Bank',
  subtitle: 'DESIGNED BY MICHAEL · BUILT WITH CLAUDE CODE & CURSOR',
  projectType: 'joint',
  currentPhase: 'Build',
  chapters: [
    {
      id: 'vb-ch-getting-organized',
      name: 'Getting Organized',
      period: 'Mar 6, 2026',
      toolLabel: 'Claude Code',
      tool: 'claude',
      nodes: [
        {
          id: 'vb-multi-model-coordination',
          type: 'decision',
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
      nodes: [
        {
          id: 'vb-repo-migration',
          type: 'decision',
          category: 'process',
          title: 'Repo Migration — Remove Fork Association',
          description:
            'hrpatel/vuln-bank was a fork of Commando-X/vuln-bank. Git tooling (gh) auto-created PRs against the upstream repo, leaking work to a public project. Deleted the fork and recreated as standalone.',
          chosenPath: 'Delete the fork, recreate as a standalone repo, re-push all content',
          alternatives: [
            'Remove upstream remote only (does not fix GitHub fork association)',
            'Keep the fork and be careful (too error-prone)',
          ],
        },
        {
          id: 'vb-github-issues-coordination',
          type: 'decision',
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
      nodes: [
        {
          id: 'vb-dry-entry-points',
          type: 'decision',
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
      nodes: [
        {
          id: 'vb-split-metrics-closeout',
          type: 'decision',
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
  ],
  stats: {
    totalDays: 5,
    chatGptMessages: '0',
    coworkSessions: 0,
    prsCreated: '9',
    codexTasks: '0',
    linesOfCode: '1114',
    deadEnds: 0,
    majorDecisions: 8,
  },
};
