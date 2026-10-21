import { expect, test } from "@playwright/test";

test("home page presents the project and primary navigation", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1, name: "squander" })).toBeVisible();
  await expect(page.getByRole("link", { name: "getting-started" })).toBeVisible();
  await expect(page.getByRole("link", { name: "pixi-demo" })).toBeVisible();
  await expect(page.getByRole("link", { name: "github" })).toHaveAttribute("href", "https://github.com/ancient-cat/squander");
});

test("documentation navigation loads the getting-started guide", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "getting-started" }).click();

  await expect(page).toHaveURL(/\/docs\/getting-started$/);
  await expect(page.getByRole("heading", { level: 1, name: "Getting Started" })).toBeVisible();
  await expect(page.getByText("npm i squander@latest svelte pixi.js")).toBeVisible();
});
