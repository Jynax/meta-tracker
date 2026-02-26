export type NodeType = 'decision' | 'event' | 'dead-end';

export interface BaseNode {
  id: string;
  type: NodeType;
  title: string;
  description: string;
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

export type ProjectNode = DecisionNode | EventNode | DeadEndNode;

export type PhaseTool = 'chatgpt' | 'mixed' | 'claude';

export interface Phase {
  id: string;
  name: string;
  period: string;
  toolLabel: string;
  tool: PhaseTool;
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

export interface Project {
  id: string;
  name: string;
  subtitle: string;
  phases: Phase[];
  stats: ProjectStats;
}

export type FilterType = 'all' | 'decision' | 'dead-end' | 'event';
