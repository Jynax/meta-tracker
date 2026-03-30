import { test, expect } from '@playwright/test';

test.describe('Cross-Project Insights', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('All Projects appears in project dropdown', async ({ page }) => {
    const switcher = page.locator('nav[aria-label="Project switcher"]');
    await switcher.locator('button[aria-haspopup="listbox"]').click();
    await expect(switcher.getByRole('option', { name: 'All Projects' })).toBeVisible();
  });

  test('selecting All Projects renders narrative headline and stats', async ({ page }) => {
    const switcher = page.locator('nav[aria-label="Project switcher"]');
    await switcher.locator('button[aria-haspopup="listbox"]').click();
    await switcher.getByRole('option', { name: 'All Projects' }).click();
    // Narrative headline
    await expect(page.getByText('9 projects. 3 AI tools. 1 human.')).toBeVisible();
    // Compact stat row — check a few key stats are present
    await expect(page.getByText('projects', { exact: false })).toBeVisible();
    await expect(page.getByText('LOC', { exact: false })).toBeVisible();
    await expect(page.getByText('hours', { exact: false })).toBeVisible();
  });

  test('chapter tabs are clickable and switch content', async ({ page }) => {
    const switcher = page.locator('nav[aria-label="Project switcher"]');
    await switcher.locator('button[aria-haspopup="listbox"]').click();
    await switcher.getByRole('option', { name: 'All Projects' }).click();
    // Default chapter: The Story
    await expect(page.getByText('From One App to Nine')).toBeVisible();
    // Click What We Learned
    await page.getByRole('button', { name: 'What We Learned' }).click();
    await expect(page.getByText('Velocity ≠ Quality')).toBeVisible();
    // Click By the Numbers
    await page.getByRole('button', { name: 'By the Numbers' }).click();
    await expect(page.getByText('LOC/hr by Project')).toBeVisible();
    // Click For Teams
    await page.getByRole('button', { name: 'For Teams' }).click();
    await expect(page.getByText('What Scales')).toBeVisible();
    // Click From the AI
    await page.getByRole('button', { name: 'From the AI' }).click();
    await expect(page.getByText('What I Handle Well')).toBeVisible();
  });

  test('switching back to individual project restores normal tabs', async ({ page }) => {
    const switcher = page.locator('nav[aria-label="Project switcher"]');
    await switcher.locator('button[aria-haspopup="listbox"]').click();
    await switcher.getByRole('option', { name: 'All Projects' }).click();
    await expect(page.locator('nav[aria-label="View switcher"]')).not.toBeVisible();
    await switcher.locator('button[aria-haspopup="listbox"]').click();
    await switcher.getByRole('option', { name: 'Meta Tracker' }).click();
    const viewSwitcher = page.locator('nav[aria-label="View switcher"]');
    await expect(viewSwitcher).toBeVisible();
    await expect(viewSwitcher.getByText('Decision Tree')).toBeVisible();
    await expect(viewSwitcher.getByText('Metrics')).toBeVisible();
  });
});
