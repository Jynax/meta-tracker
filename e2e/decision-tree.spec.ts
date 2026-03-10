import { test, expect } from '@playwright/test';

test.describe('Decision Tree', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('stacked view is the default tree mode', async ({ page }) => {
    const stackedBtn = page.getByRole('button', { name: 'Stacked', exact: true });
    await expect(stackedBtn).toBeVisible();
  });

  test('stacked view renders chapter cards', async ({ page }) => {
    // Chapters are rendered as cards with chapter names like "The Time Machine & Data Model"
    // Look for the chapter container divs within the stacked tree
    const chapterCards = page.locator('button >> text=/^The /');
    const count = await chapterCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('clicking a chapter expands it to show nodes', async ({ page }) => {
    // Click the first chapter — chapter names start with "The "
    const firstChapter = page.locator('button >> text=/^The /').first();
    await firstChapter.click();
    await page.waitForTimeout(300);

    // After expanding, the triangle indicator changes from ▶ to ▼
    // and node entries should appear below
    const expandedIndicator = page.locator('text="▼"');
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
});
