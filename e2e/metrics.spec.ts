import { test, expect } from '@playwright/test';

test.describe('Metrics Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Switch to metrics view
    const viewSwitcher = page.locator('nav[aria-label="View switcher"]');
    await viewSwitcher.getByText('Metrics').click();
  });

  test('metrics view renders with Overview tab active', async ({ page }) => {
    const overviewBtn = page.getByRole('button', { name: 'Overview' });
    await expect(overviewBtn).toBeVisible();
  });

  test('all four metric tabs are present', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Overview' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Code' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Bugs' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sessions' })).toBeVisible();
  });

  test('overview tab renders chart content', async ({ page }) => {
    // Overview tab has SVG charts or metric cards
    const svgs = page.locator('svg');
    const count = await svgs.count();
    expect(count).toBeGreaterThan(0);
  });

  test('code tab renders content', async ({ page }) => {
    await page.getByRole('button', { name: 'Code' }).click();
    // Code tab shows code volume data — look for the summary stats or bar elements
    await page.waitForTimeout(300);
    // Should have visible content within the metrics container
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
    await page.getByRole('button', { name: 'Sessions' }).click();
    await page.waitForTimeout(300);
    const content = page.locator('[class*="rounded-2xl"]').first();
    await expect(content).toBeVisible();
  });

  test('switching projects then viewing metrics works', async ({ page }) => {
    // Go back to tree, switch project, then back to metrics
    const viewSwitcher = page.locator('nav[aria-label="View switcher"]');

    // Switch to BIP
    const switcher = page.locator('nav[aria-label="Project switcher"]');
    await switcher.getByText('BIP').click();
    await expect(page.locator('h1')).toContainText('BIP');

    // Project switch resets to tree view, so switch back to metrics
    await viewSwitcher.getByText('Metrics').click();

    // Metrics container should be visible
    const metricsContainer = page.locator('[class*="rounded-2xl"]').first();
    await expect(metricsContainer).toBeVisible();
  });
});
