import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('./lightbox.html');
  await page.setViewportSize({
    width: 1280,
    height: 720,
  });
});

test('lightbox should be 1000x600 px', async ({ page }) => {
  const lightbox = page.locator('[data-test="lightbox"]');

  const box = await lightbox.boundingBox();
  await expect(box.width).toBeCloseTo(1000);
  await expect(box.height).toBeCloseTo(600);
});

test('lightbox should be openable', async ({ page }) => {
  const lightbox = page.locator('[data-test="lightbox"]');

  await lightbox.dispatchEvent('click');
  await page.waitForTimeout(500);

  const box = await lightbox.boundingBox();

  await expect(box.width).toBeCloseTo(950);
  await expect(box.height).toBeCloseTo(570);
});

test('lightbox should be closable on click', async ({ page }) => {
  const lightbox = page.locator('[data-test="lightbox"]');

  await lightbox.dispatchEvent('click');
  await page.waitForTimeout(500);

  await lightbox.dispatchEvent('click');
  await page.waitForTimeout(500);

  const box = await lightbox.boundingBox();
  await expect(box.width).toBeCloseTo(1000);
  await expect(box.height).toBeCloseTo(600);
});

test('lightbox should be closable on scroll', async ({ page }) => {
  const lightbox = page.locator('[data-test="lightbox"]');

  await lightbox.dispatchEvent('click');
  await page.waitForTimeout(500);

  // scroll to the bottom of the page
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);

  const box = await lightbox.boundingBox();
  await expect(box.width).toBeCloseTo(1000);
  await expect(box.height).toBeCloseTo(600);
});
