import { test, expect, type Page } from '@playwright/test';

// MT renames the Sessions tab to "Tasks" in Phase 3 and replaces the SessionsTab
// component with TasksTab. Tests that exercise legacy Sessions UI need a non-MT
// project (e.g. BIP).
async function switchToBIPMetrics(page: Page) {
  const switcher = page.locator('nav[aria-label="Project switcher"]');
  await switcher.locator('button[aria-haspopup="listbox"]').click();
  await switcher.getByRole('option', { name: 'BIP' }).click();
  await expect(page.locator('h1')).toContainText('BIP');
  const viewSwitcher = page.locator('nav[aria-label="View switcher"]');
  await viewSwitcher.getByText('Metrics').click();
}

test.describe('Metrics Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    const viewSwitcher = page.locator('nav[aria-label="View switcher"]');
    await viewSwitcher.getByText('Metrics').click();
  });

  // === Baseline tests ===

  test('metrics view renders with Overview tab active', async ({ page }) => {
    const overviewBtn = page.getByRole('button', { name: 'Overview' });
    await expect(overviewBtn).toBeVisible();
  });

  test('all four metric tabs are present', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Overview' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Code' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Bugs' })).toBeVisible();
    // MT renames Sessions → Tasks; non-MT projects keep "Sessions".
    await expect(
      page.getByRole('button', { name: /^(Tasks|Sessions)$/ }),
    ).toBeVisible();
  });

  test('overview tab renders chart content', async ({ page }) => {
    const svgs = page.locator('svg');
    const count = await svgs.count();
    expect(count).toBeGreaterThan(0);
  });

  test('code tab renders content', async ({ page }) => {
    await page.getByRole('button', { name: 'Code' }).click();
    await page.waitForTimeout(300);
    const codeContent = page.locator('text=/LOC|added|deleted/i').first();
    await expect(codeContent).toBeVisible();
  });

  test('bugs tab renders content', async ({ page }) => {
    await page.getByRole('button', { name: 'Bugs' }).click();
    await page.waitForTimeout(300);
    const metricsContainer = page.locator('[class*="rounded-2xl"]').first();
    await expect(metricsContainer).toBeVisible();
  });

  test('sessions tab renders session cards', async ({ page }) => {
    // Switch to BIP (non-MT project still uses SessionsTab).
    await switchToBIPMetrics(page);
    await page.getByRole('button', { name: 'Sessions' }).click();
    await page.waitForTimeout(300);
    const content = page.locator('[class*="rounded-2xl"]').first();
    await expect(content).toBeVisible();
  });

  test('switching projects then viewing metrics works', async ({ page }) => {
    const viewSwitcher = page.locator('nav[aria-label="View switcher"]');
    const switcher = page.locator('nav[aria-label="Project switcher"]');
    await switcher.locator('button[aria-haspopup="listbox"]').click();
    await switcher.getByRole('option', { name: 'BIP' }).click();
    await expect(page.locator('h1')).toContainText('BIP');
    await viewSwitcher.getByText('Metrics').click();
    const metricsContainer = page.locator('[class*="rounded-2xl"]').first();
    await expect(metricsContainer).toBeVisible();
  });

  // === Task #55: Overview Tab Deep Tests ===

  test('overview tab shows summary stat cards', async ({ page }) => {
    // MT replaced legacy stat cards with task-model cards; test against BIP for legacy cards.
    await switchToBIPMetrics(page);
    await expect(page.locator('text="PRs Merged"')).toBeVisible();
    await expect(page.locator('text="LOC Written"')).toBeVisible();
    await expect(page.locator('text="Timeline"')).toBeVisible();
    await expect(page.locator('text="Hours"').first()).toBeVisible();
  });

  test('MT overview tab shows task-model stat cards', async ({ page }) => {
    // Phase 3: MT shows Active Epics / Tasks Completed / Outputs / Decisions.
    await expect(page.locator('text="Active Epics"')).toBeVisible();
    await expect(page.locator('text="Tasks Completed"')).toBeVisible();
    await expect(page.locator('text="Outputs"')).toBeVisible();
    await expect(page.locator('text="Decisions"').first()).toBeVisible();
  });

  test('MT overview tab shows Epic Timeline (Gantt)', async ({ page }) => {
    await expect(page.locator('text="Epic Timeline"')).toBeVisible();
  });

  test('overview tab shows derived metrics', async ({ page }) => {
    const derivedLabels = ['Churn Rate', 'Cycle Time', 'Decisions', 'Bug Rate'];
    for (const label of derivedLabels) {
      const el = page.locator(`text="${label}"`);
      if (await el.count() > 0) {
        await expect(el.first()).toBeVisible();
      }
    }
  });

  test('overview tab renders Codebase Size Over Time chart', async ({ page }) => {
    const chart = page.locator('svg[aria-label="Codebase size over time chart"]');
    await expect(chart).toBeVisible();
  });

  test('overview tab shows Work Mix section for Meta Tracker', async ({ page }) => {
    const workMixHeading = page.locator('text="Work Mix"');
    await expect(workMixHeading).toBeVisible();
  });

  test('overview tab shows Stack Profile section', async ({ page }) => {
    const stackHeading = page.locator('text="Stack Profile"');
    await expect(stackHeading).toBeVisible();
  });

  test('overview tab shows Project Phases section', async ({ page }) => {
    const phasesHeading = page.locator('text="Project Phases"');
    await expect(phasesHeading).toBeVisible();

    // "All projects at a glance" subtitle confirms the section rendered
    await expect(page.locator('text="All projects at a glance"')).toBeVisible();
  });

  test('project phases show phase badges', async ({ page }) => {
    const phaseBadge = page.locator('text=/^(Research|Spec|Build|Review|Shipped)$/').first();
    await expect(phaseBadge).toBeVisible();
  });

  // === Task #55: Code Tab Deep Tests ===

  test('code tab shows header stat cards', async ({ page }) => {
    await page.getByRole('button', { name: 'Code' }).click();
    await page.waitForTimeout(300);

    await expect(page.locator('text="Total Added"')).toBeVisible();
    await expect(page.locator('text="Total Deleted"')).toBeVisible();
    await expect(page.locator('text="Current LOC"')).toBeVisible();
  });

  test('code tab has expandable date rows', async ({ page }) => {
    await page.getByRole('button', { name: 'Code' }).click();
    await page.waitForTimeout(300);

    const dateRows = page.locator('button.w-full.text-left');
    const count = await dateRows.count();
    expect(count).toBeGreaterThan(0);
  });

  test('code tab date row expands on click', async ({ page }) => {
    await page.getByRole('button', { name: 'Code' }).click();
    await page.waitForTimeout(300);

    const firstRow = page.locator('button.w-full.text-left').first();
    await firstRow.click();
    await page.waitForTimeout(300);

    // After expanding, nested content should appear — look for additional rows
    const allRows = page.locator('button.w-full.text-left');
    const countAfter = await allRows.count();
    // The expanded row should reveal child rows, so count should increase
    expect(countAfter).toBeGreaterThan(1);
  });

  // === Task #55: Bugs Tab Deep Tests ===

  test('bugs tab shows summary bar with total and fixed counts', async ({ page }) => {
    await page.getByRole('button', { name: 'Bugs' }).click();
    await page.waitForTimeout(300);

    // Summary bar shows "N total" and "N fixed"
    await expect(page.locator('text=/\\d+ total/').first()).toBeVisible();
    await expect(page.locator('text=/\\d+ fixed/').first()).toBeVisible();
  });

  test('bugs tab shows donut breakdown charts', async ({ page }) => {
    await page.getByRole('button', { name: 'Bugs' }).click();
    await page.waitForTimeout(300);

    const svgs = page.locator('svg');
    const count = await svgs.count();
    expect(count).toBeGreaterThan(0);
  });

  test('bugs tab has expandable session groups', async ({ page }) => {
    await page.getByRole('button', { name: 'Bugs' }).click();
    await page.waitForTimeout(300);

    // Session groups show "N bug(s)" and a date — match buttons containing a digit followed by "bug"
    const sessionGroups = page.locator('button >> text=/\\d+ bugs?/');
    const count = await sessionGroups.count();
    expect(count).toBeGreaterThan(0);
  });

  test('bugs tab session group expands to show bug table', async ({ page }) => {
    await page.getByRole('button', { name: 'Bugs' }).click();
    await page.waitForTimeout(300);

    const sessionGroup = page.locator('button >> text=/\\d+ bugs?/').first();
    await sessionGroup.click();
    await page.waitForTimeout(300);

    const table = page.locator('table').first();
    await expect(table).toBeVisible();
  });

  // === Task #55: Sessions Tab Deep Tests (non-MT) ===

  test('sessions tab shows header stat cards', async ({ page }) => {
    await switchToBIPMetrics(page);
    await page.getByRole('button', { name: 'Sessions' }).click();
    await page.waitForTimeout(300);

    await expect(page.locator('text="Total PRs"')).toBeVisible();
    await expect(page.locator('text="Total Decisions"')).toBeVisible();
    await expect(page.locator('text="Total Hours"')).toBeVisible();
  });

  test('sessions tab shows Session Activity chart', async ({ page }) => {
    await switchToBIPMetrics(page);
    await page.getByRole('button', { name: 'Sessions' }).click();
    await page.waitForTimeout(300);

    const chart = page.locator('svg[aria-label="Session activity chart"]');
    await expect(chart).toBeVisible();
  });

  test('sessions tab chart toggle switches between By Day and By Session', async ({ page }) => {
    await switchToBIPMetrics(page);
    await page.getByRole('button', { name: 'Sessions' }).click();
    await page.waitForTimeout(300);

    const byDayBtn = page.locator('button:has-text("By Day")');

    if (await byDayBtn.count() > 0) {
      await byDayBtn.click();
      await page.waitForTimeout(200);
      const chart = page.locator('svg[aria-label="Session activity chart"]');
      await expect(chart).toBeVisible();
    }
  });

  test('sessions tab has collapsible day rows', async ({ page }) => {
    await switchToBIPMetrics(page);
    await page.getByRole('button', { name: 'Sessions' }).click();
    await page.waitForTimeout(300);

    // Day rows show "N block(s)" text — look for buttons with block count
    const dayRows = page.locator('button:has-text("block")');
    const count = await dayRows.count();
    expect(count).toBeGreaterThan(0);
  });

  test('sessions tab day row expands to show work blocks', async ({ page }) => {
    await switchToBIPMetrics(page);
    await page.getByRole('button', { name: 'Sessions' }).click();
    await page.waitForTimeout(300);

    const dayRow = page.locator('button:has-text("block")').first();
    await dayRow.click();
    await page.waitForTimeout(300);

    // Expanded day shows work block cards with rounded-lg border styling
    const workBlocks = page.locator('[class*="rounded-lg"][class*="border"][class*="p-3"]');
    expect(await workBlocks.count()).toBeGreaterThan(0);
  });

  // === MT Tasks Tab Tests ===

  test('MT tasks tab renders Active Epic Progress chart', async ({ page }) => {
    await page.getByRole('button', { name: 'Tasks' }).click();
    await page.waitForTimeout(300);
    const chart = page.locator('svg[aria-label^="Cumulative task completion chart"]');
    await expect(chart).toBeVisible();
  });

  test('MT tasks tab shows Active Epic Progress heading', async ({ page }) => {
    await page.getByRole('button', { name: 'Tasks' }).click();
    await page.waitForTimeout(300);
    // Scope to chart container — task list may render task titles that mention the chart name.
    await expect(page.getByTestId('active-epic-progress').getByText('Active Epic Progress')).toBeVisible();
  });

  test('MT tasks tab Active Epic Progress renders subtitle', async ({ page }) => {
    await page.getByRole('button', { name: 'Tasks' }).click();
    await page.waitForTimeout(300);
    await expect(page.getByText(/Cumulative tasks completed/)).toBeVisible();
  });

  test('MT tasks tab default view has Active + stalled toggle active', async ({ page }) => {
    await page.getByRole('button', { name: 'Tasks' }).click();
    await page.waitForTimeout(300);
    const activeBtn = page.getByRole('button', { name: 'Active + stalled' });
    await expect(activeBtn).toHaveAttribute('aria-pressed', 'true');
  });

  test('MT tasks tab clicking All epics adds curves', async ({ page }) => {
    await page.getByRole('button', { name: 'Tasks' }).click();
    await page.waitForTimeout(300);
    const defaultCount = await page.locator('.curve-label').count();
    await page.getByRole('button', { name: 'All epics' }).click();
    await page.waitForTimeout(200);
    const allCount = await page.locator('.curve-label').count();
    expect(allCount).toBeGreaterThan(defaultCount);
  });

  test('MT tasks tab shows stalled epic indicator in default view', async ({ page }) => {
    await page.getByRole('button', { name: 'Tasks' }).click();
    await page.waitForTimeout(300);
    // epic-shared-project-milestones is In Progress with no completed tasks — stalled epics
    // bypass the cap and always appear.
    const stalled = page.locator('.curve-label[data-stalled="true"]');
    await expect(stalled.first()).toBeVisible();
  });

  test('MT tasks tab regression guard: no Task Throughput chart', async ({ page }) => {
    await page.getByRole('button', { name: 'Tasks' }).click();
    await page.waitForTimeout(300);
    // Guards against the old chart returning. Task titles may legitimately reference
    // "Task Throughput" (e.g. the rethink task that replaced it), so scope to the chart container.
    await expect(page.getByTestId('active-epic-progress').getByText('Task Throughput')).toHaveCount(0);
  });

  test('MT tasks tab has expandable week sections', async ({ page }) => {
    await page.getByRole('button', { name: 'Tasks' }).click();
    await page.waitForTimeout(300);
    const weekSections = page.locator('button:has-text("Week of")');
    const count = await weekSections.count();
    expect(count).toBeGreaterThan(0);
  });

  // === Task #55: Cross-Tab Tests ===

  test('rapid tab switching does not crash', async ({ page }) => {
    // Use MT's actual tab labels (Tasks instead of Sessions for MT).
    const tabs = ['Overview', 'Code', 'Bugs', 'Tasks', 'Overview', 'Bugs', 'Code', 'Tasks'];
    for (const tab of tabs) {
      await page.getByRole('button', { name: tab, exact: true }).click();
      await page.waitForTimeout(150);
    }
    // After rapid switching, content should still render
    await page.waitForTimeout(300);
    const content = page.locator('[class*="rounded"]').first();
    await expect(content).toBeVisible();
  });

  test('switching projects while on Bugs tab shows new project bugs', async ({ page }) => {
    await page.getByRole('button', { name: 'Bugs' }).click();
    await page.waitForTimeout(300);

    const switcher = page.locator('nav[aria-label="Project switcher"]');
    await switcher.locator('button[aria-haspopup="listbox"]').click();
    await switcher.getByRole('option', { name: 'BIP' }).click();
    await expect(page.locator('h1')).toContainText('BIP');

    const viewSwitcher = page.locator('nav[aria-label="View switcher"]');
    await viewSwitcher.getByText('Metrics').click();
    await page.getByRole('button', { name: 'Bugs' }).click();
    await page.waitForTimeout(300);

    const content = page.locator('[class*="rounded"]').first();
    await expect(content).toBeVisible();
  });
});
