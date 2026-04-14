export type NodeType = 'decision' | 'event' | 'dead-end' | 'discovery' | 'pivot';

export type NodeCategory = 'technical' | 'functional' | 'ux-design' | 'process';

export interface BaseNode {
  id: string;
  type: NodeType;
  category?: NodeCategory;
  dayId?: string;
  title: string;
  description: string;
  lesson?: string;
  /** Marks a node as a wayfinding anchor on the mind map — always labeled, rendered with emphasis regardless of zoom */
  featured?: boolean;
}

export interface DecisionNode extends BaseNode {
  type: 'decision';
  chosenPath: string;
  alternatives: string[];
}

export interface EventNode extends BaseNode {
  type: 'event';
}

export interface DeadEndNode extends BaseNode {
  type: 'dead-end';
  failureReason: string;
}

export interface DiscoveryNode extends BaseNode {
  type: 'discovery';
}

export interface PivotNode extends BaseNode {
  type: 'pivot';
  chosenPath: string;
  alternatives: string[];
}

export type ProjectNode = DecisionNode | EventNode | DeadEndNode | DiscoveryNode | PivotNode;

export type ChapterTool = 'chatgpt' | 'mixed' | 'claude';

export type ChapterType = 'date-range' | 'phase';

export interface Chapter {
  id: string;
  name: string;
  period: string;
  toolLabel: string;
  tool: ChapterTool;
  chapterType?: ChapterType;
  nodes: ProjectNode[];
}

export interface ProjectStats {
  totalDays: number;
  chatGptMessages: string;
  coworkSessions: number;
  prsCreated: string;
  codexTasks: string;
  linesOfCode: string;
  deadEnds: number;
  majorDecisions: number;
}

export type ProjectType = 'web-app' | 'addon' | 'game' | 'tool' | 'extension' | 'joint';
export type ProjectPhase = 'Research' | 'Spec' | 'Build' | 'Review' | 'Shipped';

export interface ProjectMilestone {
  label: string;
  date: string;
  session?: string;
  description?: string;
}

export type TrackingMode = 'full' | 'lightweight';

export interface Contributor {
  name: string;
  role: string;
  tool: WorkOperator;
}

export interface Project {
  id: string;
  name: string;
  subtitle: string;
  url?: string;
  projectType?: ProjectType;
  currentPhase?: ProjectPhase;
  trackingMode?: TrackingMode;
  contributors?: Contributor[];
  milestones?: ProjectMilestone[];
  chapters: Chapter[];
  stats: ProjectStats;
}

// ── Day / Work Block model (migration target) ──────────────────────

export type WorkCategory =
  | 'Feature'
  | 'Bug'
  | 'Refactor'
  | 'UX'
  | 'Testing'
  | 'Docs'
  | 'Scripting'
  | 'Data'
  | 'Local-Tooling'
  | 'Planning'
  | 'Tooling';

export type WorkDriver = 'human' | 'human-only' | 'ai' | 'agent-led' | 'collaborative';

export type WorkOperator = 'claude-code' | 'claude-ai' | 'cursor' | 'manual' | 'mixed';

export interface WorkBlock {
  id: string;
  dayId: string;
  label: string;
  workCategory: WorkCategory;
  driver: WorkDriver;
  operator: WorkOperator;
  timeMinutes?: number;
  linesAdded?: number;
  linesDeleted?: number;
  note?: string;
  /** Set on blocks migrated from context-window session splits */
  contextWindowOrigin?: boolean;
}

export interface DayEntry {
  date: string;
  title?: string;
  projectId: string;
  phase: ProjectPhase;
  chapterId?: string;
  blocks: WorkBlock[];
  metrics: {
    totalTimeMinutes: number;
    linesAdded: number;
    linesDeleted: number;
    totalDecisions: number;
  };
  driverSummary: {
    human: number;
    ai: number;
    collaborative: number;
  };
}

export type FilterType =
  | 'all'
  | 'decision'
  | 'dead-end'
  | 'event'
  | 'discovery'
  | 'pivot'
  | 'technical'
  | 'functional'
  | 'ux-design'
  | 'process';
