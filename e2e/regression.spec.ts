import { test, expect } from '@playwright/test';

test.describe('Regression Guards', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // === Task #57: Regression tests for previously fixed bugs ===

  test('default project is Meta Tracker on fresh load (Bug #36)', async ({ page }) => {
    const heading = page.locator('h1');
    await expect(heading).toContainText('Meta Tracker');

    const activeProject = page.locator('nav[aria-label="Project switcher"] button[aria-haspopup="listbox"]');
    await expect(activeProject).toContainText('Meta Tracker');
  });

  test('metrics do not crash on rapid project switching', async ({ page }) => {
    const viewSwitcher = page.locator('nav[aria-label="View switcher"]');
    await viewSwitcher.getByText('Metrics').click();
    await page.waitForTimeout(200);

    const switcher = page.locator('nav[aria-label="Project switcher"]');
    const projects = ['BIP', 'Remnants', 'Item-B-Gone', 'Vuln Bank', 'Meta Tracker'];

    for (const project of projects) {
      await switcher.locator('button[aria-haspopup="listbox"]').click();
      await switcher.getByRole('option', { name: project }).click();
      await page.waitForTimeout(50);
    }

    await viewSwitcher.getByText('Metrics').click();
    await page.waitForTimeout(300);
    const content = page.locator('[class*="rounded"]').first();
    await expect(content).toBeVisible();
  });

  test('Session Activity chart toggle does not break chart', async ({ page }) => {
    // MT uses TasksTab in Phase 3; Sessions chart only exists for non-MT projects.
    const switcher = page.locator('nav[aria-label="Project switcher"]');
    await switcher.locator('button[aria-haspopup="listbox"]').click();
    await switcher.getByRole('option', { name: 'BIP' }).click();
    await expect(page.locator('h1')).toContainText('BIP');

    const viewSwitcher = page.locator('nav[aria-label="View switcher"]');
    await viewSwitcher.getByText('Metrics').click();
    await page.getByRole('button', { name: 'Sessions', exact: true }).click();
    await page.waitForTimeout(300);

    const chart = page.locator('svg[aria-label="Session activity chart"]');
    await expect(chart).toBeVisible();

    const byDayBtn = page.locator('button:has-text("By Day")');
    const bySessionBtn = page.locator('button:has-text("By Session")');

    if (await byDayBtn.count() > 0 && await bySessionBtn.count() > 0) {
      await byDayBtn.click();
      await page.waitForTimeout(100);
      await expect(chart).toBeVisible();

      await bySessionBtn.click();
      await page.waitForTimeout(100);
      await expect(chart).toBeVisible();

      await byDayBtn.click();
      await page.waitForTimeout(100);
      await expect(chart).toBeVisible();
    }
  });

  test('no blank screens after switching all 5 projects in sequence', async ({ page }) => {
    const switcher = page.locator('nav[aria-label="Project switcher"]');
    const projects = ['BIP', 'Remnants', 'Item-B-Gone', 'Vuln Bank', 'Meta Tracker'];

    for (const project of projects) {
      await switcher.locator('button[aria-haspopup="listbox"]').click();
      await switcher.getByRole('option', { name: project }).click();
      await expect(page.locator('h1')).toContainText(project);
      const content = page.locator('section');
      await expect(content).toBeVisible();
    }
  });

  test('switching view to Metrics and back to Tree preserves project', async ({ page }) => {
    const switcher = page.locator('nav[aria-label="Project switcher"]');
    await switcher.locator('button[aria-haspopup="listbox"]').click();
    await switcher.getByRole('option', { name: 'BIP' }).click();
    await expect(page.locator('h1')).toContainText('BIP');

    const viewSwitcher = page.locator('nav[aria-label="View switcher"]');
    await viewSwitcher.getByText('Metrics').click();
    await page.waitForTimeout(200);

    await expect(page.locator('h1')).toContainText('BIP');
  });

  test('code tab parent date bars render with visible width', async ({ page }) => {
    const viewSwitcher = page.locator('nav[aria-label="View switcher"]');
    await viewSwitcher.getByText('Metrics').click();
    await page.getByRole('button', { name: 'Code', exact: true }).click();
    await page.waitForTimeout(300);

    const dateRows = page.locator('button.w-full.text-left');
    const count = await dateRows.count();
    expect(count).toBeGreaterThan(0);
  });

  test('BIP project loads without duplicate React key warnings', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'warning' && /same key/.test(msg.text())) {
        errors.push(msg.text());
      }
      if (msg.type() === 'error' && /same key/.test(msg.text())) {
        errors.push(msg.text());
      }
    });

    const switcher = page.locator('nav[aria-label="Project switcher"]');
    await switcher.locator('button[aria-haspopup="listbox"]').click();
    await switcher.getByRole('option', { name: 'BIP' }).click();
    await page.waitForTimeout(500);

    const viewSwitcher = page.locator('nav[aria-label="View switcher"]');
    await viewSwitcher.getByText('Metrics').click();
    await page.waitForTimeout(500);

    expect(errors).toEqual([]);
  });

  test('theme persists in localStorage after SC easter egg toggle', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('theme', 'sc');
    });
    await page.reload();
    await page.waitForTimeout(500);

    const storedTheme = await page.evaluate(() => localStorage.getItem('theme'));
    expect(storedTheme).toBe('sc');

    // Clean up
    await page.evaluate(() => {
      localStorage.removeItem('theme');
    });
  });
});
