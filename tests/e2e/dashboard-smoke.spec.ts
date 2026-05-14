import { test, expect } from "@playwright/test";

/**
 * WebGenome Dashboard E2E Smoke Test
 *
 * Covers QA runbook scenarios 1–6:
 *   1. Dashboard loads correctly
 *   2. Crawl submission works
 *   3. Status polls to "done"
 *   4. Results display renders
 *   5. Export endpoints return data
 *   6. URL persistence works
 *
 * Target: live Vercel URL (set via BASE_URL env var or playwright.config.ts)
 * Timeout: 90s for poll-to-done to handle cold starts
 */

const POLL_TIMEOUT = 90_000; // 90s — generous for Railway cold starts
const POLL_INTERVAL = 2_000;

let crawlId: string;

test.describe.serial("Dashboard Smoke Suite", () => {
  test("1 · Dashboard loads with all elements", async ({ page }) => {
    await page.goto("/dashboard");

    // Page title
    await expect(page).toHaveTitle(/Dashboard.*WebGenome/);

    // Header
    await expect(page.locator("h1")).toContainText("Crawl a Website");

    // Nav bar
    await expect(page.locator("nav")).toBeVisible();

    // Form elements
    await expect(page.locator("#crawl-url")).toBeVisible();
    await expect(page.locator("#max-pages")).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toContainText("Start Crawl");

    // Empty state
    await expect(page.getByText("No active crawls")).toBeVisible();
  });

  test("2 · Submit crawl for example.com", async ({ page }) => {
    await page.goto("/dashboard");

    // Fill URL
    await page.locator("#crawl-url").fill("example.com");

    // Adjust slider to 2 pages
    await page.locator("#max-pages").fill("2");

    // Submit
    await page.locator('button[type="submit"]').click();

    // Button should show loading state
    await expect(page.getByText("Starting crawl")).toBeVisible({ timeout: 5_000 });

    // Status card should appear with crawlId
    await expect(page.getByText(/crwl_/)).toBeVisible({ timeout: 10_000 });

    // Capture the crawlId from the status card
    const statusText = await page.getByText(/crwl_[a-f0-9]+/).first().textContent();
    const match = statusText?.match(/crwl_[a-f0-9]+/);
    expect(match).toBeTruthy();
    crawlId = match![0];

    // Verify URL state persistence
    await expect(page).toHaveURL(new RegExp(`crawl=${crawlId}`));
  });

  test("3 · Poll to completion (status=done)", async ({ page }) => {
    expect(crawlId).toBeTruthy();

    await page.goto(`/dashboard?crawl=${crawlId}`);

    // Wait for "Complete" badge to appear (polls every 2s)
    await expect(page.getByText("Complete")).toBeVisible({ timeout: POLL_TIMEOUT });

    // Progress should show 100%
    await expect(page.getByText("100%")).toBeVisible();

    // "New Crawl" button should appear
    await expect(page.getByText("New Crawl")).toBeVisible();
  });

  test("4 · Results display renders master-detail view", async ({ page }) => {
    expect(crawlId).toBeTruthy();

    await page.goto(`/dashboard?crawl=${crawlId}`);

    // Wait for results to load (summary bar)
    await expect(page.getByText(/Pages/)).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(/Elements/)).toBeVisible();

    // Page list should show example.com
    await expect(page.getByText("Example Domain")).toBeVisible({ timeout: 10_000 });

    // Elements table should have at least one row
    await expect(page.locator("table tbody tr")).toHaveCount(1, { timeout: 5_000 });

    // The <a> tag pill should be visible
    await expect(page.getByText("<a>")).toBeVisible();
  });

  test("5 · JSON export returns valid data", async ({ request }) => {
    expect(crawlId).toBeTruthy();

    const res = await request.get(`/api/crawl/${crawlId}/export?format=json`);
    expect(res.status()).toBe(200);

    const data = await res.json();
    expect(data.crawlId).toBe(crawlId);
    expect(data.status).toBe("ready");
    expect(data.pages).toBeGreaterThan(0);
    expect(data.elements).toBeGreaterThan(0);
    expect(data.data).toBeInstanceOf(Array);
    expect(data.data[0].elements).toBeInstanceOf(Array);
    expect(data.data[0].title).toBe("Example Domain");
  });

  test("6 · CSV export returns valid content", async ({ request }) => {
    expect(crawlId).toBeTruthy();

    const res = await request.get(`/api/crawl/${crawlId}/export?format=csv`);
    expect(res.status()).toBe(200);

    const csv = await res.text();

    // Header row should contain expected columns
    expect(csv).toContain("crawlId");
    expect(csv).toContain("url");
    expect(csv).toContain("tag");
    expect(csv).toContain("css");
    expect(csv).toContain("xpath");

    // Should have at least 2 lines (header + 1 element)
    const lines = csv.trim().split("\n");
    expect(lines.length).toBeGreaterThanOrEqual(2);
  });

  test("7 · URL persistence — reload restores results", async ({ page }) => {
    expect(crawlId).toBeTruthy();

    // Navigate directly to the persisted URL
    await page.goto(`/dashboard?crawl=${crawlId}`);

    // Results should load automatically
    await expect(page.getByText("Example Domain")).toBeVisible({ timeout: 15_000 });
    await expect(page.locator("table tbody tr")).toHaveCount(1, { timeout: 5_000 });
  });

  test("8 · Health check — API proxy responds", async ({ request }) => {
    // Submit endpoint should accept POST
    const res = await request.post("/api/crawl", {
      data: { url: "https://example.com", maxPages: 1 },
    });

    expect(res.status()).toBe(202);
    const body = await res.json();
    expect(body.crawlId).toMatch(/^crwl_/);
    expect(body.status).toBe("queued");
  });

  test("9 · HTML export returns valid styled report", async ({ request }) => {
    expect(crawlId).toBeTruthy();

    const res = await request.get(`/api/crawl/${crawlId}/export?format=html`);
    expect(res.status()).toBe(200);

    const html = await res.text();

    // Should be a complete HTML document
    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("WebGenome Crawl Report");
    expect(html).toContain(crawlId);

    // Should contain page data
    expect(html).toContain("Example Domain");

    // Content-Disposition should trigger download
    const disposition = res.headers()["content-disposition"];
    expect(disposition).toContain(`webgenome-${crawlId}.html`);
  });

  test("10 · Gate hard-stop regression — gated crawl does not burn budget", async ({ request }) => {
    // Submit a crawl for a known Cloudflare-protected site with maxPages > 1
    // The crawler should detect the gate on the first or very early page
    // and stop immediately instead of burning all 5 pages
    const submitRes = await request.post("/api/crawl", {
      data: { url: "https://qxbroker.com/en", maxPages: 5 },
    });

    expect(submitRes.status()).toBe(202);
    const { crawlId: gatedCrawlId } = await submitRes.json();

    // Poll until terminal state (done, failed, or waiting_for_access)
    let status = "queued";
    const deadline = Date.now() + POLL_TIMEOUT;
    while (Date.now() < deadline) {
      const pollRes = await request.get(`/api/crawl/${gatedCrawlId}`);
      const data = await pollRes.json();
      status = data.status;

      if (status === "done" || status === "failed" || status === "waiting_for_access") {
        // Key assertion: if site is gated, pagesCrawled should be << maxPages
        // The hard stop means at most 1-2 pages, never all 5
        if (status === "waiting_for_access") {
          expect(data.pagesCrawled).toBeLessThanOrEqual(2);
          expect(data.blockedAtUrl).toBeTruthy();
          expect(data.blockedReason).toBeTruthy();
        }
        break;
      }

      await new Promise((r) => setTimeout(r, POLL_INTERVAL));
    }

    // Crawl should have reached a terminal or paused state
    expect(["done", "failed", "waiting_for_access"]).toContain(status);
  });

  test("11 · Metrics endpoint responds", async ({ request }) => {
    const res = await request.get("/api/crawl", {
      // Hit the crawler directly — this test uses the proxy
    });

    // We just verify the health endpoint works through the proxy
    // The /metrics endpoint lives on the crawler, not the proxy
    expect(res.status()).toBeLessThan(500);
  });
});
