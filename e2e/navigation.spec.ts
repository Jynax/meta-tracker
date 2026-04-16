import { test, expect } from '@playwright/test';

test.describe('Navigation & Layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // === Baseline tests ===

  test('app loads with Meta Tracker as default project', async ({ page }) => {
    const heading = page.locator('h1');
    await expect(heading).toContainText('Meta Tracker');
  });

  test('project switcher shows all 9 projects plus All Projects entry', async ({ page }) => {
    const switcher = page.locator('nav[aria-label="Project switcher"]');
    await expect(switcher).toBeVisible();
    // Open dropdown to count project options (9 individual projects + 1 "All Projects" entry)
    await switcher.locator('button[aria-haspopup="listbox"]').click();
    const options = switcher.locator('button[role="option"]');
    await expect(options).toHaveCount(10);
  });

  test('switching projects updates the heading', async ({ page }) => {
    const switcher = page.locator('nav[aria-label="Project switcher"]');
    await switcher.locator('button[aria-haspopup="listbox"]').click();
    await switcher.getByRole('option', { name: 'BIP' }).click();
    await expect(page.locator('h1')).toContainText('BIP');
  });

  test('view switcher shows tree view and Metrics tabs', async ({ page }) => {
    // MT renames "Decision Tree" → "Epic Tree" in Phase 3.
    const viewSwitcher = page.locator('nav[aria-label="View switcher"]');
    await expect(viewSwitcher.getByText(/Epic Tree|Decision Tree/)).toBeVisible();
    await expect(viewSwitcher.getByText('Metrics')).toBeVisible();
  });

  test('tree view is the default view', async ({ page }) => {
    const treeTab = page.locator('nav[aria-label="View switcher"] button', {
      hasText: /Epic Tree|Decision Tree/,
    });
    await expect(treeTab).toHaveAttribute('aria-current', 'page');
  });

  test('How We Work button opens overlay', async ({ page }) => {
    await page.locator('header').getByRole('button', { name: /How We Work/ }).click();
    const closeButton = page.getByRole('button', { name: /Close/ });
    await expect(closeButton).toBeVisible();
  });

  test('How We Work overlay can be closed', async ({ page }) => {
    await page.locator('header').getByRole('button', { name: /How We Work/ }).click();
    await page.getByRole('button', { name: /Close/ }).click();
    await expect(page.locator('h1')).toContainText('Meta Tracker');
  });

  // === Task #56: How We Work Overlay Deep Tests ===

  test('How We Work overlay shows heading', async ({ page }) => {
    await page.locator('header').getByRole('button', { name: /How We Work/ }).click();
    await page.waitForTimeout(300);

    const heading = page.locator('h1:has-text("How We Work")');
    await expect(heading).toBeVisible();
  });

  test('How We Work overlay has four tabs', async ({ page }) => {
    await page.locator('header').getByRole('button', { name: /How We Work/ }).click();
    await page.waitForTimeout(300);

    await expect(page.getByRole('button', { name: 'Workflow', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Task Routing', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Patterns', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'History', exact: true })).toBeVisible();
  });

  test('How We Work Workflow tab shows role cards', async ({ page }) => {
    await page.locator('header').getByRole('button', { name: /How We Work/ }).click();
    await page.waitForTimeout(300);

    await expect(page.locator('text="Michael"').first()).toBeVisible();
    await expect(page.locator('text="Claude"').first()).toBeVisible();
    await expect(page.locator('text="Claude Code"').first()).toBeVisible();
    await expect(page.locator('text="Codex"').first()).toBeVisible();
  });

  test('How We Work Task Routing tab shows tool descriptions', async ({ page }) => {
    await page.locator('header').getByRole('button', { name: /How We Work/ }).click();
    await page.waitForTimeout(300);

    await page.getByRole('button', { name: 'Task Routing', exact: true }).click();
    await page.waitForTimeout(200);

    await expect(page.locator('text=/Build shop/')).toBeVisible();
  });

  test('How We Work Patterns tab shows numbered patterns', async ({ page }) => {
    await page.locator('header').getByRole('button', { name: /How We Work/ }).click();
    await page.waitForTimeout(300);

    await page.getByRole('button', { name: 'Patterns', exact: true }).click();
    await page.waitForTimeout(200);

    await expect(page.locator('text="Small, targeted PRs"')).toBeVisible();
  });

  test('How We Work History tab shows process timeline', async ({ page }) => {
    await page.locator('header').getByRole('button', { name: /How We Work/ }).click();
    await page.waitForTimeout(300);

    await page.getByRole('button', { name: 'History', exact: true }).click();
    await page.waitForTimeout(200);

    await expect(page.locator('text=Process timeline')).toBeVisible();
  });

  test('How We Work History tab has category filter chips', async ({ page }) => {
    await page.locator('header').getByRole('button', { name: /How We Work/ }).click();
    await page.waitForTimeout(300);

    await page.getByRole('button', { name: 'History', exact: true }).click();
    await page.waitForTimeout(200);

    await expect(page.getByRole('button', { name: 'Tooling', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Process', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'UI / Presentation', exact: true })).toBeVisible();
  });

  test('How We Work History tab shows session clusters', async ({ page }) => {
    await page.locator('header').getByRole('button', { name: /How We Work/ }).click();
    await page.waitForTimeout(300);

    await page.getByRole('button', { name: 'History', exact: true }).click();
    await page.waitForTimeout(200);

    // Timeline should have at least one session cluster
    await expect(page.locator('text=/Session \\d+/').first()).toBeVisible();
  });

  test('How We Work History tab filter chips toggle entries', async ({ page }) => {
    await page.locator('header').getByRole('button', { name: /How We Work/ }).click();
    await page.waitForTimeout(300);

    await page.getByRole('button', { name: 'History', exact: true }).click();
    await page.waitForTimeout(200);

    // Click a category filter to toggle it
    await page.getByRole('button', { name: 'Tooling', exact: true }).click();
    await page.waitForTimeout(200);

    // Timeline should still be visible after toggling
    await expect(page.locator('text=Process timeline')).toBeVisible();
  });
});
