// New data model types for the Epic/Task/Decision rethink.
// See specs/2026-04-14-data-model-rethink.md.
// Intentionally NOT re-exported through src/types/index.ts during Phase 1 —
// only the generated data file consumes these types until Phase 3.

export type EpicStatus = 'Queued' | 'In Progress' | 'Done' | 'Cancelled' | 'Retired';

export type TaskStatus = 'Queued' | 'In Progress' | 'Blocked' | 'Done' | 'Cancelled' | 'Retired';

export type Priority = 'Low' | 'Medium' | 'High' | 'Critical';

export type Tool = 'claude-code' | 'claude-ai' | 'cursor' | 'cowork' | 'manual' | 'mixed';

export type Driver = 'human' | 'agent-led' | 'collaborative';

export type OutputType = 'PR' | 'Spec' | 'Doc' | 'Brainstorm' | 'Other';

export interface TaskOutput {
  type: OutputType;
  ref: string | number;
}

export interface TaskDates {
  created: string;
  started: string | null;
  completed: string | null;
}

export interface TaskEffort {
  estimate: string | null;
  actual: string | null;
}

export interface Decision {
  id: string;
  title: string;
  chosen: string;
  alternatives: string[];
  rationale: string;
  date: string;
}

export type EventType = 'milestone' | 'discovery' | 'pivot' | 'dead-end' | 'completion';

export interface TaskEvent {
  type: EventType;
  date: string;
  note: string;
}

export interface Epic {
  id: string;
  project: string;           // 'meta' | 'shared' | 'bip' | ... | null-for-portfolio
  touches: string[];
  title: string;
  status: EpicStatus;
  startDate: string;
  endDate: string | null;
}

export interface Task {
  id: number;
  project: string;
  touches: string[];
  epic: string | null;        // nullable for Phase 1 orphan tasks
  title: string;
  status: TaskStatus;
  priority: Priority;
  outputs: TaskOutput[];
  dates: TaskDates;
  tool: Tool | null;
  driver: Driver | null;
  effort: TaskEffort;
  depends_on: number[];
  decisions: Decision[];
  events: TaskEvent[];
}
