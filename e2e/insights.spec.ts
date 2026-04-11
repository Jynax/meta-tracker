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
    // Compact stat row — verify the portfolio header rendered the LOC and hours labels.
    // Values are not asserted literally because they're derived from *Days blocks and
    // shift every metrics push (see Task #95 — previously hard-coded values broke the
    // suite twice during PR #160).
    const headerLoc = page.locator('text=/ LOC$/').first();
    const headerHours = page.locator('text=/ hours$/').first();
    await expect(headerLoc).toBeVisible();
    await expect(headerHours).toBeVisible();
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

  test('velocity scatter labels do not overlap each other or the x-axis (Task #86)', async ({ page }) => {
    const switcher = page.locator('nav[aria-label="Project switcher"]');
    await switcher.locator('button[aria-haspopup="listbox"]').click();
    await switcher.getByRole('option', { name: 'All Projects' }).click();
    await page.getByRole('button', { name: 'What We Learned' }).click();
    // Velocity ≠ Quality chart is the section we care about
    const heading = page.getByText('Velocity ≠ Quality');
    await expect(heading).toBeVisible();

    // Collect bounding boxes of all label <text> nodes inside the scatter's SVG.
    // Exclude the axis labels ("Bugs / 100 LOC", "LOC / session") and numeric ticks
    // by filtering out text whose trimmed content matches an axis label pattern.
    const section = heading.locator('xpath=ancestor::*[self::section or self::div][1]');
    const svg = section.locator('svg').first();
    const boxes = await svg.locator('text').evaluateAll((nodes: Element[]) => {
      return (nodes as SVGTextElement[])
        .map(n => {
          const rect = n.getBoundingClientRect();
          return { text: (n.textContent ?? '').trim(), x: rect.x, y: rect.y, w: rect.width, h: rect.height };
        })
        .filter(b => b.text.length > 0);
    });

    // Partition into axis elements (numeric ticks + axis titles) vs project labels.
    const AXIS_TEXT = new Set(['LOC / session', 'Bugs / 100 LOC']);
    const isNumeric = (s: string) => /^-?\d+(\.\d+)?$/.test(s);
    const labels = boxes.filter(b => !AXIS_TEXT.has(b.text) && !isNumeric(b.text));
    const axisEls = boxes.filter(b => AXIS_TEXT.has(b.text) || isNumeric(b.text));

    // No project label should overlap any other project label.
    const overlaps = (a: typeof boxes[0], b: typeof boxes[0]) =>
      a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

    for (let i = 0; i < labels.length; i++) {
      for (let j = i + 1; j < labels.length; j++) {
        expect(overlaps(labels[i], labels[j]), `labels overlap: "${labels[i].text}" and "${labels[j].text}"`).toBe(false);
      }
    }

    // And no project label should collide with an axis label / tick.
    for (const lbl of labels) {
      for (const ax of axisEls) {
        expect(overlaps(lbl, ax), `label "${lbl.text}" overlaps axis text "${ax.text}"`).toBe(false);
      }
    }
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
