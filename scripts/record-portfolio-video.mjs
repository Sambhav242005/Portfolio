#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

const baseUrl = normalizeBaseUrl(process.env.PORTFOLIO_URL ?? process.argv[2] ?? "http://127.0.0.1:3001");
const outputDir = path.resolve(repoRoot, process.env.VIDEO_DIR ?? "scratch/playwright-video");
const headless = process.env.HEADLESS !== "0";
const slowMo = Number(process.env.SLOW_MO ?? "120");
const screenshotDir = path.join(outputDir, "screenshots");
const downloadsDir = path.join(outputDir, "downloads");
const reportPath = path.join(outputDir, "recording-report.json");
const finalVideoPath = path.join(outputDir, "portfolio-demo.webm");

let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch (error) {
  console.error("Playwright is not installed in this project.");
  console.error("Install it once, then rerun the recorder:");
  console.error("  npm install -D playwright");
  console.error("  npx playwright install chromium");
  console.error("  npm run record:demo");
  console.error(`Import error: ${error.message}`);
  process.exit(1);
}

await fs.mkdir(screenshotDir, { recursive: true });
await fs.mkdir(downloadsDir, { recursive: true });

const report = {
  baseUrl,
  startedAt: new Date().toISOString(),
  video: finalVideoPath,
  screenshots: [],
  downloads: [],
  steps: [],
  console: [],
  pageErrors: [],
  linkAudit: [],
};

const browser = await chromium.launch({
  headless,
  slowMo,
});

const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  acceptDownloads: true,
  recordVideo: {
    dir: outputDir,
    size: { width: 1440, height: 1000 },
  },
});

const page = await context.newPage();
const video = page.video();

page.on("console", (message) => {
  if (["error", "warning"].includes(message.type())) {
    report.console.push({
      type: message.type(),
      text: message.text(),
      url: page.url(),
    });
  }
});

page.on("pageerror", (error) => {
  report.pageErrors.push({
    message: error.message,
    url: page.url(),
  });
});

try {
  await step("Open resume page first", async () => {
    await goto("/resume");
    await expectHeading("Resume");
  });

  await step("Download resume PDF", async () => {
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("link", { name: /download pdf/i }).click(),
    ]);
    const suggested = download.suggestedFilename() || "resume.pdf";
    const savedPath = path.join(downloadsDir, suggested);
    await download.saveAs(savedPath);
    report.downloads.push(savedPath);
  });

  await step("Go home from brand link", async () => {
    await page.getByRole("link", { name: /sambhav surana home/i }).click();
    await waitForApp();
    await expectHeading(/AI\/ML|Builder|Engineer|Developer/i, { exact: false });
  });

  await step("Home primary CTA opens Projects", async () => {
    await page.getByRole("link", { name: /view projects/i }).first().click();
    await waitForPath("/projects");
    await expectHeading("Projects");
  });

  await step("Click every project detail link", async () => {
    await clickEveryInternalCardLink("/projects", "/projects/");
  });

  await step("Navigation opens Resume", async () => {
    await clickPrimaryNav("Resume");
    await waitForPath("/resume");
    await expectHeading("Resume");
  });

  await step("Navigation opens Writing", async () => {
    await clickPrimaryNav("Writing");
    await waitForPath("/writing");
    await expectHeading("Writing");
  });

  await step("Click every writing detail link", async () => {
    await clickEveryInternalCardLink("/writing", "/writing/");
  });

  await step("Navigation opens Contact", async () => {
    await clickPrimaryNav("Contact");
    await waitForPath("/contact");
    await expectHeading("Contact");
  });

  await step("Audit contact and social links without external side effects", async () => {
    const links = await page.locator("a").evaluateAll((anchors) =>
      anchors.map((anchor) => ({
        text: anchor.textContent?.replace(/\s+/g, " ").trim(),
        href: anchor.href,
        target: anchor.target,
      })),
    );
    report.linkAudit.push(...links);
    const broken = links.filter((link) => !link.href || link.href.endsWith("#"));
    if (broken.length > 0) {
      throw new Error(`Found ${broken.length} empty or placeholder links: ${JSON.stringify(broken)}`);
    }
  });

  await step("Mobile menu opens and navigates", async () => {
    await page.setViewportSize({ width: 390, height: 844 });
    await goto("/");
    await page.getByLabel(/open navigation/i).click();
    await page.getByRole("navigation", { name: /mobile navigation/i }).getByRole("link", { name: "Contact" }).click();
    await waitForPath("/contact");
    await expectHeading("Contact");
  });
} finally {
  await capture("final-state");
  await context.close();
  await browser.close();

  if (video) {
    await video.saveAs(finalVideoPath);
  }

  report.finishedAt = new Date().toISOString();
  report.status = report.steps.every((item) => item.status === "passed") ? "passed" : "failed";
  await fs.writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);

  console.log(`Status: ${report.status}`);
  console.log(`Video: ${finalVideoPath}`);
  console.log(`Report: ${reportPath}`);
  console.log(`Screenshots: ${screenshotDir}`);
  if (report.console.length > 0 || report.pageErrors.length > 0) {
    console.log(`Console warnings/errors: ${report.console.length}`);
    console.log(`Page errors: ${report.pageErrors.length}`);
  }
}

