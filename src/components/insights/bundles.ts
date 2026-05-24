import type { ProjectBundle } from '../../utils/insightsData';
import { bipProject } from '../../data/bipProject';
import { bipCodeVolume, bipSessions, bipBugs, bipDays } from '../../data/bipMetrics';
import { metaProject } from '../../data/metaProject';
import { metaCodeVolume, metaSessions, metaBugs, metaDays } from '../../data/metaMetrics';
import { remnantsProject } from '../../data/remnantsProject';
import { remnantsCodeVolume, remnantsSessions, remnantsBugs, remnantsDays } from '../../data/remnantsMetrics';
import { itemBGoneProject } from '../../data/itemBGoneProject';
import { ibgCodeVolume, ibgSessions, ibgBugs, ibgDays } from '../../data/itemBGoneMetrics';
import { vulnBankProject } from '../../data/vulnBankProject';
import { vbCodeVolume, vbSessions, vbBugs, vbDays } from '../../data/vulnBankMetrics';
import { landingProject } from '../../data/landingProject';
import { landingCodeVolume, landingSessions, landingBugs, landingDays } from '../../data/landingMetrics';
import { feedbackCaptureProject } from '../../data/feedbackCaptureProject';
import { fcCodeVolume, fcSessions, fcBugs, fcDays } from '../../data/feedbackCaptureMetrics';
import { noteWorthyProject } from '../../data/noteWorthyProject';
import { nwCodeVolume, nwSessions, nwBugs, nwDays } from '../../data/noteWorthyMetrics';
import { onTheMoveProject } from '../../data/onTheMoveProject';
import { otmCodeVolume, otmSessions, otmBugs, otmDays } from '../../data/onTheMoveMetrics';

export const ALL_BUNDLES: ProjectBundle[] = [
  { project: bipProject, codeVolume: bipCodeVolume, sessions: bipSessions, bugs: bipBugs, days: bipDays },
  { project: metaProject, codeVolume: metaCodeVolume, sessions: metaSessions, bugs: metaBugs, days: metaDays },
  { project: remnantsProject, codeVolume: remnantsCodeVolume, sessions: remnantsSessions, bugs: remnantsBugs, days: remnantsDays },
  { project: itemBGoneProject, codeVolume: ibgCodeVolume, sessions: ibgSessions, bugs: ibgBugs, days: ibgDays },
  { project: vulnBankProject, codeVolume: vbCodeVolume, sessions: vbSessions, bugs: vbBugs, days: vbDays },
  { project: landingProject, codeVolume: landingCodeVolume, sessions: landingSessions, bugs: landingBugs, days: landingDays },
  { project: feedbackCaptureProject, codeVolume: fcCodeVolume, sessions: fcSessions, bugs: fcBugs, days: fcDays },
  { project: noteWorthyProject, codeVolume: nwCodeVolume, sessions: nwSessions, bugs: nwBugs, days: nwDays },
  { project: onTheMoveProject, codeVolume: otmCodeVolume, sessions: otmSessions, bugs: otmBugs, days: otmDays },
];
