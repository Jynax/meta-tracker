import test from 'node:test';
import assert from 'node:assert/strict';

// Use tsx to load the TS module at test time.
// Run via: npx tsx --test scripts/active-epic-progress.test.mjs
import { getEpicCumulativeSeries } from '../src/utils/trackerDataAdapter.ts';

test('returns an array (smoke)', () => {
  const out = getEpicCumulativeSeries({
    now: new Date('2026-04-19T00:00:00Z'),
    windowDays: 30,
    plotWindowWeeks: 8,
    cap: 6,
    includeAll: false,
  });
  assert.ok(Array.isArray(out), 'result should be an array');
});
