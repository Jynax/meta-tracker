// GENERATED — DO NOT EDIT
// Run 'npm run generate:data' from the repo root to regenerate.
// Source: Co-work Projects/{Meta Tracker,_Shared}/{epics,tasks}
// See specs/2026-04-14-data-model-rethink.md.
import type { Epic, Task } from '../types/tracker';

export const generatedAt: string = "2026-04-15T21:28:06.457Z";

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
    "id": 93,
    "project": "meta",
    "touches": [],
    "epic": "epic-data-model-rethink",
    "title": "Bug Discovery Chart Rethink",
    "status": "Queued",
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
    "decisions": [],
    "events": []
  },
  {
    "id": 96,
    "project": "meta",
    "touches": [],
    "epic": "epic-data-model-rethink",
    "title": "Full Data Audit",
    "status": "Queued",
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
    "decisions": [],
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
  }
];
