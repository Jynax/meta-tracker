import type { ReactNode } from 'react';
import type {
  Project,
  ProjectNode,
  DayEntry,
  ProjectPhase,
  ChapterType,
} from '../../types';
import type { EpicTreeNode } from '../../utils/trackerDataAdapter';

export interface DayGroup {
  dayId: string;
  title?: string;
  phase?: ProjectPhase;
  chapterName?: string;
  chapterType?: ChapterType;
  nodes: ProjectNode[];
}

export type ViewMode = 'chapters' | 'epics';

export type TooltipState = { x: number; y: number; content: ReactNode } | null;

export interface StackedTreeViewProps {
  project: Project;
  filter: string;
  onFilterChange: (filter: string) => void;
  expandedChapters: Set<string>;
  onChapterToggle: (chapterId: string) => void;
  expandedNode: string | null;
  onNodeToggle: (nodeId: string) => void;
  highlightChapter?: string | null;
  onJumpToSession?: (session: string) => void;
  days?: DayEntry[];
  dayPhaseMap?: Record<string, ProjectPhase>;
  // Epic-mode props (used when mode === 'epics' for MT)
  mode?: ViewMode;
  epicTree?: EpicTreeNode[];
  expandedEpics?: Set<string>;
  onEpicToggle?: (epicId: string) => void;
}
