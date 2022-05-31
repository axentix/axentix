import { test, expect } from '@playwright/test';
const path = require('path');

// const sidenavPagePath = path.join('file://', __dirname, 'testFiles/sidenav.html');
const sidenavPagePath = path.join('file://', __dirname, '../examples/sidenav.html');

test.describe('sm-down screens sidenav tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(sidenavPagePath);
    await page.setViewportSize({
      width: 959,
      height: 720,
    });
    await page.waitForTimeout(500);
  });

  test('sidenav should be out of the screen', async ({ page }) => {
    const sidenav = page.locator('[data-test="sidenav"]');

    const box = await sidenav.boundingBox();
    await expect(box.width - Math.abs(box.x)).toBeLessThanOrEqual(0);
  });

  test('sidenav trigger should be visible', async ({ page }) => {
    const trigger = page.locator('[data-test="sidenav-trigger"]');

    await expect(trigger).toBeVisible();
  });

  test('sidenav should be opened', async ({ page }) => {
    const sidenav = page.locator('[data-test="sidenav"]');
    const trigger = page.locator('[data-test="sidenav-trigger"]');

    await trigger.click();
    await page.waitForTimeout(300);
    const box = await sidenav.boundingBox();
    await expect(box.x).toBe(0);
  });

  test('sidenav should be closed on overlay click', async ({ page }) => {
    const sidenav = page.locator('[data-test="sidenav"]');
    const trigger = page.locator('[data-test="sidenav-trigger"]');

    await trigger.click();
    await page.waitForTimeout(300);
    const box = await sidenav.boundingBox();

    // click on the right of the sidenav, so on the overlay
    await page.mouse.click(box.x + box.width + 5, box.height / 2);

    await page.waitForTimeout(300);
    const newBox = await sidenav.boundingBox();

    await expect(newBox.width - Math.abs(newBox.x)).toBeLessThanOrEqual(0);
  });
});

test.describe('md-up sidenav tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(sidenavPagePath);
    await page.setViewportSize({
      width: 1280,
      height: 720,
    });
    await page.waitForTimeout(500);
  });

  test('sidenav should be inside of the screen', async ({ page }) => {
    const sidenav = page.locator('[data-test="sidenav"]');

    const box = await sidenav.boundingBox();
    await expect(box.x).toBe(0);
  });

  test('sidenav trigger should not be visible', async ({ page }) => {
    const trigger = page.locator('[data-test="sidenav-trigger"]');

    await expect(trigger).not.toBeVisible();
  });

  test('sidenav should be larger', async ({ page }) => {
    const sidenav = page.locator('[data-test="sidenav"]');

    await page.evaluate(() =>
      document.querySelector('body').style.setProperty('--ax-sidenav-width', '20rem')
    );
    const box = await sidenav.boundingBox();
    await expect(box.width).toBe(320);
  });

  // test('sidenav should be on the right', async ({ page }) => {
  //   const sidenav = page.locator('[data-test="sidenav"]');

  //   await page.evaluate(() => {
  //     const sidenav = document.querySelector('[data-test="sidenav"]');
  //     const instance = getComponentClass('sidenav') as Sidenav;
  //     sidenav.classList.add('sidenav-right');
  //     instance.reset();
  //   });

  //   await page.waitForTimeout(300);
  //   const box = await sidenav.boundingBox();

  //   await expect(box.width + box.x).toBe(1280);
  // });
});
