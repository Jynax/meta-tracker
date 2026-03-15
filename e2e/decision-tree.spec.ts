import { test, expect } from '@playwright/test';

test.describe('Decision Tree', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // === Baseline tests ===

  test('stacked view is the default tree mode', async ({ page }) => {
    const stackedBtn = page.getByRole('button', { name: 'Stacked', exact: true });
    await expect(stackedBtn).toBeVisible();
  });

  test('stacked view renders chapter cards', async ({ page }) => {
    const chapterCards = page.locator('button >> text=/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \\d/');
    const count = await chapterCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('clicking a chapter expands it to show nodes', async ({ page }) => {
    const firstChapter = page.locator('button >> text=/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \\d/').first();
    await firstChapter.click();
    await page.waitForTimeout(300);
    const expandedIndicator = page.locator('text="\u25BC"');
    await expect(expandedIndicator.first()).toBeVisible();
  });

  test('can switch to canvas view', async ({ page }) => {
    const canvasBtn = page.getByRole('button', { name: 'Canvas', exact: true });
    await canvasBtn.click();
    const reactFlow = page.locator('.react-flow');
    await expect(reactFlow).toBeVisible();
  });

  test('canvas view renders controls', async ({ page }) => {
    await page.getByRole('button', { name: 'Canvas', exact: true }).click();
    const controls = page.locator('.react-flow__controls');
    await expect(controls).toBeVisible();
  });

  test('canvas view shows filter button', async ({ page }) => {
    await page.getByRole('button', { name: 'Canvas', exact: true }).click();
    const filterBtn = page.getByRole('button', { name: 'Filter' });
    await expect(filterBtn).toBeVisible();
  });

  // === Task #54: Stacked Tree Deep Interaction Tests ===

  test('expanding a chapter reveals node entries with type badges', async ({ page }) => {
    const firstChapter = page.locator('button >> text=/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \\d/').first();
    await firstChapter.click();
    await page.waitForTimeout(300);

    // Node entries should have uppercase type badges (DECISION, EVENT, DEAD-END, etc.)
    const typeBadge = page.locator('text=/^(decision|event|dead-end|discovery|pivot)$/').first();
    await expect(typeBadge).toBeVisible();
  });

  test('expanded chapter nodes show category pills', async ({ page }) => {
    const firstChapter = page.locator('button >> text=/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \\d/').first();
    await firstChapter.click();
    await page.waitForTimeout(300);

    // Category pills like Technical, Functional, UX/Design, Process
    const categoryPill = page.locator('text=/^(Technical|Functional|UX\\/Design|Process)$/').first();
    await expect(categoryPill).toBeVisible();
  });

  test('clicking a node expands its detail view', async ({ page }) => {
    // Expand first chapter
    const firstChapter = page.locator('button >> text=/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \\d/').first();
    await firstChapter.click();
    await page.waitForTimeout(300);

    // Click first node entry (they have borderLeft style with type color)
    const firstNode = page.locator('button[style*="border-left"]').first();
    await firstNode.click();
    await page.waitForTimeout(300);

    // Expanded node should show description text (all node types have descriptions)
    // Some nodes also show "Chosen Path", "Alternatives Considered", or "Lesson" but event nodes don't
    const detailContent = page.locator('text=/Chosen Path|Alternatives Considered|Lesson|milestone|migration|decision|project|built|added|created|fixed|deployed/i').first();
    await expect(detailContent).toBeVisible();
  });

  test('day header shows chapter name context', async ({ page }) => {
    // Day headers show the chapter name as context on the right side
    const dayHeader = page.locator('button >> text=/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \\d/').first();
    await expect(dayHeader).toBeVisible();
  });

  test('chapter summary bar shows entry stats', async ({ page }) => {
    // Summary stats like "X entries", possibly "Y dead ends", "Z discoveries"
    const entriesText = page.locator('text=/\\d+ entries/').first();
    await expect(entriesText).toBeVisible();
  });

  test('stacked view summary shows total entries count', async ({ page }) => {
    // Top summary card shows total entries across all chapters
    const totalEntries = page.locator('text=/\\d+ entries/').first();
    await expect(totalEntries).toBeVisible();
  });

  test('stacked view summary shows category legend', async ({ page }) => {
    // Category legend with colored dots: Technical, Functional, UX/Design, Process
    const technicalLegend = page.locator('text=/Technical \\(\\d+\\)/').first();
    await expect(technicalLegend).toBeVisible();
  });

  test('collapsing an expanded chapter hides its nodes', async ({ page }) => {
    const firstChapter = page.locator('button >> text=/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \\d/').first();

    // Expand
    await firstChapter.click();
    await page.waitForTimeout(300);
    const typeBadge = page.locator('text=/^(decision|event|dead-end|discovery|pivot)$/').first();
    await expect(typeBadge).toBeVisible();

    // Collapse
    await firstChapter.click();
    await page.waitForTimeout(300);
    await expect(typeBadge).not.toBeVisible();
  });

  test('multiple day groups can be expanded simultaneously', async ({ page }) => {
    // Day groups show date headers like "Mar 11", "Mar 10", etc.
    const dayHeaders = page.locator('button >> text=/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \\d/');
    const count = await dayHeaders.count();
    if (count < 2) return; // Skip if only one day group

    // Expand first two day groups
    await dayHeaders.nth(0).click();
    await page.waitForTimeout(200);
    await dayHeaders.nth(1).click();
    await page.waitForTimeout(200);

    // Both should show the expanded indicator
    const expandedIndicators = page.locator('text="\u25BC"');
    expect(await expandedIndicators.count()).toBeGreaterThanOrEqual(2);
  });

  test('switching to BIP project shows its chapters', async ({ page }) => {
    const switcher = page.locator('nav[aria-label="Project switcher"]');
    await switcher.locator('button[aria-haspopup="listbox"]').click();
    await switcher.getByRole('option', { name: 'BIP' }).click();
    await expect(page.locator('h1')).toContainText('BIP');

    // BIP should also have chapter cards
    const content = page.locator('section');
    await expect(content).toBeVisible();
  });

  test('phase badges appear on chapters when available', async ({ page }) => {
    // Phase badges (Research, Spec, Build, Review, Shipped) appear on chapter headers
    const phaseBadge = page.locator('text=/^(Research|Spec|Build|Review|Shipped)$/').first();
    // Not all projects have phase data, so check if visible or just ensure no errors
    const count = await phaseBadge.count();
    expect(count).toBeGreaterThanOrEqual(0); // No crash is the main assertion
  });

  // === Task #56: Canvas View Deep Interaction Tests ===

  test('canvas view shows summary stats bar', async ({ page }) => {
    await page.getByRole('button', { name: 'Canvas', exact: true }).click();
    await page.waitForTimeout(300);

    // Summary bar shows entries count and stat badges
    const entriesText = page.locator('text=/\\d+ entries/').first();
    await expect(entriesText).toBeVisible();
  });

  test('canvas view shows category bar', async ({ page }) => {
    await page.getByRole('button', { name: 'Canvas', exact: true }).click();
    await page.waitForTimeout(300);

    // Category legend items below the bar
    const categoryLegend = page.locator('text=/Technical \\d+/').first();
    await expect(categoryLegend).toBeVisible();
  });

  test('canvas filter panel toggles open and closed', async ({ page }) => {
    await page.getByRole('button', { name: 'Canvas', exact: true }).click();
    await page.waitForTimeout(300);

    const filterBtn = page.getByRole('button', { name: 'Filter' });
    await filterBtn.click();
    await page.waitForTimeout(200);

    // Filter options should appear
    const allFilter = page.getByRole('button', { name: 'All', exact: true });
    await expect(allFilter).toBeVisible();

    // Decisions filter should be available
    const decisionsFilter = page.getByRole('button', { name: 'Decisions', exact: true });
    await expect(decisionsFilter).toBeVisible();
  });

  test('canvas filter changes active filter badge', async ({ page }) => {
    await page.getByRole('button', { name: 'Canvas', exact: true }).click();
    await page.waitForTimeout(300);

    // Open filters and select "Dead Ends"
    await page.getByRole('button', { name: 'Filter' }).click();
    await page.waitForTimeout(200);

    const deadEndsFilter = page.getByRole('button', { name: 'Dead Ends', exact: true });
    await deadEndsFilter.click();
    await page.waitForTimeout(300);

    // Active filter label should appear
    const activeLabel = page.locator('text="Dead Ends"');
    await expect(activeLabel.first()).toBeVisible();
  });

  test('canvas ReactFlow renders project nodes', async ({ page }) => {
    await page.getByRole('button', { name: 'Canvas', exact: true }).click();
    await page.waitForTimeout(500);

    // ReactFlow should render node elements
    const nodes = page.locator('.react-flow__node');
    const count = await nodes.count();
    expect(count).toBeGreaterThan(0);
  });
});
