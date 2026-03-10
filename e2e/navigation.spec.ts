import { test, expect } from '@playwright/test';

test.describe('Navigation & Layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('app loads with Meta Tracker as default project', async ({ page }) => {
    const heading = page.locator('h1');
    await expect(heading).toContainText('Meta Tracker');
  });

  test('project switcher shows all 5 projects', async ({ page }) => {
    const switcher = page.locator('nav[aria-label="Project switcher"]');
    await expect(switcher).toBeVisible();
    const buttons = switcher.locator('button');
    await expect(buttons).toHaveCount(5);
  });

  test('switching projects updates the heading', async ({ page }) => {
    const switcher = page.locator('nav[aria-label="Project switcher"]');
    await switcher.getByText('BIP').click();
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
    // Target the header button specifically (not the chapter card with similar name)
    await page.locator('header').getByRole('button', { name: /How We Work/ }).click();
    const closeButton = page.getByRole('button', { name: /Close/ });
    await expect(closeButton).toBeVisible();
  });

  test('How We Work overlay can be closed', async ({ page }) => {
    await page.locator('header').getByRole('button', { name: /How We Work/ }).click();
    await page.getByRole('button', { name: /Close/ }).click();
    await expect(page.locator('h1')).toContainText('Meta Tracker');
  });
});