async function step(name, action) {
  console.log(`STEP: ${name}`);
  const startedAt = new Date().toISOString();
  try {
    await action();
    const screenshot = await capture(name);
    report.steps.push({
      name,
      status: "passed",
      url: page.url(),
      screenshot,
      startedAt,
      finishedAt: new Date().toISOString(),
    });
  } catch (error) {
    const screenshot = await capture(`${name}-failed`);
    report.steps.push({
      name,
      status: "failed",
      url: page.url(),
      screenshot,
      error: error.message,
      startedAt,
      finishedAt: new Date().toISOString(),
    });
    console.error(`FAILED: ${name}`);
    console.error(error);
    throw error;
  }
}

async function goto(pathname) {
  await page.goto(new URL(pathname, baseUrl).toString(), { waitUntil: "domcontentloaded" });
  await waitForApp();
}

async function waitForApp() {
  await page.waitForLoadState("domcontentloaded");
  await page.waitForSelector("main", { timeout: 15000 });
  await page.waitForTimeout(350);
}

async function waitForPath(pathname) {
  await page.waitForURL((url) => url.pathname === pathname, { timeout: 15000 });
  await waitForApp();
}

async function expectHeading(nameOrPattern, options = {}) {
  const heading = page.getByRole("heading", { name: nameOrPattern, exact: options.exact ?? true }).first();
  await heading.waitFor({ state: "visible", timeout: 15000 });
}

async function clickPrimaryNav(label) {
  await page.getByRole("navigation", { name: /primary navigation/i }).getByRole("link", { name: label }).click();
  await waitForApp();
}

async function clickEveryInternalCardLink(listPath, detailPrefix) {
  await goto(listPath);
  const hrefs = await page.locator(`a[href^="${detailPrefix}"]`).evaluateAll((anchors) =>
    Array.from(new Set(anchors.map((anchor) => anchor.getAttribute("href")).filter(Boolean))),
  );

  if (hrefs.length === 0) {
    throw new Error(`No detail links found for ${listPath}`);
  }

  for (const href of hrefs) {
    await goto(listPath);
    await page.locator(`a[href="${href}"]`).first().click();
    await waitForPath(href);
    await page.waitForTimeout(450);
    await capture(`detail-${href.replaceAll("/", "-")}`);
  }
}

async function capture(label) {
  const fileName = `${String(report.screenshots.length + 1).padStart(2, "0")}-${slugify(label)}.png`;
  const screenshotPath = path.join(screenshotDir, fileName);
  await page.screenshot({ path: screenshotPath, fullPage: false });
  report.screenshots.push(screenshotPath);
  return screenshotPath;
}

function normalizeBaseUrl(value) {
  const url = new URL(value);
  url.hash = "";
  url.search = "";
  return url.toString().replace(/\/$/, "/");
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}
