// GENERATED — DO NOT EDIT
// Run 'npm run generate:data' from the repo root to regenerate.
// Source: Co-work Projects/{Meta Tracker,_Shared}/{epics,tasks}
// See specs/2026-04-14-data-model-rethink.md.
import type { Epic, Task } from '../types/tracker';

export const generatedAt: string = "2026-04-16T13:00:34.891Z";

export const epics: Epic[] = [
  {
    "id": "epic-data-model-rethink",
    "project": "meta",
    "touches": [],
    "title": "Data Model Rethink — Epic/Task/Decision",
    "status": "In Progress",
    "startDate": "2026-04-14T00:00:00.000Z",
    "endDate": null,
    "consolidatesChapters": []
  },
  {
    "id": "epic-meta-canvas-mindmap-retired",
    "project": "meta",
    "touches": [],
    "title": "Canvas Mind Map (Retired)",
    "status": "Retired",
    "startDate": "2026-04-12T00:00:00.000Z",
    "endDate": "2026-04-14T00:00:00.000Z",
    "consolidatesChapters": [
      "meta-ch-decision-tree-completeness"
    ]
  },
  {
    "id": "epic-meta-dashboard-stacked",
    "project": "meta",
    "touches": [],
    "title": "Dashboard & Stacked View",
    "status": "Done",
    "startDate": "2026-03-02T00:00:00.000Z",
    "endDate": "2026-03-03T00:00:00.000Z",
    "consolidatesChapters": [
      "meta-ch-spine-dashboard",
      "meta-ch-ux-polish",
      "meta-ch-dashboard-data-overhaul",
      "meta-ch-stacked-tree-view",
      "meta-ch-ux-final-pass",
      "meta-ch-how-we-work"
    ]
  },
  {
    "id": "epic-meta-day-block-v1",
    "project": "meta",
    "touches": [],
    "title": "Day/Block Model & v1.0",
    "status": "Done",
    "startDate": "2026-03-07T00:00:00.000Z",
    "endDate": "2026-03-15T00:00:00.000Z",
    "consolidatesChapters": [
      "meta-ch-time-machine-data-model",
      "meta-ch-day-block-migration",
      "meta-ch-ux-brief-complete",
      "meta-ch-v1-shipped"
    ]
  },
  {
    "id": "epic-meta-design-polish",
    "project": "meta",
    "touches": [],
    "title": "Design Polish",
    "status": "Done",
    "startDate": "2026-04-07T00:00:00.000Z",
    "endDate": "2026-04-07T00:00:00.000Z",
    "consolidatesChapters": [
      "meta-ch-design-polish"
    ]
  },
  {
    "id": "epic-meta-inception",
    "project": "meta",
    "touches": [],
    "title": "Inception & First Tree",
    "status": "Done",
    "startDate": "2026-02-26T00:00:00.000Z",
    "endDate": "2026-02-26T00:00:00.000Z",
    "consolidatesChapters": [
      "meta-ch-inception",
      "meta-ch-horizontal"
    ]
  },
  {
    "id": "epic-meta-insights-redesign",
    "project": "meta",
    "touches": [],
    "title": "Insights Redesign",
    "status": "Done",
    "startDate": "2026-03-20T00:00:00.000Z",
    "endDate": "2026-04-11T00:00:00.000Z",
    "consolidatesChapters": [
      "meta-ch-insights-redesign"
    ]
  },
  {
    "id": "epic-meta-layout-wars",
    "project": "meta",
    "touches": [],
    "title": "Layout & Data Model Wars",
    "status": "Done",
    "startDate": "2026-02-27T00:00:00.000Z",
    "endDate": "2026-02-28T00:00:00.000Z",
    "consolidatesChapters": [
      "meta-ch-layout-overhaul",
      "meta-ch-spacing-wars",
      "meta-ch-data-alignment"
    ]
  },
  {
    "id": "epic-meta-process-foundation",
    "project": "meta",
    "touches": [],
    "title": "Process & Engineering Foundation",
    "status": "Done",
    "startDate": "2026-03-04T00:00:00.000Z",
    "endDate": "2026-03-06T00:00:00.000Z",
    "consolidatesChapters": [
      "meta-ch-process-overhaul",
      "meta-ch-mojibake-fix",
      "meta-ch-cli-migration",
      "meta-ch-all-prs-workflow",
      "meta-ch-engineering-foundation",
      "meta-ch-playwright-testing",
      "meta-ch-bug-sweep",
      "meta-ch-sc-theme-a11y"
    ]
  },
  {
    "id": "epic-meta-ux-data-fixes",
    "project": "meta",
    "touches": [],
    "title": "UX & Data Fixes",
    "status": "Done",
    "startDate": "2026-03-15T00:00:00.000Z",
    "endDate": null,
    "consolidatesChapters": [
      "meta-ch-ux-data-fixes"
    ]
  },
  {
    "id": "epic-shared-decision-tree-backfill",
    "project": "shared",
    "touches": [
      "meta",
      "bip",
      "ibg",
      "landing",
      "nw",
      "otm",
      "remnants",
      "vb",
      "fc"
    ],
    "title": "Decision Tree Data Backfill",
    "status": "Done",
    "startDate": "2026-04-08T00:00:00.000Z",
    "endDate": "2026-04-08T00:00:00.000Z",
    "consolidatesChapters": []
  },
  {
    "id": "epic-shared-infra-dep-migration",
    "project": "shared",
    "touches": [
      "meta",
      "bip",
      "ibg",
      "landing",
      "nw",
      "otm",
      "remnants",
      "vb",
      "fc"
    ],
    "title": "Cross-Project Infrastructure & Dep Migration",
    "status": "Done",
    "startDate": "2026-03-16T00:00:00.000Z",
    "endDate": null,
    "consolidatesChapters": [
      "meta-ch-dep-migration",
      "meta-ch-cross-cutting-infra"
    ]
  },
  {
    "id": "epic-shared-project-milestones",
    "project": "shared",
    "touches": [
      "meta",
      "bip",
      "ibg",
      "landing",
      "nw",
      "otm",
      "remnants",
      "vb",
      "fc"
    ],
    "title": "Portfolio Milestones",
    "status": "In Progress",
    "startDate": "2026-03-15T00:00:00.000Z",
    "endDate": null,
    "consolidatesChapters": [
      "meta-ch-project-milestones"
    ]
  },
  {
    "id": "epic-shared-quality-audit",
    "project": "shared",
    "touches": [
      "meta",
      "bip",
      "ibg",
      "landing",
      "nw",
      "otm",
      "remnants",
      "vb",
      "fc"
    ],
    "title": "Portfolio-wide Quality Audit",
    "status": "Done",
    "startDate": "2026-03-25T00:00:00.000Z",
    "endDate": "2026-04-01T00:00:00.000Z",
    "consolidatesChapters": [
      "meta-ch-loc-audit-insights",
      "meta-ch-data-viz-pat-audit"
    ]
  }
];

