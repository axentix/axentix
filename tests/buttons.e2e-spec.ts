import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('./buttons.html');
  await page.setViewportSize({
    width: 1280,
    height: 720,
  });
});

test('button should be visible', async ({ page }) => {
  const button = page.locator('[data-test="button"]');

  await expect(button).toBeVisible();
  await expect(button).toHaveClass(['btn blue']);
  await expect(button).toContainText('Normal button');
});

test('small button should be small', async ({ page }) => {
  const smallButton = page.locator('[data-test="button-small"]');

  await expect(smallButton).toHaveCSS('font-size', '16px');
});

test('small button should be large', async ({ page }) => {
  const largeButton = page.locator('[data-test="button-large"]');

  await expect(largeButton).toHaveCSS('font-size', '22.4px');
});

test('button should be circle', async ({ page }) => {
  const circleButton = page.locator('[data-test="circle"]');

  const elementBounding = await circleButton.boundingBox();
  await expect(elementBounding.width).toBe(elementBounding.height);
  await expect(circleButton).toHaveCSS('border-radius', '50%');
});

test('button press should be pressed once clicked', async ({ page }) => {
  const pressButton = page.locator('[data-test="press"]');

  await expect(pressButton).toHaveCSS('box-shadow', 'rgba(0, 0, 0, 0.25) 0px -8px 0px -4px inset');

  // simulate mousedown on pressButton
  const elementBounding = await pressButton.boundingBox();
  page.mouse.move(
    elementBounding.x + elementBounding.width / 2,
    elementBounding.y + elementBounding.height / 2
  );
  page.mouse.down();

  await expect(pressButton).toHaveCSS('box-shadow', 'rgba(0, 0, 0, 0.25) 0px 0px 0px 0px inset');
});

test('outline button should change once hovered', async ({ page }) => {
  const outlineButton = page.locator('[data-test="outline"]');
  const outlineText = page.locator('[data-test="outline"] span');

  await expect(outlineText).toHaveCSS('color', 'rgb(33, 150, 243)');

  outlineButton.hover();
  await expect(outlineText).toHaveCSS('color', 'rgb(255, 255, 255)');
});

test('invert outline button should change once hovered', async ({ page }) => {
  const outlineInvertButton = page.locator('[data-test="outline-invert"]');
  const outlineInvertText = page.locator('[data-test="outline-invert"] span');

  await expect(outlineInvertText).toHaveCSS('color', 'rgb(149, 205, 249)');

  outlineInvertButton.hover();
  await expect(outlineInvertText).toHaveCSS('color', 'rgb(0, 0, 0)');
});
