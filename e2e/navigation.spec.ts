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

  test('project switcher shows all 7 projects', async ({ page }) => {
    const switcher = page.locator('nav[aria-label="Project switcher"]');
    await expect(switcher).toBeVisible();
    // Open dropdown to count project options
    await switcher.locator('button[aria-haspopup="listbox"]').click();
    const options = switcher.locator('button[role="option"]');
    await expect(options).toHaveCount(7);
  });

  test('switching projects updates the heading', async ({ page }) => {
    const switcher = page.locator('nav[aria-label="Project switcher"]');
    await switcher.locator('button[aria-haspopup="listbox"]').click();
    await switcher.getByRole('option', { name: 'BIP' }).click();
    await expect(page.locator('h1')).toContainText('BIP');
  });

  test('view switcher shows Decision Tree and Metrics tabs', async ({ page }) => {
    const viewSwitcher = page.locator('nav[aria-label="View switcher"]');
    await expect(viewSwitcher.getByText('Decision Tree')).toBeVisible();
    await expect(viewSwitcher.getByText('Metrics')).toBeVisible();
  });

  test('Decision Tree is the default view', async ({ page }) => {
    const treeTab = page.locator('nav[aria-label="View switcher"] button', { hasText: 'Decision Tree' });
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

  test('How We Work History tab shows Changelog and Time Machine toggle', async ({ page }) => {
    await page.locator('header').getByRole('button', { name: /How We Work/ }).click();
    await page.waitForTimeout(300);

    await page.getByRole('button', { name: 'History', exact: true }).click();
    await page.waitForTimeout(200);

    await expect(page.getByRole('button', { name: 'Changelog', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Time Machine', exact: true })).toBeVisible();
  });

  test('How We Work Time Machine shows slider control', async ({ page }) => {
    await page.locator('header').getByRole('button', { name: /How We Work/ }).click();
    await page.waitForTimeout(300);

    await page.getByRole('button', { name: 'History', exact: true }).click();
    await page.waitForTimeout(200);

    await page.getByRole('button', { name: 'Time Machine', exact: true }).click();
    await page.waitForTimeout(300);

    const slider = page.locator('input[aria-label="Time machine session slider"]');
    await expect(slider).toBeVisible();
  });

  test('How We Work Time Machine slider shows snapshot items', async ({ page }) => {
    await page.locator('header').getByRole('button', { name: /How We Work/ }).click();
    await page.waitForTimeout(300);

    await page.getByRole('button', { name: 'History', exact: true }).click();
    await page.waitForTimeout(200);

    await page.getByRole('button', { name: 'Time Machine', exact: true }).click();
    await page.waitForTimeout(300);

    const changesText = page.locator('text=/\\d+ of \\d+ changes applied/');
    await expect(changesText).toBeVisible();
  });

  test('How We Work Time Machine snapshot items are expandable', async ({ page }) => {
    await page.locator('header').getByRole('button', { name: /How We Work/ }).click();
    await page.waitForTimeout(300);

    await page.getByRole('button', { name: 'History', exact: true }).click();
    await page.waitForTimeout(200);

    await page.getByRole('button', { name: 'Time Machine', exact: true }).click();
    await page.waitForTimeout(500);

    // Wait for snapshot items to render after FadeIn animation
    const firstItem = page.getByRole('button', { name: /How We Work view added/ });
    await expect(firstItem).toBeVisible({ timeout: 5000 });
    await firstItem.click();
    await page.waitForTimeout(300);

    const stateLabel = page.locator('text=/Current State|State/');
    await expect(stateLabel.first()).toBeVisible({ timeout: 5000 });
  });
});
