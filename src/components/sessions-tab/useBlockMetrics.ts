import { useMemo, useCallback } from 'react';
import type { SessionEntry } from '../../data/metaMetrics';
import type { DayEntry, WorkBlock } from '../../types/index';
import { countPRsInText } from '../../utils/prRefs';

/**
 * Per-block PR + decision lookups for the Sessions tab.
 *
 * Task #99 — PR #165 migrated Sessions tab charts to derive per-block PRs
 * by regex-scraping `block.note`, which fails for older blocks whose notes
 * never contained "PR #xxx". The legacy `metaSessions` array still has the
 * correct per-session counts — we build a lookup from the `sessions` prop
 * and fall back to regex only for blocks with no legacy entry (post-S76 era).
 * Full cross-project structural cleanup is queued under Task #96.
 */
export function useBlockMetrics(sessions: SessionEntry[]) {
  const legacyBySessionKey = useMemo(() => {
    const map: Record<string, SessionEntry> = {};
    for (const s of sessions) {
      const key = s.session.toLowerCase().replace(/^session\s+/, '').replace(/\s+/g, '-');
      map[key] = s;
    }
    return map;
  }, [sessions]);

  const blockIdToLegacyKey = useCallback((blockId: string): string | null => {
    const m = blockId.match(/-(?:session-|pre-tracking-)(.+)$/i);
    return m ? m[1]!.toLowerCase() : null;
  }, []);

  const getBlockPrs = useCallback((block: WorkBlock): number => {
    const key = blockIdToLegacyKey(block.id);
    if (key) {
      const legacy = legacyBySessionKey[key] ?? legacyBySessionKey[`pre-tracking-${key}`];
      if (legacy) return legacy.prs;
    }
    return countPRsInText(block.note);
  }, [legacyBySessionKey, blockIdToLegacyKey]);

  /**
   * Per-block decision counts for a day, preserving the day total.
   * Uses legacy session data when every block in the day has a match;
   * otherwise evenly distributes day total across blocks.
   */
  const getBlockDecisionsForDay = useCallback((day: DayEntry): number[] => {
    const legacyValues = day.blocks.map((block) => {
      const key = blockIdToLegacyKey(block.id);
      return key ? legacyBySessionKey[key]?.decisions : undefined;
    });
    if (legacyValues.every((v) => v !== undefined)) return legacyValues as number[];
    const n = day.blocks.length || 1;
    const total = day.metrics.totalDecisions;
    const base = Math.floor(total / n);
    const remainder = total - base * n;
    return day.blocks.map((_, i) => base + (i < remainder ? 1 : 0));
  }, [legacyBySessionKey, blockIdToLegacyKey]);

  return { getBlockPrs, getBlockDecisionsForDay };
}
