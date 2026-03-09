import type { Project } from '../types';

export const vulnBankProject: Project = {
  id: 'vuln-bank',
  name: 'Vuln Bank',
  subtitle: 'DESIGNED BY MICHAEL · BUILT WITH CLAUDE CODE & CURSOR',
  projectType: 'joint',
  currentPhase: 'Spec',
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
  ],
  stats: {
    totalDays: 1,
    chatGptMessages: '0',
    coworkSessions: 0,
    prsCreated: '2',
    codexTasks: '0',
    linesOfCode: '629',
    deadEnds: 0,
    majorDecisions: 2,
  },
};
