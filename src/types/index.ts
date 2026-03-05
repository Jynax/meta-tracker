export type NodeType = 'decision' | 'event' | 'dead-end' | 'discovery' | 'pivot';

export type NodeCategory = 'technical' | 'functional' | 'ux-design' | 'process';

export interface BaseNode {
  id: string;
  type: NodeType;
  category?: NodeCategory;
  title: string;
  description: string;
  lesson?: string;
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

export interface Chapter {
  id: string;
  name: string;
  period: string;
  toolLabel: string;
  tool: ChapterTool;
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
  url?: string;
  chapters: Chapter[];
  stats: ProjectStats;
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
