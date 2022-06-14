import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('./modal.html');
  await page.setViewportSize({
    width: 1280,
    height: 720,
  });
});

test('modal should be hidden by default', async ({ page }) => {
  const modal = page.locator('[data-test="modal"]');
  await expect(modal).not.toBeVisible();
});

test('modal should be openable', async ({ page }) => {
  const modal = page.locator('[data-test="modal"]');
  const trigger = page.locator('[data-test="trigger"]');

  await trigger.click();
  await expect(modal).toHaveCSS('display', 'block');
});

test('modal should be closed on button click', async ({ page }) => {
  const modal = page.locator('[data-test="modal"]');
  const trigger = page.locator('[data-test="trigger"]');
  const closeBtn = page.locator('[data-test="close-btn"]');

  await trigger.click();
  await closeBtn.click();
  await expect(modal).toHaveCSS('display', 'none');
});

test('modal should be closed on overlay click', async ({ page }) => {
  const modal = page.locator('[data-test="modal"]');
  const trigger = page.locator('[data-test="trigger"]');

  await trigger.click();
  await page.waitForTimeout(500);
  await page.evaluate(() => {
    document.querySelector('.ax-overlay.active').dispatchEvent(new Event('click'));
  });
  await expect(modal).toHaveCSS('display', 'none');
});
