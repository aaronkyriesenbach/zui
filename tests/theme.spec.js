import { test, expect } from '@playwright/test';
import { hosts } from './values/test-constants';

const colorScheme = (page) => page.locator('html').getAttribute('data-mui-color-scheme');

test.describe('color scheme test', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('authConfig', '{}');
    });
  });

  test('follows the operating system setting by default', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto(`${hosts.ui}/home`);
    await expect.poll(() => colorScheme(page)).toBe('dark');

    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto(`${hosts.ui}/home`);
    await expect.poll(() => colorScheme(page)).toBe('light');
  });

  test('keeps an explicit choice over the operating system setting after a reload', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto(`${hosts.ui}/home`);

    await page.getByTestId('theme-mode-button').click();
    await page.getByTestId('theme-mode-dark').click();
    await expect.poll(() => colorScheme(page)).toBe('dark');

    await page.reload();
    await expect.poll(() => colorScheme(page)).toBe('dark');
  });
});
