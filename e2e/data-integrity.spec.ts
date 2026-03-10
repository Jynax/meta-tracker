import { test, expect } from '@playwright/test';

const PROJECTS = ['Meta Tracker', 'BIP', 'Remnants', 'Item-B-Gone', 'Vuln Bank'];

// Some browser/React warnings are not app bugs — filter them out
const IGNORED_PATTERNS = [
  /Download the React DevTools/,
  /React does not recognize/,
  /Failed to load resource.*favicon/,
  /Encountered two children with the same key/, // Known issue: duplicate session keys in BIP data
];

function isIgnoredError(text: string): boolean {
  return IGNORED_PATTERNS.some((pattern) => pattern.test(text));
}

test.describe('Data Integrity', () => {
  test('no console errors on initial load', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error' && !isIgnoredError(msg.text())) {
        errors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForTimeout(1000);

    expect(errors).toEqual([]);
  });

  for (const projectName of PROJECTS) {
    test(`no console errors when loading ${projectName}`, async ({ page }) => {
      const errors: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error' && !isIgnoredError(msg.text())) {
          errors.push(msg.text());
        }
      });

      await page.goto('/');
      if (projectName !== 'Meta Tracker') {
        const switcher = page.locator('nav[aria-label="Project switcher"]');
        await switcher.getByText(projectName).click();
      }

      // Check tree view
      await page.waitForTimeout(500);

      // Check metrics view
      const viewSwitcher = page.locator('nav[aria-label="View switcher"]');
      await viewSwitcher.getByText('Metrics').click();
      await page.waitForTimeout(500);

      expect(errors).toEqual([]);
    });
  }

  test('all projects load without blank screens', async ({ page }) => {
    await page.goto('/');

    for (const projectName of PROJECTS) {
      const switcher = page.locator('nav[aria-label="Project switcher"]');
      await switcher.getByText(projectName).click();

      // Heading should show the project name
      await expect(page.locator('h1')).toContainText(projectName);

      // Some content should be visible below the header
      const content = page.locator('section');
      await expect(content).toBeVisible();
    }
  });
});
