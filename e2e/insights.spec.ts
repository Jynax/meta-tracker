import { test, expect } from '@playwright/test';

test.describe('Cross-Project Insights', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('All Projects appears in project dropdown', async ({ page }) => {
    // Open project dropdown
    const switcher = page.locator('nav[aria-label="Project switcher"]');
    await switcher.locator('button[aria-haspopup="listbox"]').click();
    // Verify "All Projects" is visible as an option
    await expect(switcher.getByRole('option', { name: 'All Projects' })).toBeVisible();
  });

  test('selecting All Projects renders InsightsView with portfolio banner', async ({ page }) => {
    // Open dropdown and select All Projects
    const switcher = page.locator('nav[aria-label="Project switcher"]');
    await switcher.locator('button[aria-haspopup="listbox"]').click();
    await switcher.getByRole('option', { name: 'All Projects' }).click();
    // Portfolio banner is a 5-column grid — locate it by its unique Bugs Fixed label
    // and verify all 5 stat labels are present within the same banner container
    const banner = page.locator('div.grid.grid-cols-5');
    await expect(banner).toBeVisible();
    await expect(banner.getByText('Projects', { exact: true })).toBeVisible();
    await expect(banner.getByText('Total LOC', { exact: true })).toBeVisible();
    await expect(banner.getByText('Hours', { exact: true })).toBeVisible();
    await expect(banner.getByText('PRs', { exact: true })).toBeVisible();
    await expect(banner.getByText('Bugs Fixed', { exact: true })).toBeVisible();
  });

  test('insight cards are clickable and switch detail tabs', async ({ page }) => {
    const switcher = page.locator('nav[aria-label="Project switcher"]');
    await switcher.locator('button[aria-haspopup="listbox"]').click();
    await switcher.getByRole('option', { name: 'All Projects' }).click();
    // Default tab should be Velocity
    await expect(page.getByText('LOC / Hour by Project')).toBeVisible();
    // Click Traditional Est. card
    await page.getByText('Traditional Est.').click();
    await expect(page.getByText('Actual vs Traditional Estimate')).toBeVisible();
    // Click Drivers card
    await page.getByText('Drivers').click();
    await expect(page.getByText('Output by Driver Type')).toBeVisible();
    // Click Timeline card
    await page.getByText('Timeline').click();
    await expect(page.getByText('Project Activity Timeline')).toBeVisible();
    // Click Work Mix card
    await page.getByText('Work Mix').click();
    await expect(page.getByText('Work Category Distribution')).toBeVisible();
    // Click Bug Trends card
    await page.getByText('Bug Trends').click();
    await expect(page.getByText(/Bug Discovery Rate/)).toBeVisible();
  });

  test('switching back to individual project restores normal tabs', async ({ page }) => {
    const switcher = page.locator('nav[aria-label="Project switcher"]');
    await switcher.locator('button[aria-haspopup="listbox"]').click();
    await switcher.getByRole('option', { name: 'All Projects' }).click();
    // Verify All Projects view has no View switcher (Decision Tree / Metrics)
    await expect(page.locator('nav[aria-label="View switcher"]')).not.toBeVisible();
    // Now switch back to Meta Tracker
    await switcher.locator('button[aria-haspopup="listbox"]').click();
    await switcher.getByRole('option', { name: 'Meta Tracker' }).click();
    // View switcher should be visible again (Decision Tree + Metrics tabs)
    const viewSwitcher = page.locator('nav[aria-label="View switcher"]');
    await expect(viewSwitcher).toBeVisible();
    await expect(viewSwitcher.getByText('Decision Tree')).toBeVisible();
    await expect(viewSwitcher.getByText('Metrics')).toBeVisible();
  });
});
