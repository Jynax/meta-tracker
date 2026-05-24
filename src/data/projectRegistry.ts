import type { DayEntry, Project } from '../types';
import type {
  CodeVolumeEntry,
  SessionEntry,
  BugEntry,
  DerivedMetric,
  StackEntry,
} from './bipMetrics';

import { bipProject } from './bipProject';
import { metaProject } from './metaProject';
import { remnantsProject } from './remnantsProject';
import { itemBGoneProject } from './itemBGoneProject';
import { vulnBankProject } from './vulnBankProject';
import { landingProject } from './landingProject';
import { feedbackCaptureProject } from './feedbackCaptureProject';
import { noteWorthyProject } from './noteWorthyProject';
import { onTheMoveProject } from './onTheMoveProject';

import {
  bipCodeVolume,
  bipSessions,
  bipBugs,
  bipDerived,
  bipStack,
  bipDateRange,
  bipDays,
} from './bipMetrics';
import {
  metaCodeVolume,
  metaSessions,
  metaBugs,
  metaDerived,
  metaStack,
  metaDateRange,
  metaDays,
} from './metaMetrics';
import {
  remnantsCodeVolume,
  remnantsSessions,
  remnantsBugs,
  remnantsDerived,
  remnantsStack,
  remnantsDateRange,
  remnantsDays,
} from './remnantsMetrics';
import {
  ibgCodeVolume,
  ibgSessions,
  ibgBugs,
  ibgDerived,
  ibgStack,
  ibgDateRange,
  ibgDays,
} from './itemBGoneMetrics';
import {
  vbCodeVolume,
  vbSessions,
  vbBugs,
  vbDerived,
  vbStack,
  vbDateRange,
  vbDays,
} from './vulnBankMetrics';
import {
  landingCodeVolume,
  landingSessions,
  landingBugs,
  landingDerived,
  landingStack,
  landingDateRange,
  landingDays,
} from './landingMetrics';
import {
  fcCodeVolume,
  fcSessions,
  fcBugs,
  fcDerived,
  fcStack,
  fcDateRange,
  fcDays,
} from './feedbackCaptureMetrics';
import {
  nwCodeVolume,
  nwSessions,
  nwBugs,
  nwDerived,
  nwStack,
  nwDateRange,
  nwDays,
} from './noteWorthyMetrics';
import {
  otmCodeVolume,
  otmSessions,
  otmBugs,
  otmDerived,
  otmStack,
  otmDateRange,
  otmDays,
} from './onTheMoveMetrics';

export interface ProjectBundle {
  project: Project;
  codeVolume: CodeVolumeEntry[];
  sessions: SessionEntry[];
  bugs: BugEntry[];
  derived: DerivedMetric[];
  stack: StackEntry[];
  dateRange: { start: string; end: string };
  days: DayEntry[];
}

export const projectBundles: Record<string, ProjectBundle> = {
  bip: {
    project: bipProject,
    codeVolume: bipCodeVolume,
    sessions: bipSessions,
    bugs: bipBugs,
    derived: bipDerived,
    stack: bipStack,
    dateRange: bipDateRange,
    days: bipDays,
  },
  meta: {
    project: metaProject,
    codeVolume: metaCodeVolume,
    sessions: metaSessions,
    bugs: metaBugs,
    derived: metaDerived,
    stack: metaStack,
    dateRange: metaDateRange,
    days: metaDays,
  },
  remnants: {
    project: remnantsProject,
    codeVolume: remnantsCodeVolume,
    sessions: remnantsSessions,
    bugs: remnantsBugs,
    derived: remnantsDerived,
    stack: remnantsStack,
    dateRange: remnantsDateRange,
    days: remnantsDays,
  },
  'item-b-gone': {
    project: itemBGoneProject,
    codeVolume: ibgCodeVolume,
    sessions: ibgSessions,
    bugs: ibgBugs,
    derived: ibgDerived,
    stack: ibgStack,
    dateRange: ibgDateRange,
    days: ibgDays,
  },
  'vuln-bank': {
    project: vulnBankProject,
    codeVolume: vbCodeVolume,
    sessions: vbSessions,
    bugs: vbBugs,
    derived: vbDerived,
    stack: vbStack,
    dateRange: vbDateRange,
    days: vbDays,
  },
  landing: {
    project: landingProject,
    codeVolume: landingCodeVolume,
    sessions: landingSessions,
    bugs: landingBugs,
    derived: landingDerived,
    stack: landingStack,
    dateRange: landingDateRange,
    days: landingDays,
  },
  'feedback-capture': {
    project: feedbackCaptureProject,
    codeVolume: fcCodeVolume,
    sessions: fcSessions,
    bugs: fcBugs,
    derived: fcDerived,
    stack: fcStack,
    dateRange: fcDateRange,
    days: fcDays,
  },
  'note-worthy': {
    project: noteWorthyProject,
    codeVolume: nwCodeVolume,
    sessions: nwSessions,
    bugs: nwBugs,
    derived: nwDerived,
    stack: nwStack,
    dateRange: nwDateRange,
    days: nwDays,
  },
  'on-the-move': {
    project: onTheMoveProject,
    codeVolume: otmCodeVolume,
    sessions: otmSessions,
    bugs: otmBugs,
    derived: otmDerived,
    stack: otmStack,
    dateRange: otmDateRange,
    days: otmDays,
  },
};

export const ALL_PROJECTS: Project[] = [
  bipProject,
  metaProject,
  remnantsProject,
  itemBGoneProject,
  vulnBankProject,
  landingProject,
  feedbackCaptureProject,
  noteWorthyProject,
  onTheMoveProject,
];

export const PROJECT_DAYS_MAP: Record<string, DayEntry[]> = {
  bip: bipDays,
  meta: metaDays,
  remnants: remnantsDays,
  'item-b-gone': ibgDays,
  'vuln-bank': vbDays,
  landing: landingDays,
  'feedback-capture': fcDays,
  'note-worthy': nwDays,
  'on-the-move': otmDays,
};

export const SYNTHETIC_ALL_PROJECT: Project = {
  id: 'all',
  name: 'All Projects',
  subtitle: '',
  chapters: [],
  stats: {
    totalDays: 0,
    chatGptMessages: '0',
    coworkSessions: 0,
    prsCreated: '0',
    codexTasks: '0',
    linesOfCode: '0',
    deadEnds: 0,
    majorDecisions: 0,
  },
};

export function getBundle(id: string): ProjectBundle {
  return projectBundles[id] ?? projectBundles.bip;
}