export const tasks: Task[] = [
  {
    "id": 1,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-process-foundation",
    "title": "Update How We Work view content",
    "status": "Done",
    "priority": "High",
    "outputs": [],
    "dates": {
      "created": "2026-03-04",
      "started": null,
      "completed": "2026-03-04"
    },
    "tool": "cowork",
    "driver": "collaborative",
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [],
    "events": []
  },
  {
    "id": 3,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-process-foundation",
    "title": "Push Session 16 data to live app (process overhaul + decomposition chapters, metrics)",
    "status": "Done",
    "priority": "Medium",
    "outputs": [],
    "dates": {
      "created": "2026-03-04",
      "started": null,
      "completed": "2026-03-04"
    },
    "tool": "cowork",
    "driver": "collaborative",
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [],
    "events": []
  },
  {
    "id": 3,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-process-foundation",
    "title": "Fix Session 16 data — chapterId, decisions, stale stats",
    "status": "Done",
    "priority": "Medium",
    "outputs": [],
    "dates": {
      "created": "2026-03-05",
      "started": null,
      "completed": "2026-03-05"
    },
    "tool": "claude-code",
    "driver": "collaborative",
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [
      {
        "id": "d-meta-process-restructure",
        "title": "Replace Passoff Chain with Living Documents",
        "chosen": "Living documents updated in place",
        "alternatives": [
          "Keep passoff chain and compress periodically",
          "GitHub Issues for task tracking"
        ],
        "date": "2026-03-04"
      }
    ],
    "events": []
  },
  {
    "id": 4,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-process-foundation",
    "title": "Decompose large component files (MetricsDashboard + ProcessWorkflow)",
    "status": "Done",
    "priority": "Medium",
    "outputs": [],
    "dates": {
      "created": "2026-03-04",
      "started": null,
      "completed": "2026-03-04"
    },
    "tool": "cowork",
    "driver": "collaborative",
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [],
    "events": [
      {
        "type": "completion",
        "date": "2026-03-04",
        "note": "Decompose Large Component Files — Direct API commits for mechanical restructuring"
      }
    ]
  },
  {
    "id": 5,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-process-foundation",
    "title": "Rename \"Sessions\" to date-based labeling in app",
    "status": "Done",
    "priority": "Medium",
    "outputs": [],
    "dates": {
      "created": "2026-03-04",
      "started": null,
      "completed": "2026-03-04"
    },
    "tool": "cowork",
    "driver": "collaborative",
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [],
    "events": []
  },
  {
    "id": 6,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-process-foundation",
    "title": "Fix emoji/icon rendering — tab labels and UI icons showing garbled characters (mojibake)",
    "status": "Done",
    "priority": "High",
    "outputs": [],
    "dates": {
      "created": "2026-03-04",
      "started": null,
      "completed": "2026-03-04"
    },
    "tool": "cowork",
    "driver": "collaborative",
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [],
    "events": [
      {
        "type": "completion",
        "date": "2026-03-04",
        "note": "Batch Mojibake Fix via Iterative UTF-8 Decoder — Iterative decoder + direct GitHub API commits"
      }
    ]
  },
  {
    "id": 9,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-process-foundation",
    "title": "Add Process History tab to How We Work view",
    "status": "Done",
    "priority": "Medium",
    "outputs": [],
    "dates": {
      "created": "2026-03-04",
      "started": null,
      "completed": "2026-03-04"
    },
    "tool": "claude-code",
    "driver": "collaborative",
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [],
    "events": []
  },
  {
    "id": 10,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-process-foundation",
    "title": "Advanced process history options (time machine etc.)",
    "status": "Done",
    "priority": "Low",
    "outputs": [
      {
        "type": "PR",
        "ref": 70
      }
    ],
    "dates": {
      "created": "2026-03-04",
      "started": null,
      "completed": "2026-03-04"
    },
    "tool": "claude-code",
    "driver": "collaborative",
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [],
    "events": []
  },
  {
    "id": 11,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-process-foundation",
    "title": "Add workCategory to Session Data",
    "status": "Done",
    "priority": "Medium",
    "outputs": [],
    "dates": {
      "created": null,
      "started": null,
      "completed": "2026-03-04"
    },
    "tool": "claude-code",
    "driver": null,
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [
      {
        "id": "d-meta-cli-experiment",
        "title": "Claude Code CLI as Primary Tool",
        "chosen": "Claude Code CLI for direct code changes",
        "alternatives": [
          "Continue using Cowork for all tasks",
          "Use Codex for chart work"
        ],
        "date": "2026-03-04"
      }
    ],
    "events": []
  },
  {
    "id": 12,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-process-foundation",
    "title": "Work Mix Chart — Overview Tab",
    "status": "Done",
    "priority": "Medium",
    "outputs": [],
    "dates": {
      "created": null,
      "started": null,
      "completed": "2026-03-04"
    },
    "tool": "claude-code",
    "driver": null,
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [],
    "events": [
      {
        "type": "completion",
        "date": "2026-03-04",
        "note": "Work Mix Stacked Bar Chart — Horizontal stacked bar with legend (counts + percentages)"
      }
    ]
  },
  {
    "id": 13,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-process-foundation",
    "title": "Move How We Work — Info Button in Top Right",
    "status": "Done",
    "priority": "Medium",
    "outputs": [],
    "dates": {
      "created": null,
      "started": null,
      "completed": "2026-03-05"
    },
    "tool": "claude-code",
    "driver": null,
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [
      {
        "id": "d-meta-how-we-work-overlay",
        "title": "How We Work Moved to Overlay",
        "chosen": "Header info button with full-page overlay",
        "alternatives": [
          "Keep as tab",
          "Side panel",
          "Dropdown menu"
        ],
        "date": "2026-03-04"
      }
    ],
    "events": []
  },
  {
    "id": 14,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-process-foundation",
    "title": "Reverse Chronological Order — Sessions, Bugs, Stacked Tree",
    "status": "Done",
    "priority": "Medium",
    "outputs": [],
    "dates": {
      "created": null,
      "started": null,
      "completed": "2026-03-05"
    },
    "tool": "claude-code",
    "driver": null,
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [
      15
    ],
    "decisions": [],
    "events": []
  },
  {
    "id": 15,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-process-foundation",
    "title": "Bugs Tab — Collapsible Table with Date & Decision Columns",
    "status": "Done",
    "priority": "Medium",
    "outputs": [],
    "dates": {
      "created": null,
      "started": null,
      "completed": "2026-03-04"
    },
    "tool": "claude-code",
    "driver": null,
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [],
    "events": [
      {
        "type": "completion",
        "date": "2026-03-04",
        "note": "Bugs Tab Restructured — Collapsible session groups with summary counts"
      }
    ]
  },
  {
    "id": 16,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-process-foundation",
    "title": "Bugs Tab — Donut Chart Improvements",
    "status": "Done",
    "priority": "Medium",
    "outputs": [],
    "dates": {
      "created": null,
      "started": null,
      "completed": "2026-03-05"
    },
    "tool": "claude-code",
    "driver": null,
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [
      15
    ],
    "decisions": [],
    "events": []
  },
  {
    "id": 17,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-process-foundation",
    "title": "Security audit — AI injection risks & hardening review",
    "status": "Done",
    "priority": "Medium",
    "outputs": [],
    "dates": {
      "created": "2026-03-05",
      "started": null,
      "completed": "2026-03-05"
    },
    "tool": "claude-code",
    "driver": "collaborative",
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [],
    "events": [
      {
        "type": "completion",
        "date": "2026-03-05",
        "note": "Security Audit Across All Projects — Comprehensive audit before hardening"
      }
    ]
  },
  {
    "id": 18,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-process-foundation",
    "title": "Set up Playwright end-to-end testing framework",
    "status": "Done",
    "priority": "Medium",
    "outputs": [
      {
        "type": "PR",
        "ref": 85
      }
    ],
    "dates": {
      "created": "2026-03-05",
      "started": null,
      "completed": "2026-03-05"
    },
    "tool": "claude-code",
    "driver": "collaborative",
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [
      {
        "id": "d-meta-playwright-framework",
        "title": "Playwright E2E Testing Framework",
        "chosen": "Playwright with Chromium + Vite dev server integration",
        "alternatives": [
          "Cypress",
          "Vitest with jsdom (unit only)",
          "Manual testing"
        ],
        "date": "2026-03-10"
      }
    ],
    "events": []
  },
  {
    "id": 19,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-process-foundation",
    "title": "Weekly dependency & CVE scan — automated recurring check",
    "status": "Done",
    "priority": "Medium",
    "outputs": [
      {
        "type": "PR",
        "ref": 74
      },
      {
        "type": "PR",
        "ref": 70
      },
      {
        "type": "PR",
        "ref": 3
      }
    ],
    "dates": {
      "created": "2026-03-05",
      "started": null,
      "completed": "2026-03-05"
    },
    "tool": "claude-code",
    "driver": "collaborative",
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [],
    "events": []
  },
  {
    "id": 20,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-process-foundation",
    "title": "True up PR counts — include direct commits as PR equivalents",
    "status": "Done",
    "priority": "Medium",
    "outputs": [],
    "dates": {
      "created": "2026-03-05",
      "started": null,
      "completed": "2026-03-05"
    },
    "tool": "claude-code",
    "driver": "collaborative",
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [],
    "events": []
  },
  {
    "id": 21,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-process-foundation",
    "title": "Update App Header Attribution Text",
    "status": "Done",
    "priority": "Medium",
    "outputs": [
      {
        "type": "PR",
        "ref": 48
      },
      {
        "type": "PR",
        "ref": 22
      }
    ],
    "dates": {
      "created": "2026-03-05",
      "started": null,
      "completed": "2026-03-05"
    },
    "tool": "claude-code",
    "driver": null,
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [],
    "events": []
  },
  {
    "id": 22,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-process-foundation",
    "title": "How We Work — Full Content Rewrite + UX Pass",
    "status": "Done",
    "priority": "High",
    "outputs": [
      {
        "type": "PR",
        "ref": 48
      }
    ],
    "dates": {
      "created": "2026-03-05",
      "started": null,
      "completed": "2026-03-05"
    },
    "tool": "claude-code",
    "driver": null,
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [
      21
    ],
    "decisions": [
      {
        "id": "d-meta-all-prs-policy",
        "title": "All Code Changes Go Through PRs",
        "chosen": "Mandatory PRs for all code changes",
        "alternatives": [
          "Allow direct commits for small changes",
          "PRs only for large changes"
        ],
        "date": "2026-03-05"
      }
    ],
    "events": [
      {
        "type": "completion",
        "date": "2026-03-05",
        "note": "Review Cadence After Every 2-3 Merges — Lightweight review pass every 2-3 merges"
      }
    ]
  },
  {
    "id": 23,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-process-foundation",
    "title": "Session Tool Tracking + Avg Task Time Chart",
    "status": "Done",
    "priority": "Medium",
    "outputs": [
      {
        "type": "PR",
        "ref": 58
      }
    ],
    "dates": {
      "created": "2026-03-05",
      "started": null,
      "completed": "2026-03-05"
    },
    "tool": "claude-code",
    "driver": null,
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [],
    "events": [
      {
        "type": "completion",
        "date": "2026-03-05",
        "note": "Session Tool Tracking + Avg Task Time — Tool + taskCount fields with per-tool trend lines"
      }
    ]
  },
  {
    "id": 24,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-process-foundation",
    "title": "Stacked Tree — Default Collapsed + Allow Multiple Open",
    "status": "Done",
    "priority": "Medium",
    "outputs": [
      {
        "type": "PR",
        "ref": 49
      },
      {
        "type": "PR",
        "ref": 25
      }
    ],
    "dates": {
      "created": "2026-03-05",
      "started": null,
      "completed": "2026-03-05"
    },
    "tool": "claude-code",
    "driver": null,
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [],
    "events": [
      {
        "type": "completion",
        "date": "2026-03-05",
        "note": "Stacked Tree — Default Collapsed + Multi-Open — All collapsed, multi-open, visual-only pills"
      }
    ]
  },
  {
    "id": 25,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-process-foundation",
    "title": "Decision Type Pills — Remove Filter Behavior, Keep Visual",
    "status": "Done",
    "priority": "Medium",
    "outputs": [
      {
        "type": "PR",
        "ref": 49
      }
    ],
    "dates": {
      "created": "2026-03-05",
      "started": null,
      "completed": "2026-03-05"
    },
    "tool": "claude-code",
    "driver": null,
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [],
    "events": []
  },
  {
    "id": 26,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-process-foundation",
    "title": "Push Sessions 22-23 data to live app + decisions.md",
    "status": "Done",
    "priority": "Medium",
    "outputs": [],
    "dates": {
      "created": "2026-03-05",
      "started": null,
      "completed": "2026-03-05"
    },
    "tool": "claude-code",
    "driver": "collaborative",
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [],
    "events": [
      {
        "type": "completion",
        "date": "2026-03-05",
        "note": "Data Push Cadence — Natural Breakpoints — Natural breakpoints over rigid schedules"
      }
    ]
  },
  {
    "id": 27,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-process-foundation",
    "title": "Reverse Chronological Order — Full App Audit & Fix",
    "status": "Done",
    "priority": "Medium",
    "outputs": [
      {
        "type": "PR",
        "ref": 50
      }
    ],
    "dates": {
      "created": null,
      "started": null,
      "completed": "2026-03-05"
    },
    "tool": "claude-code",
    "driver": null,
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [],
    "events": []
  },
  {
    "id": 28,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-process-foundation",
    "title": "Decompose MetricsDashboard into tab components",
    "status": "Done",
    "priority": "Medium",
    "outputs": [
      {
        "type": "PR",
        "ref": 52
      }
    ],
    "dates": {
      "created": "2026-03-05",
      "started": null,
      "completed": "2026-03-05"
    },
    "tool": "claude-code",
    "driver": "collaborative",
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [],
    "events": [
      {
        "type": "completion",
        "date": "2026-03-05",
        "note": "MetricsDashboard Decomposed into Tab Components — One component per tab + shared utilities"
      }
    ]
  },
  {
    "id": 29,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-process-foundation",
    "title": "Add ESLint + Prettier configuration",
    "status": "Done",
    "priority": "Low",
    "outputs": [
      {
        "type": "PR",
        "ref": 53
      }
    ],
    "dates": {
      "created": "2026-03-05",
      "started": null,
      "completed": "2026-03-05"
    },
    "tool": "claude-code",
    "driver": "collaborative",
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [],
    "events": [
      {
        "type": "completion",
        "date": "2026-03-05",
        "note": "ESLint + Prettier Configuration — ESLint 9 flat config + Prettier + auto-fix"
      }
    ]
  },
  {
    "id": 30,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-process-foundation",
    "title": "Accessibility pass — keyboard nav + semantic HTML",
    "status": "Done",
    "priority": "Low",
    "outputs": [
      {
        "type": "PR",
        "ref": 67
      }
    ],
    "dates": {
      "created": "2026-03-05",
      "started": null,
      "completed": "2026-03-05"
    },
    "tool": "claude-code",
    "driver": "collaborative",
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [],
    "events": [
      {
        "type": "completion",
        "date": "2026-03-06",
        "note": "Accessibility Pass — Semantic HTML + Keyboard Nav — Semantic landmarks + aria attributes + keyboard focus styling"
      }
    ]
  },
  {
    "id": 31,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-process-foundation",
    "title": "Chart Scaling — Tooltips, Milestone Labels, Progressive Detail",
    "status": "Done",
    "priority": "Medium",
    "outputs": [
      {
        "type": "PR",
        "ref": 57
      }
    ],
    "dates": {
      "created": "2026-03-05",
      "started": null,
      "completed": "2026-03-05"
    },
    "tool": "claude-code",
    "driver": null,
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [
      28
    ],
    "decisions": [],
    "events": [
      {
        "type": "completion",
        "date": "2026-03-05",
        "note": "Chart Scaling — Milestones, Deltas, Toggle — Milestone labels + delta tooltips + weekly aggregation toggle"
      }
    ]
  },
  {
    "id": 32,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-process-foundation",
    "title": "Best-in-class research guidance in process docs",
    "status": "Done",
    "priority": "Medium",
    "outputs": [],
    "dates": {
      "created": "2026-03-05",
      "started": null,
      "completed": "2026-03-05"
    },
    "tool": "claude-code",
    "driver": "collaborative",
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [],
    "events": []
  },
  {
    "id": 33,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-process-foundation",
    "title": "Bug: Weekly chart shows cumulative totals instead of per-week",
    "status": "Done",
    "priority": "High",
    "outputs": [
      {
        "type": "PR",
        "ref": 59
      },
      {
        "type": "PR",
        "ref": 60
      }
    ],
    "dates": {
      "created": "2026-03-05",
      "started": null,
      "completed": "2026-03-05"
    },
    "tool": "claude-code",
    "driver": "collaborative",
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [],
    "events": []
  },
  {
    "id": 34,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-process-foundation",
    "title": "Sessions Tab — Remove Dead Ends Line from Session Activity Chart",
    "status": "Done",
    "priority": "Low",
    "outputs": [
      {
        "type": "PR",
        "ref": 59
      }
    ],
    "dates": {
      "created": "2026-03-05",
      "started": null,
      "completed": "2026-03-05"
    },
    "tool": "claude-code",
    "driver": null,
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [],
    "events": []
  },
  {
    "id": 35,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-process-foundation",
    "title": "Bugs Tab — Donut Chart Spacing & Label Layout",
    "status": "Done",
    "priority": "Low",
    "outputs": [
      {
        "type": "PR",
        "ref": 59
      }
    ],
    "dates": {
      "created": "2026-03-05",
      "started": null,
      "completed": "2026-03-05"
    },
    "tool": "claude-code",
    "driver": null,
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [],
    "events": []
  },
  {
    "id": 36,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-process-foundation",
    "title": "Set Meta Tracker as Default Landing Project",
    "status": "Done",
    "priority": "Medium",
    "outputs": [
      {
        "type": "PR",
        "ref": 59
      }
    ],
    "dates": {
      "created": "2026-03-05",
      "started": null,
      "completed": "2026-03-05"
    },
    "tool": "claude-code",
    "driver": null,
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [],
    "events": [
      {
        "type": "completion",
        "date": "2026-03-05",
        "note": "UX Batch Polish — Defaults and Links — Meta Tracker as default, external links in header, per-tool trends"
      }
    ]
  },
  {
    "id": 37,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-process-foundation",
    "title": "Add Live App Links to Project Switcher",
    "status": "Done",
    "priority": "Medium",
    "outputs": [
      {
        "type": "PR",
        "ref": 59
      }
    ],
    "dates": {
      "created": "2026-03-05",
      "started": null,
      "completed": "2026-03-05"
    },
    "tool": "claude-code",
    "driver": null,
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [],
    "events": []
  },
  {
    "id": 38,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-process-foundation",
    "title": "Remove Basic Auth from Meta Tracker",
    "status": "Done",
    "priority": "Medium",
    "outputs": [],
    "dates": {
      "created": null,
      "started": null,
      "completed": null
    },
    "tool": "any (infra only)",
    "driver": "collaborative",
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [],
    "events": []
  },
  {
    "id": 39,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-process-foundation",
    "title": "Add security headers + fix BIP link attributes",
    "status": "Done",
    "priority": "Medium",
    "outputs": [
      {
        "type": "PR",
        "ref": 65
      },
      {
        "type": "PR",
        "ref": 69
      },
      {
        "type": "PR",
        "ref": 2
      }
    ],
    "dates": {
      "created": "2026-03-06",
      "started": null,
      "completed": "2026-03-06"
    },
    "tool": "claude-code",
    "driver": "collaborative",
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [],
    "events": [
      {
        "type": "completion",
        "date": "2026-03-05",
        "note": "Security Headers via _headers File — Static _headers file in repo (version-controlled)"
      }
    ]
  },
  {
    "id": 40,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-process-foundation",
    "title": "Fix project app links (BIP wrong URL, Meta self-link, Remnants missing)",
    "status": "Done",
    "priority": "Low",
    "outputs": [
      {
        "type": "PR",
        "ref": 67
      }
    ],
    "dates": {
      "created": "2026-03-06",
      "started": null,
      "completed": "2026-03-06"
    },
    "tool": "claude-code",
    "driver": "collaborative",
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [],
    "events": []
  },
  {
    "id": 41,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-process-foundation",
    "title": "SC Theme Toggle — CSS custom properties + toggle mechanism",
    "status": "Done",
    "priority": "Medium",
    "outputs": [
      {
        "type": "PR",
        "ref": 66
      }
    ],
    "dates": {
      "created": "2026-03-06",
      "started": null,
      "completed": "2026-03-06"
    },
    "tool": "claude-code",
    "driver": "collaborative",
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [
      {
        "id": "d-meta-css-custom-properties",
        "title": "CSS Custom Properties Theme System",
        "chosen": "CSS custom properties with data-theme attribute",
        "alternatives": [
          "Tailwind dark mode class",
          "CSS-in-JS theme provider",
          "Separate CSS files per theme"
        ],
        "date": "2026-03-06"
      }
    ],
    "events": []
  },
  {
    "id": 42,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-process-foundation",
    "title": "SC Theme Toggle — Easter egg button (demo polish)",
    "status": "Done",
    "priority": "Low",
    "outputs": [
      {
        "type": "PR",
        "ref": 80
      }
    ],
    "dates": {
      "created": "2026-03-06",
      "started": null,
      "completed": "2026-03-06"
    },
    "tool": "claude-code",
    "driver": "collaborative",
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [],
    "events": []
  },
  {
    "id": 43,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-process-foundation",
    "title": "Fix category bar + parent date bar regressions (SC theme)",
    "status": "Done",
    "priority": "High",
    "outputs": [
      {
        "type": "PR",
        "ref": 71
      }
    ],
    "dates": {
      "created": "2026-03-06",
      "started": null,
      "completed": "2026-03-06"
    },
    "tool": "claude-code",
    "driver": "collaborative",
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [],
    "events": []
  },
  {
    "id": 44,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-process-foundation",
    "title": "Time Machine — Michael's feedback pass",
    "status": "Cancelled",
    "priority": "Medium",
    "outputs": [
      {
        "type": "PR",
        "ref": 67
      }
    ],
    "dates": {
      "created": "2026-03-06",
      "started": null,
      "completed": "2026-03-06"
    },
    "tool": null,
    "driver": "collaborative",
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [],
    "events": [
      {
        "type": "dead-end",
        "date": "2026-03-06",
        "note": "Time Machine Feature on History Tab — Slider-based timeline with expandable snapshot cards"
      },
      {
        "type": "completion",
        "date": "2026-03-23",
        "note": "Timeline Overhaul Started (#67) — Horizontal timeline with session milestones and expand-to-full-view"
      }
    ]
  },
  {
    "id": 45,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-process-foundation",
    "title": "Trigger baseline dependency audit runs (manual)",
    "status": "Done",
    "priority": "Low",
    "outputs": [],
    "dates": {
      "created": "2026-03-06",
      "started": null,
      "completed": "2026-03-06"
    },
    "tool": "claude-code",
    "driver": "collaborative",
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [
      {
        "id": "d-meta-vite8-migration",
        "title": "Vite 8 (Rolldown) Migration — All Projects",
        "chosen": "Vite 8 + Rolldown across all projects, sequential per-project migration",
        "alternatives": [
          "Stay on Vite 6/7",
          "Migrate one project at a time over multiple sessions"
        ],
        "date": "2026-03-14"
      }
    ],
    "events": [
      {
        "type": "completion",
        "date": "2026-03-13",
        "note": "Cross-Project Tooling Sweep — Standardized CI gates + automated dependency updates across all repos"
      },
      {
        "type": "completion",
        "date": "2026-04-01",
        "note": "PAT Audit & JYNAX_PAT Secret Rollout — Single PAT with appropriate scopes, set as repo secret on all projects"
      }
    ]
  },
  {
    "id": 46,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-process-foundation",
    "title": "Phase 1 Data Model Extension",
    "status": "Done",
    "priority": "Medium",
    "outputs": [
      {
        "type": "PR",
        "ref": 75
      },
      {
        "type": "PR",
        "ref": 76
      }
    ],
    "dates": {
      "created": "2026-03-08",
      "started": "2026-03-08",
      "completed": "2026-03-08"
    },
    "tool": "claude-code",
    "driver": "collaborative",
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [],
    "events": [
      {
        "type": "completion",
        "date": "2026-03-06",
        "note": "Data Model Extension — Phase 1 — Optional fields on existing types + full backfill"
      }
    ]
  },
  {
    "id": 47,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-process-foundation",
    "title": "Add Item-B-Gone and Vuln Bank Projects",
    "status": "Done",
    "priority": "Medium",
    "outputs": [
      {
        "type": "PR",
        "ref": 77
      }
    ],
    "dates": {
      "created": "2026-03-08",
      "started": "2026-03-08",
      "completed": "2026-03-08"
    },
    "tool": "claude-code",
    "driver": "collaborative",
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [],
    "events": []
  },
  {
    "id": 48,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-process-foundation",
    "title": "Add designer credit to header (\"Designed by Michael\")",
    "status": "Done",
    "priority": "Low",
    "outputs": [
      {
        "type": "PR",
        "ref": 78
      }
    ],
    "dates": {
      "created": "2026-03-08",
      "started": null,
      "completed": "2026-03-08"
    },
    "tool": "claude-code",
    "driver": "collaborative",
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [],
    "events": []
  },
  {
    "id": 49,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-process-foundation",
    "title": "Parse ChatGPT export for missing session data",
    "status": "Done",
    "priority": "Medium",
    "outputs": [
      {
        "type": "PR",
        "ref": 84
      }
    ],
    "dates": {
      "created": "2026-03-10",
      "started": null,
      "completed": "2026-03-10"
    },
    "tool": "claude-code",
    "driver": "collaborative",
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [],
    "events": []
  },
  {
    "id": 50,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-process-foundation",
    "title": "Backfill missing planning sessions (meta, remnants, bip placeholder)",
    "status": "Done",
    "priority": "Medium",
    "outputs": [
      {
        "type": "PR",
        "ref": 78
      }
    ],
    "dates": {
      "created": "2026-03-09",
      "started": null,
      "completed": "2026-03-09"
    },
    "tool": "claude-code",
    "driver": "collaborative",
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [],
    "events": []
  },
  {
    "id": 51,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-process-foundation",
    "title": "Remove redundant \"CHAPTER\" label from Stacked Tree cards",
    "status": "Done",
    "priority": "Low",
    "outputs": [
      {
        "type": "PR",
        "ref": 80
      }
    ],
    "dates": {
      "created": "2026-03-09",
      "started": null,
      "completed": "2026-03-09"
    },
    "tool": "claude-code",
    "driver": "collaborative",
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [],
    "events": []
  },
  {
    "id": 52,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-process-foundation",
    "title": "Decision Tree missing recent chapters/decisions (post Mar 4)",
    "status": "Done",
    "priority": "Medium",
    "outputs": [
      {
        "type": "PR",
        "ref": 80
      }
    ],
    "dates": {
      "created": "2026-03-09",
      "started": null,
      "completed": "2026-03-09"
    },
    "tool": "claude-code",
    "driver": "collaborative",
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [],
    "events": []
  },
  {
    "id": 53,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-process-foundation",
    "title": "Phase 3 Cross-Project Visuals",
    "status": "Done",
    "priority": "Medium",
    "outputs": [
      {
        "type": "PR",
        "ref": 81
      }
    ],
    "dates": {
      "created": "2026-03-09",
      "started": "2026-03-09",
      "completed": "2026-03-09"
    },
    "tool": "claude-code",
    "driver": "collaborative",
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [],
    "events": [
      {
        "type": "completion",
        "date": "2026-03-11",
        "note": "Project Milestone Markers — Milestone array on project data + conditional timeline markers"
      }
    ]
  },
  {
    "id": 54,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-process-foundation",
    "title": "Playwright — Stacked Tree deep interaction tests",
    "status": "Done",
    "priority": "Medium",
    "outputs": [
      {
        "type": "PR",
        "ref": 87
      }
    ],
    "dates": {
      "created": "2026-03-10",
      "started": null,
      "completed": "2026-03-10"
    },
    "tool": "claude-code",
    "driver": "collaborative",
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [],
    "events": []
  },
  {
    "id": 55,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-process-foundation",
    "title": "Playwright — Metrics Dashboard deep interaction tests",
    "status": "Done",
    "priority": "Medium",
    "outputs": [
      {
        "type": "PR",
        "ref": 87
      }
    ],
    "dates": {
      "created": "2026-03-10",
      "started": null,
      "completed": "2026-03-10"
    },
    "tool": "claude-code",
    "driver": "collaborative",
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [],
    "events": []
  },
  {
    "id": 56,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-process-foundation",
    "title": "Playwright — Canvas View & How We Work overlay tests",
    "status": "Done",
    "priority": "Low",
    "outputs": [
      {
        "type": "PR",
        "ref": 87
      }
    ],
    "dates": {
      "created": "2026-03-10",
      "started": null,
      "completed": "2026-03-10"
    },
    "tool": "claude-code",
    "driver": "collaborative",
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [],
    "events": []
  },
  {
    "id": 57,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-process-foundation",
    "title": "Playwright — Regression guards & known bug tests",
    "status": "Done",
    "priority": "Medium",
    "outputs": [
      {
        "type": "PR",
        "ref": 87
      }
    ],
    "dates": {
      "created": "2026-03-10",
      "started": null,
      "completed": "2026-03-10"
    },
    "tool": "claude-code",
    "driver": "collaborative",
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [],
    "events": []
  },
  {
    "id": 58,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-process-foundation",
    "title": "Playwright — GitHub Actions CI",
    "status": "Done",
    "priority": "Medium",
    "outputs": [
      {
        "type": "PR",
        "ref": 92
      }
    ],
    "dates": {
      "created": "2026-03-10",
      "started": null,
      "completed": "2026-03-10"
    },
    "tool": "claude-code",
    "driver": "collaborative",
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [],
    "events": [
      {
        "type": "completion",
        "date": "2026-03-10",
        "note": "GitHub Actions CI for Playwright — GitHub Actions with Playwright Chromium"
      }
    ]
  },
  {
    "id": 59,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-process-foundation",
    "title": "Phase Cards — Remove Cursor, Add Tooltip",
    "status": "Done",
    "priority": "Medium",
    "outputs": [
      {
        "type": "PR",
        "ref": 89
      }
    ],
    "dates": {
      "created": "2026-03-10",
      "started": "2026-03-10",
      "completed": "2026-03-10"
    },
    "tool": "claude-code",
    "driver": "collaborative",
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [],
    "events": []
  },
  {
    "id": 60,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-process-foundation",
    "title": "Driver Breakdown — Rename Labels, Add Human-Only",
    "status": "Done",
    "priority": "Medium",
    "outputs": [
      {
        "type": "PR",
        "ref": 89
      }
    ],
    "dates": {
      "created": "2026-03-10",
      "started": "2026-03-10",
      "completed": "2026-03-10"
    },
    "tool": "claude-code",
    "driver": "collaborative",
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [],
    "events": [
      {
        "type": "completion",
        "date": "2026-03-10",
        "note": "Driver Label Rename — \"AI Only\" to \"Agent-Led\" — Agent-Led / Collaborative / Human Only taxonomy"
      }
    ]
  },
  {
    "id": 61,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-process-foundation",
    "title": "Bug Status Color Verify",
    "status": "Done",
    "priority": "Medium",
    "outputs": [
      {
        "type": "PR",
        "ref": 89
      }
    ],
    "dates": {
      "created": "2026-03-10",
      "started": "2026-03-10",
      "completed": "2026-03-10"
    },
    "tool": "claude-code",
    "driver": "collaborative",
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [],
    "events": []
  },
  {
    "id": 62,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-process-foundation",
    "title": "Donut Chart — Center, Stack Legend",
    "status": "Done",
    "priority": "Medium",
    "outputs": [
      {
        "type": "PR",
        "ref": 89
      }
    ],
    "dates": {
      "created": "2026-03-10",
      "started": "2026-03-10",
      "completed": "2026-03-10"
    },
    "tool": "claude-code",
    "driver": "collaborative",
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [],
    "events": []
  },
  {
    "id": 63,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-process-foundation",
    "title": "Research Sessions Card — Conditional Rendering",
    "status": "Done",
    "priority": "Medium",
    "outputs": [
      {
        "type": "PR",
        "ref": 89
      }
    ],
    "dates": {
      "created": "2026-03-10",
      "started": "2026-03-10",
      "completed": "2026-03-10"
    },
    "tool": "claude-code",
    "driver": "collaborative",
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [],
    "events": [
      {
        "type": "completion",
        "date": "2026-03-10",
        "note": "Research Sessions — Dynamic Rendering — Dynamic conditional rendering based on session phase data"
      }
    ]
  },
  {
    "id": 64,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-process-foundation",
    "title": "Planning/Human-Only Session Logging Gap (doc only)",
    "status": "Done",
    "priority": "Medium",
    "outputs": [],
    "dates": {
      "created": "2026-03-10",
      "started": "2026-03-10",
      "completed": "2026-03-10"
    },
    "tool": "claude-code",
    "driver": "collaborative",
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [],
    "events": []
  },
  {
    "id": 66,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-process-foundation",
    "title": "PR Timestamp Enrichment — Actual Task Duration from GitHub API",
    "status": "Queued",
    "priority": "Medium",
    "outputs": [],
    "dates": {
      "created": "2026-03-11",
      "started": null,
      "completed": null
    },
    "tool": "claude-code",
    "driver": null,
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [],
    "events": [
      {
        "type": "completion",
        "date": "2026-03-10",
        "note": "PR Timestamp Enrichment — GitHub API script + enriched PRDetail type"
      }
    ]
  },
  {
    "id": 67,
    "project": "meta",
    "touches": [],
    "epic": null,
    "title": "History Timeline Overhaul — Replace Time Machine with Horizontal Timeline",
    "status": "Queued",
    "priority": "Medium",
    "outputs": [],
    "dates": {
      "created": "2026-03-12T00:00:00.000Z",
      "started": null,
      "completed": null
    },
    "tool": null,
    "driver": null,
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [],
    "events": []
  },
  {
    "id": 68,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-day-block-v1",
    "title": "Decisions drop to zero in recent sessions",
    "status": "Done",
    "priority": "High",
    "outputs": [
      {
        "type": "PR",
        "ref": 106
      }
    ],
    "dates": {
      "created": "2026-03-13",
      "started": null,
      "completed": "2026-03-13"
    },
    "tool": "claude-code",
    "driver": "collaborative",
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [],
    "events": []
  },
  {
    "id": 69,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-day-block-v1",
    "title": "Collaborative driver missing from most days",
    "status": "Done",
    "priority": "High",
    "outputs": [
      {
        "type": "PR",
        "ref": 106
      }
    ],
    "dates": {
      "created": "2026-03-13",
      "started": null,
      "completed": "2026-03-13"
    },
    "tool": "claude-code",
    "driver": "collaborative",
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [],
    "events": []
  },
  {
    "id": 70,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-day-block-v1",
    "title": "Fixed (PR #xx) badge inherits wrong color",
    "status": "Done",
    "priority": "Medium",
    "outputs": [
      {
        "type": "PR",
        "ref": 107
      }
    ],
    "dates": {
      "created": "2026-03-13",
      "started": null,
      "completed": "2026-03-13"
    },
    "tool": "claude-code",
    "driver": "collaborative",
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [],
    "events": []
  },
  {
    "id": 71,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-day-block-v1",
    "title": "Layout shift and scrollbar pop-in on row expand",
    "status": "Done",
    "priority": "Medium",
    "outputs": [
      {
        "type": "PR",
        "ref": 107
      }
    ],
    "dates": {
      "created": "2026-03-13",
      "started": null,
      "completed": "2026-03-13"
    },
    "tool": "claude-code",
    "driver": "collaborative",
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [],
    "events": []
  },
  {
    "id": 72,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-day-block-v1",
    "title": "Driver Breakdown chart x-axis is inverted",
    "status": "Done",
    "priority": "Medium",
    "outputs": [
      {
        "type": "PR",
        "ref": 107
      }
    ],
    "dates": {
      "created": "2026-03-13",
      "started": null,
      "completed": "2026-03-13"
    },
    "tool": "claude-code",
    "driver": "collaborative",
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [],
    "events": []
  },
  {
    "id": 73,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-day-block-v1",
    "title": "Bugs tab missing day-level grouping",
    "status": "Done",
    "priority": "Medium",
    "outputs": [
      {
        "type": "PR",
        "ref": 109
      }
    ],
    "dates": {
      "created": "2026-03-13",
      "started": null,
      "completed": "2026-03-13"
    },
    "tool": "claude-code",
    "driver": "collaborative",
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [],
    "events": []
  },
  {
    "id": 74,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-day-block-v1",
    "title": "Day/Session toggle should control both Session charts",
    "status": "Done",
    "priority": "Medium",
    "outputs": [
      {
        "type": "PR",
        "ref": 109
      }
    ],
    "dates": {
      "created": "2026-03-13",
      "started": null,
      "completed": "2026-03-13"
    },
    "tool": "claude-code",
    "driver": "collaborative",
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [],
    "events": []
  },
  {
    "id": 75,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-day-block-v1",
    "title": "X-axis tick density on Avg Task Time chart",
    "status": "Done",
    "priority": "Medium",
    "outputs": [
      {
        "type": "PR",
        "ref": 109
      }
    ],
    "dates": {
      "created": "2026-03-13",
      "started": null,
      "completed": "2026-03-13"
    },
    "tool": "claude-code",
    "driver": "collaborative",
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [],
    "events": []
  },
  {
    "id": 76,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-day-block-v1",
    "title": "Grouped dropdown project switcher",
    "status": "Done",
    "priority": "Medium",
    "outputs": [
      {
        "type": "PR",
        "ref": 110
      }
    ],
    "dates": {
      "created": "2026-03-13",
      "started": null,
      "completed": "2026-03-13"
    },
    "tool": "claude-code",
    "driver": "collaborative",
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [],
    "events": []
  },
  {
    "id": 77,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-day-block-v1",
    "title": "Phase cards — clickable + active/inactive visual treatment",
    "status": "Done",
    "priority": "Medium",
    "outputs": [
      {
        "type": "PR",
        "ref": 110
      }
    ],
    "dates": {
      "created": "2026-03-13",
      "started": null,
      "completed": "2026-03-13"
    },
    "tool": "claude-code",
    "driver": "collaborative",
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [],
    "events": []
  },
  {
    "id": 78,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-day-block-v1",
    "title": "Joint project type — workflow check-in + data model",
    "status": "Done",
    "priority": "Medium",
    "outputs": [
      {
        "type": "PR",
        "ref": 111
      }
    ],
    "dates": {
      "created": "2026-03-13",
      "started": null,
      "completed": "2026-03-13"
    },
    "tool": "claude-code",
    "driver": "collaborative",
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [],
    "events": []
  },
  {
    "id": 79,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-day-block-v1",
    "title": "Human time attribution rule for Driver Breakdown",
    "status": "Done",
    "priority": "Medium",
    "outputs": [
      {
        "type": "PR",
        "ref": 110
      }
    ],
    "dates": {
      "created": "2026-03-13",
      "started": null,
      "completed": "2026-03-13"
    },
    "tool": "claude-code",
    "driver": "collaborative",
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [],
    "events": []
  },
  {
    "id": 81,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-day-block-v1",
    "title": "Data push: Sessions 54-66+",
    "status": "Done",
    "priority": "Medium",
    "outputs": [
      {
        "type": "PR",
        "ref": 136
      }
    ],
    "dates": {
      "created": "2026-03-26",
      "started": null,
      "completed": "2026-03-28"
    },
    "tool": "claude-code",
    "driver": null,
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [],
    "events": []
  },
  {
    "id": 82,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-day-block-v1",
    "title": "LOC graph overflow for several projects",
    "status": "Done",
    "priority": "Medium",
    "outputs": [
      {
        "type": "PR",
        "ref": 135
      }
    ],
    "dates": {
      "created": "2026-03-26",
      "started": null,
      "completed": "2026-03-28"
    },
    "tool": "claude-code",
    "driver": null,
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [],
    "events": [
      {
        "type": "discovery",
        "date": "2026-03-28",
        "note": "IBG LOC Correction — Exclude Auto-Generated Data — Gitignore auto-generated data files, correct historical metrics"
      }
    ]
  },
  {
    "id": 83,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-day-block-v1",
    "title": "Cross-project data correlation insights",
    "status": "Done",
    "priority": "Medium",
    "outputs": [
      {
        "type": "PR",
        "ref": 138
      }
    ],
    "dates": {
      "created": "2026-03-26",
      "started": null,
      "completed": "2026-03-29"
    },
    "tool": "claude-code",
    "driver": null,
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [
      {
        "id": "d-meta-cross-project-insights",
        "title": "Cross-Project Insights View (#83)",
        "chosen": "Portfolio insights as \"All Projects\" entry in existing switcher",
        "alternatives": [
          "Separate analytics page",
          "Dashboard widgets on each project view"
        ],
        "date": "2026-03-29"
      }
    ],
    "events": []
  },
  {
    "id": 84,
    "project": "meta",
    "touches": [],
    "epic": null,
    "title": "Full Pro UX/UI review with accessibility audit",
    "status": "Queued",
    "priority": "Medium",
    "outputs": [],
    "dates": {
      "created": "2026-03-30T00:00:00.000Z",
      "started": null,
      "completed": null
    },
    "tool": null,
    "driver": null,
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [],
    "events": []
  },
  {
    "id": 85,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-day-block-v1",
    "title": "InsightsView Readability Pass",
    "status": "Done",
    "priority": "Medium",
    "outputs": [
      {
        "type": "PR",
        "ref": 145
      }
    ],
    "dates": {
      "created": "2026-03-31",
      "started": null,
      "completed": "2026-03-31"
    },
    "tool": "claude-code",
    "driver": null,
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [
      {
        "id": "d-meta-narrative-redesign",
        "title": "InsightsView Narrative Redesign — 5 Chapters Replace 6 Tabs",
        "chosen": "5 narrative chapters with prose + charts, evidence-backed claims",
        "alternatives": [
          "Keep 6-tab layout with better data",
          "Simplified 3-card summary"
        ],
        "date": "2026-03-30"
      }
    ],
    "events": []
  },
  {
    "id": 86,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-day-block-v1",
    "title": "Velocity Scatter Plot Label Collision Fix",
    "status": "Done",
    "priority": "Medium",
    "outputs": [
      {
        "type": "PR",
        "ref": 163
      }
    ],
    "dates": {
      "created": "2026-04-01",
      "started": null,
      "completed": "2026-04-11"
    },
    "tool": "claude-code",
    "driver": null,
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [
      151
    ],
    "decisions": [],
    "events": []
  },
  {
    "id": 87,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-day-block-v1",
    "title": "Data Correctness Sprint",
    "status": "Done",
    "priority": "Medium",
    "outputs": [
      {
        "type": "PR",
        "ref": 162
      },
      {
        "type": "PR",
        "ref": 163
      }
    ],
    "dates": {
      "created": "2026-04-11",
      "started": "2026-04-11",
      "completed": "2026-04-11"
    },
    "tool": "claude-code",
    "driver": "collaborative",
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [],
    "events": []
  },
  {
    "id": 88,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-canvas-mindmap-retired",
    "title": "Canvas Mind Map Checkpoint 2",
    "status": "Done",
    "priority": "Medium",
    "outputs": [
      {
        "type": "PR",
        "ref": 169
      }
    ],
    "dates": {
      "created": "2026-04-12",
      "started": "2026-04-12",
      "completed": "2026-04-12"
    },
    "tool": "claude-code",
    "driver": "collaborative",
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [],
    "events": []
  },
  {
    "id": 89,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-design-polish",
    "title": "Design Polish Pass",
    "status": "Done",
    "priority": "Medium",
    "outputs": [
      {
        "type": "PR",
        "ref": 154
      }
    ],
    "dates": {
      "created": "2026-04-07",
      "started": "2026-04-07",
      "completed": "2026-04-07"
    },
    "tool": "claude-code",
    "driver": "collaborative",
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [
      {
        "id": "d-meta-shared-design-system",
        "title": "Shared Design System — jynaxxapps-tokens",
        "chosen": "Shared npm package with CSS custom properties",
        "alternatives": [
          "Per-project token files",
          "Tailwind preset package",
          "Copy-paste tokens"
        ],
        "date": "2026-03-31"
      },
      {
        "id": "d-meta-changelog-system",
        "title": "Deployment Release Notes System — Changelog Across 7 Apps",
        "chosen": "PR template + GH Actions + CHANGELOG.json + /changelog route",
        "alternatives": [
          "Manual CHANGELOG.md",
          "Release-based notes",
          "Third-party changelog service"
        ],
        "date": "2026-03-31"
      }
    ],
    "events": [
      {
        "type": "completion",
        "date": "2026-04-07",
        "note": "Emil Kowalski Design Polish — 15 Issues Fixed — Systematic audit against Emil Kowalski checklist + batch fixes"
      }
    ]
  },
  {
    "id": 90,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-day-block-v1",
    "title": "Decision Tree Data Backfill",
    "status": "Done",
    "priority": "High",
    "outputs": [
      {
        "type": "PR",
        "ref": 155
      }
    ],
    "dates": {
      "created": "2026-04-08",
      "started": null,
      "completed": "2026-04-08"
    },
    "tool": "claude-code",
    "driver": null,
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [],
    "events": []
  },
  {
    "id": 91,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-canvas-mindmap-retired",
    "title": "Canvas Mode Redesign (Mind Map) — RETIRED",
    "status": "Retired",
    "priority": "Medium",
    "outputs": [],
    "dates": {
      "created": "2026-04-08",
      "started": null,
      "completed": "Retired Apr 14"
    },
    "tool": null,
    "driver": null,
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [],
    "events": []
  },
  {
    "id": 92,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-day-block-v1",
    "title": "Meta Tracker Decision Tree Backfill (Sessions 54-82)",
    "status": "Done",
    "priority": "High",
    "outputs": [
      {
        "type": "PR",
        "ref": 157
      }
    ],
    "dates": {
      "created": "2026-04-08",
      "started": null,
      "completed": "2026-04-08"
    },
    "tool": "claude-code",
    "driver": null,
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [
      {
        "id": "d-meta-decision-tree-self-backfill",
        "title": "Meta Tracker Self-Backfill — Sessions 54-82",
        "chosen": "Comprehensive backfill from MEMORY.md, PR history, and task files",
        "alternatives": [
          "Incremental catch-up over multiple sessions",
          "Skip historical backfill and start fresh"
        ],
        "date": "2026-04-08"
      }
    ],
    "events": []
  },
  {
    "id": 93,
    "project": "meta",
    "touches": [],
    "epic": "epic-data-model-rethink",
    "title": "Bug Discovery Chart Rethink",
    "status": "Cancelled",
    "priority": "Medium",
    "outputs": [],
    "dates": {
      "created": "2026-04-08T00:00:00.000Z",
      "started": null,
      "completed": null
    },
    "tool": null,
    "driver": null,
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [
      {
        "id": "d-meta-data-viz-heuristics",
        "title": "Data Viz Heuristics Standard — 5-Rule System",
        "chosen": "5-rule heuristic standard derived from data viz research",
        "alternatives": [
          "Chart-by-chart ad hoc fixes",
          "Third-party charting library with built-in best practices"
        ],
        "date": "2026-04-01"
      }
    ],
    "events": []
  },
  {
    "id": 94,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-day-block-v1",
    "title": "Backfill Bugs Since Mar 15",
    "status": "Done",
    "priority": "Medium",
    "outputs": [
      {
        "type": "PR",
        "ref": 161
      },
      {
        "type": "PR",
        "ref": 162
      }
    ],
    "dates": {
      "created": "2026-04-11",
      "started": null,
      "completed": "2026-04-11"
    },
    "tool": "claude-code",
    "driver": null,
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [],
    "events": []
  },
  {
    "id": 95,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-day-block-v1",
    "title": "Insights Compute Refactor (derive totals from *Days not legacy arrays)",
    "status": "Done",
    "priority": "Medium",
    "outputs": [
      {
        "type": "PR",
        "ref": 162
      }
    ],
    "dates": {
      "created": "2026-04-11",
      "started": null,
      "completed": "2026-04-11"
    },
    "tool": "claude-code",
    "driver": null,
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [],
    "events": []
  },
  {
    "id": 96,
    "project": "meta",
    "touches": [],
    "epic": "epic-data-model-rethink",
    "title": "Full Data Audit",
    "status": "Cancelled",
    "priority": "Medium",
    "outputs": [],
    "dates": {
      "created": "2026-04-12T00:00:00.000Z",
      "started": null,
      "completed": null
    },
    "tool": null,
    "driver": null,
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [
      {
        "id": "d-meta-day-block-model",
        "title": "Day/Block Data Model Migration",
        "chosen": "DayEntry + WorkBlock hierarchy with automated migration script",
        "alternatives": [
          "Keep session-based model",
          "Hybrid model with optional day grouping"
        ],
        "date": "2026-03-12"
      }
    ],
    "events": []
  },
  {
    "id": 97,
    "project": "meta",
    "touches": [],
    "epic": null,
    "title": "URL routing + deep links",
    "status": "Queued",
    "priority": "Medium",
    "outputs": [],
    "dates": {
      "created": "2026-04-14T00:00:00.000Z",
      "started": null,
      "completed": null
    },
    "tool": null,
    "driver": null,
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [],
    "events": []
  },
  {
    "id": 98,
    "project": "meta",
    "touches": [],
    "epic": null,
    "title": "Why AI models can't see MT",
    "status": "Queued",
    "priority": "Medium",
    "outputs": [],
    "dates": {
      "created": "2026-04-14T00:00:00.000Z",
      "started": null,
      "completed": null
    },
    "tool": null,
    "driver": null,
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [],
    "events": []
  },
  {
    "id": 99,
    "project": "meta",
    "touches": [],
    "epic": "epic-data-model-rethink",
    "title": "Data issue after recent changes",
    "status": "Done",
    "priority": "High",
    "outputs": [
      {
        "type": "PR",
        "ref": 174
      }
    ],
    "dates": {
      "created": "2026-04-14T00:00:00.000Z",
      "started": "2026-04-14T00:00:00.000Z",
      "completed": "2026-04-14T00:00:00.000Z"
    },
    "tool": "claude-code",
    "driver": "collaborative",
    "effort": {
      "estimate": "~1h",
      "actual": "~1h"
    },
    "depends_on": [],
    "decisions": [],
    "events": []
  },
  {
    "id": 100,
    "project": "meta",
    "touches": [],
    "epic": "epic-data-model-rethink",
    "title": "Decision Node Audit (Reclassify Non-Forks)",
    "status": "Cancelled",
    "priority": "Medium",
    "outputs": [],
    "dates": {
      "created": "2026-04-14T00:00:00.000Z",
      "started": null,
      "completed": null
    },
    "tool": null,
    "driver": null,
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [],
    "events": []
  },
  {
    "id": 101,
    "project": "meta",
    "touches": [],
    "epic": "epic-data-model-rethink",
    "title": "Data Model Rethink — Brainstorm and Implementation",
    "status": "In Progress",
    "priority": "High",
    "outputs": [
      {
        "type": "Spec",
        "ref": "specs/2026-04-14-data-model-rethink.md"
      }
    ],
    "dates": {
      "created": "2026-04-14T00:00:00.000Z",
      "started": "2026-04-14T00:00:00.000Z",
      "completed": null
    },
    "tool": "claude-code",
    "driver": "collaborative",
    "effort": {
      "estimate": "~15 sessions across Phases 1–5",
      "actual": null
    },
    "depends_on": [],
    "decisions": [],
    "events": []
  },
  {
    "id": 102,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-inception",
    "title": "Decisions & Metrics Template Design",
    "status": "Done",
    "priority": "Medium",
    "outputs": [],
    "dates": {
      "created": "2026-03-02",
      "started": "2026-03-02",
      "completed": "2026-03-02"
    },
    "tool": "cowork",
    "driver": "collaborative",
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [
      {
        "id": "d-meta-stack-selection",
        "title": "Architecture & Stack Selection",
        "chosen": "Same stack as BIP  —  Vite + React + TypeScript + Tailwind + Cloudflare Pages",
        "alternatives": [
          "Different framework",
          "Adding a backend with Cloudflare D1/KV"
        ],
        "date": "2026-02-26"
      },
      {
        "id": "d-meta-react-flow",
        "title": "React Flow for Visualization",
        "chosen": "React Flow (@xyflow/react v12)",
        "alternatives": [
          "D3.js",
          "Recharts (wrong tool for graphs)",
          "Custom canvas rendering"
        ],
        "date": "2026-02-26"
      },
      {
        "id": "d-meta-hardcoded-json",
        "title": "Hardcoded JSON Data Model",
        "chosen": "TypeScript file with typed objects",
        "alternatives": [
          "JSON files at runtime",
          "Cloudflare Worker API",
          "Simple CMS"
        ],
        "date": "2026-02-26"
      }
    ],
    "events": []
  },
  {
    "id": 103,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-inception",
    "title": "Metrics Dashboard & Workflow Design",
    "status": "Done",
    "priority": "Medium",
    "outputs": [],
    "dates": {
      "created": "2026-03-02",
      "started": "2026-03-02",
      "completed": "2026-03-02"
    },
    "tool": "cowork",
    "driver": "collaborative",
    "effort": {
      "estimate": null,
      "actual": null
    },
    "depends_on": [],
    "decisions": [],
    "events": []
  },
  {
    "id": 104,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-inception",
    "title": "Scaffold & Auth",
    "status": "Done",
    "priority": "Medium",
    "outputs": [],
    "dates": {
      "created": "2026-02-26",
      "started": "2026-02-26",
      "completed": "2026-02-26"
    },
    "tool": "cowork",
    "driver": "collaborative",
    "effort": {
      "estimate": null,
      "actual": "~180min"
    },
    "depends_on": [],
    "decisions": [],
    "events": []
  },
  {
    "id": 105,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-inception",
    "title": "Vertical Tree",
    "status": "Done",
    "priority": "Medium",
    "outputs": [],
    "dates": {
      "created": "2026-02-26",
      "started": "2026-02-26",
      "completed": "2026-02-26"
    },
    "tool": "cowork",
    "driver": "collaborative",
    "effort": {
      "estimate": null,
      "actual": "~120min"
    },
    "depends_on": [],
    "decisions": [
      {
        "id": "d-meta-horizontal-layout",
        "title": "Horizontal Tree Layout (v0.1-v0.3)",
        "chosen": "Left-to-right branching tree with timeline metaphor",
        "alternatives": [
          "Vertical stacking",
          "Radial layout",
          "Force-directed graph"
        ],
        "date": "2026-02-26"
      }
    ],
    "events": []
  },
  {
    "id": 106,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-inception",
    "title": "React Flow Rebuild",
    "status": "Done",
    "priority": "Medium",
    "outputs": [],
    "dates": {
      "created": "2026-02-26",
      "started": "2026-02-26",
      "completed": "2026-02-26"
    },
    "tool": "cowork",
    "driver": "collaborative",
    "effort": {
      "estimate": null,
      "actual": "~180min"
    },
    "depends_on": [],
    "decisions": [],
    "events": [
      {
        "type": "completion",
        "date": "2026-02-26",
        "note": "Filter Bar Implementation — Inline button bar with fixed filter options"
      },
      {
        "type": "completion",
        "date": "2026-02-26",
        "note": "Category Tagging (Technical vs. Functional) — Two categories: Technical and Functional"
      }
    ]
  },
  {
    "id": 107,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-layout-wars",
    "title": "Overlap & Filters",
    "status": "Done",
    "priority": "Medium",
    "outputs": [],
    "dates": {
      "created": "2026-02-27",
      "started": "2026-02-27",
      "completed": "2026-02-27"
    },
    "tool": "cowork",
    "driver": "collaborative",
    "effort": {
      "estimate": null,
      "actual": "~120min"
    },
    "depends_on": [],
    "decisions": [],
    "events": [
      {
        "type": "completion",
        "date": "2026-02-27",
        "note": "Expandable/Collapsible Phases — Collapsed-by-default with summary counts, first phase expanded"
      },
      {
        "type": "completion",
        "date": "2026-02-27",
        "note": "Handle Routing Overhaul — Named handles with position-aware routing per edge type"
      },
      {
        "type": "completion",
        "date": "2026-02-27",
        "note": "Dynamic Detail Height — Dynamic 60px adjustment on detail expand"
      }
    ]
  },
  {
    "id": 108,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-layout-wars",
    "title": "Layout Refactor",
    "status": "Done",
    "priority": "Medium",
    "outputs": [],
    "dates": {
      "created": "2026-02-28",
      "started": "2026-02-28",
      "completed": "2026-02-28"
    },
    "tool": "cowork",
    "driver": "collaborative",
    "effort": {
      "estimate": null,
      "actual": "~180min"
    },
    "depends_on": [],
    "decisions": [
      {
        "id": "d-meta-minimap-removal",
        "title": "MiniMap Removal",
        "chosen": "Remove MiniMap entirely",
        "alternatives": [
          "Styling it for dark theme",
          "Moving it to a toggle"
        ],
        "date": "2026-02-28"
      }
    ],
    "events": []
  },
  {
    "id": 109,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-layout-wars",
    "title": "Data Model Alignment",
    "status": "Done",
    "priority": "Medium",
    "outputs": [],
    "dates": {
      "created": "2026-02-28",
      "started": "2026-02-28",
      "completed": "2026-02-28"
    },
    "tool": "cowork",
    "driver": "collaborative",
    "effort": {
      "estimate": null,
      "actual": "~180min"
    },
    "depends_on": [],
    "decisions": [
      {
        "id": "d-meta-multi-project",
        "title": "Multi-Project Support with Project Selector",
        "chosen": "Button selector with state reset on switch",
        "alternatives": [
          "Dropdown menu",
          "Separate routes per project",
          "Tabs"
        ],
        "date": "2026-02-28"
      }
    ],
    "events": [
      {
        "type": "completion",
        "date": "2026-02-28",
        "note": "Phases Renamed to Chapters — Full rename across codebase"
      },
      {
        "type": "completion",
        "date": "2026-02-28",
        "note": "Discovery and Pivot Node Types Added — First-class types with visual distinction"
      },
      {
        "type": "completion",
        "date": "2026-02-28",
        "note": "Category Expansion to Four — Four categories: Technical, Functional, UX/Design, Process"
      },
      {
        "type": "completion",
        "date": "2026-02-28",
        "note": "Build-Time Markdown Parser Deferred — Manual conversion now, automate later"
      },
      {
        "type": "completion",
        "date": "2026-02-28",
        "note": "Proportional Detail Height Fix — Proportional to character count"
      }
    ]
  },
  {
    "id": 110,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-dashboard-stacked",
    "title": "Spine Fix & Dashboard",
    "status": "Done",
    "priority": "Medium",
    "outputs": [],
    "dates": {
      "created": "2026-03-02",
      "started": "2026-03-02",
      "completed": "2026-03-02"
    },
    "tool": "cowork",
    "driver": "collaborative",
    "effort": {
      "estimate": null,
      "actual": "~180min"
    },
    "depends_on": [],
    "decisions": [
      {
        "id": "d-meta-chapter-stats-simplified",
        "title": "Chapter Stats Simplified",
        "chosen": "Decision context only, metrics in Metrics view",
        "alternatives": [
          "Keeping all stats"
        ],
        "date": "2026-03-02"
      }
    ],
    "events": [
      {
        "type": "completion",
        "date": "2026-03-02",
        "note": "Spine Edge Offset Fix — Offset spine right (Option A)"
      },
      {
        "type": "completion",
        "date": "2026-03-02",
        "note": "View Switcher Added — Tab-style view switcher"
      },
      {
        "type": "completion",
        "date": "2026-03-02",
        "note": "Collapsible Filter Buttons — Hidden by default with toggle"
      }
    ]
  },
  {
    "id": 111,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-dashboard-stacked",
    "title": "UX Polish",
    "status": "Done",
    "priority": "Medium",
    "outputs": [],
    "dates": {
      "created": "2026-03-02",
      "started": "2026-03-02",
      "completed": "2026-03-02"
    },
    "tool": "cowork",
    "driver": "collaborative",
    "effort": {
      "estimate": null,
      "actual": "~120min"
    },
    "depends_on": [],
    "decisions": [
      {
        "id": "d-meta-overview-cleanup",
        "title": "Overview Tab Decluttered",
        "chosen": "Code metrics only in Metrics view; decision data stays in tree",
        "alternatives": [
          "Keeping all stats in both views"
        ],
        "date": "2026-03-02"
      }
    ],
    "events": [
      {
        "type": "completion",
        "date": "2026-03-02",
        "note": "Codebase Chart Converted to SVG Area Chart — Inline SVG area chart with gradient fill"
      },
      {
        "type": "completion",
        "date": "2026-03-02",
        "note": "Bug Breakdowns Converted to Donut Charts — SVG donut rings with staggered animation"
      },
      {
        "type": "completion",
        "date": "2026-03-02",
        "note": "Session Activity Vertical Bar Chart — Vertical grouped bars"
      },
      {
        "type": "completion",
        "date": "2026-03-02",
        "note": "Hover Tooltips Added Across All Charts — Unified tooltip pattern with dark blue hover highlight"
      }
    ]
  },
  {
    "id": 112,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-dashboard-stacked",
    "title": "Data Verification",
    "status": "Done",
    "priority": "Medium",
    "outputs": [],
    "dates": {
      "created": "2026-03-02",
      "started": "2026-03-02",
      "completed": "2026-03-02"
    },
    "tool": "cowork",
    "driver": "collaborative",
    "effort": {
      "estimate": null,
      "actual": "~60min"
    },
    "depends_on": [],
    "decisions": [],
    "events": [
      {
        "type": "completion",
        "date": "2026-03-02",
        "note": "Technical Review Checklist Added — Checklist in How We Work doc, matched to change type"
      }
    ]
  },
  {
    "id": 113,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-dashboard-stacked",
    "title": "Data Scrape",
    "status": "Done",
    "priority": "Medium",
    "outputs": [],
    "dates": {
      "created": "2026-03-02",
      "started": "2026-03-02",
      "completed": "2026-03-02"
    },
    "tool": "cowork",
    "driver": "agent-led",
    "effort": {
      "estimate": null,
      "actual": "~180min"
    },
    "depends_on": [],
    "decisions": [],
    "events": []
  },
  {
    "id": 114,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-dashboard-stacked",
    "title": "Dashboard Data Overhaul",
    "status": "Done",
    "priority": "Medium",
    "outputs": [],
    "dates": {
      "created": "2026-03-03",
      "started": "2026-03-03",
      "completed": "2026-03-03"
    },
    "tool": "cowork",
    "driver": "collaborative",
    "effort": {
      "estimate": null,
      "actual": "~180min"
    },
    "depends_on": [],
    "decisions": [
      {
        "id": "d-meta-keep-both-charts",
        "title": "Keep Both Code Tab Charts",
        "chosen": "Both charts retained, both upgraded to date-grouped pattern",
        "alternatives": [
          "Merging into a single chart"
        ],
        "date": "2026-03-03"
      }
    ],
    "events": [
      {
        "type": "completion",
        "date": "2026-03-03",
        "note": "Date-Grouped Collapsible Chart Sessions — Date-grouped rows with 8-row cap and expand/collapse"
      },
      {
        "type": "discovery",
        "date": "2026-03-03",
        "note": "Deep Code Review via Source Analysis — Fetch full source, DOM render, JavaScript pattern analysis"
      }
    ]
  },
  {
    "id": 115,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-dashboard-stacked",
    "title": "Stacked Tree View",
    "status": "Done",
    "priority": "Medium",
    "outputs": [],
    "dates": {
      "created": "2026-03-03",
      "started": "2026-03-03",
      "completed": "2026-03-03"
    },
    "tool": "cowork",
    "driver": "collaborative",
    "effort": {
      "estimate": null,
      "actual": "~180min"
    },
    "depends_on": [],
    "decisions": [
      {
        "id": "d-meta-stacked-tree-component",
        "title": "StackedTreeView Component Created",
        "chosen": "Separate component with inline styles, no React Flow dependency",
        "alternatives": [
          "Accordion within DecisionTree",
          "Separate route/page",
          "Markdown-rendered view"
        ],
        "date": "2026-03-03"
      }
    ],
    "events": [
      {
        "type": "completion",
        "date": "2026-03-03",
        "note": "Stacked/Canvas Toggle — Inline toggle with shared state, default to stacked"
      }
    ]
  },
  {
    "id": 116,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-dashboard-stacked",
    "title": "UX Final Pass",
    "status": "Done",
    "priority": "Medium",
    "outputs": [],
    "dates": {
      "created": "2026-03-03",
      "started": "2026-03-03",
      "completed": "2026-03-03"
    },
    "tool": "cowork",
    "driver": "collaborative",
    "effort": {
      "estimate": null,
      "actual": "~180min"
    },
    "depends_on": [],
    "decisions": [],
    "events": [
      {
        "type": "completion",
        "date": "2026-03-03",
        "note": "Font Size & Contrast Overhaul — Industry-standard minimums with WCAG AA muted color"
      },
      {
        "type": "completion",
        "date": "2026-03-03",
        "note": "Chapter Card Layout Restructure — Arrow next to title, stats-left, clickable badges as filters"
      },
      {
        "type": "completion",
        "date": "2026-03-03",
        "note": "Metrics Dashboard Improvements — Simplify and clarify with native tooltip handlers"
      },
      {
        "type": "completion",
        "date": "2026-03-03",
        "note": "Metrics Tab State Persistence — Callback prop syncing parent state"
      }
    ]
  },
  {
    "id": 117,
    "project": "meta",
    "touches": [],
    "epic": "epic-meta-dashboard-stacked",
    "title": "How We Work View",
    "status": "Done",
    "priority": "Medium",
    "outputs": [],
    "dates": {
      "created": "2026-03-03",
      "started": "2026-03-03",
      "completed": "2026-03-03"
    },
    "tool": "cowork",
    "driver": "collaborative",
    "effort": {
      "estimate": null,
      "actual": "~180min"
    },
    "depends_on": [],
    "decisions": [],
    "events": [
      {
        "type": "completion",
        "date": "2026-03-03",
        "note": "Adding a Process Reference View — Embedded interactive process page with internal tabs"
      },
      {
        "type": "completion",
        "date": "2026-03-03",
        "note": "TypeScript Conversion of JSX Prototype — Inline interfaces, self-contained component"
      },
      {
        "type": "completion",
        "date": "2026-03-03",
        "note": "Project-Agnostic View Behavior — Preserve process view on project switch, reset only metrics"
      }
    ]
  }
];
