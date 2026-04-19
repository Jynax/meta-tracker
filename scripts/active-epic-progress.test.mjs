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

test('includeAll returns all epics with at least one completed task, cumulative series ascending', () => {
  const out = getEpicCumulativeSeries({
    now: new Date('2026-04-19T00:00:00Z'),
    windowDays: 30,
    plotWindowWeeks: 8,
    cap: 100,
    includeAll: true,
  });

  assert.ok(out.length > 0, 'MT data should yield at least one series');

  for (const series of out) {
    assert.equal(typeof series.epicId, 'string');
    assert.equal(typeof series.epicTitle, 'string');
    assert.equal(typeof series.totalCompleted, 'number');
    assert.ok(series.points.length >= 1, `${series.epicId} should have at least one point`);

    let prev = -Infinity;
    for (const p of series.points) {
      assert.ok(p.cumulative >= prev, `cumulative should not decrease for ${series.epicId}`);
      prev = p.cumulative;
    }

    assert.equal(
      series.totalCompleted,
      series.points[series.points.length - 1].cumulative,
      `totalCompleted mismatch for ${series.epicId}`,
    );
  }
});
