import "dotenv/config";
import { Job, Worker } from "bullmq";
import { Browser, chromium } from "playwright";
import { extractElements } from "./extractor";
import { redisConnection } from "./queue";
import {
  CrawlStorageAdapter,
  createCrawlStorageAdapter,
  createScreenshotStorageAdapter,
} from "./storage";
import { CrawlJob, CrawledPage } from "./types";

const MAX_PAGES = Number(process.env.MAX_PAGES_PER_CRAWL || 50);
const CONCURRENCY = Number(process.env.CRAWLER_CONCURRENCY || 2);

function pageSlug(url: string, index: number): string {
  const slug = url.replace(/[^a-z0-9]/gi, "_").replace(/^_+|_+$/g, "").slice(0, 70);
  return slug || `page_${index}`;
}

function normalizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    parsed.hash = "";
    parsed.searchParams.delete("utm_source");
    parsed.searchParams.delete("utm_medium");
    parsed.searchParams.delete("utm_campaign");
    return parsed.href.replace(/\/$/, ""); // remove trailing slash
  } catch {
    return url;
  }
}

function uniqueInternalLinks(baseUrl: string, links: string[]): string[] {
  const origin = new URL(baseUrl).origin;
  const out = new Set<string>();

  for (const link of links) {
    try {
      const next = new URL(link);
      next.hash = "";

      if (next.origin === origin && ["http:", "https:"].includes(next.protocol)) {
        out.add(next.href);
      }
    } catch {
      // Ignore malformed hrefs.
    }
  }

  return Array.from(out);
}

async function crawlSite(
  job: Job<CrawlJob>,
  browser: Browser,
  crawlStorage: CrawlStorageAdapter,
): Promise<void> {
  const { crawlId, url, maxPages } = job.data;
  const screenshotStorage = createScreenshotStorageAdapter();
  const limit = Math.min(maxPages || MAX_PAGES, MAX_PAGES);

  await crawlStorage.updateCrawl(crawlId, {
    status: "running",
    startedAt: new Date(),
  });

  const context = await browser.newContext({
    userAgent: "WebGenome-Crawler/0.1 (+https://webgenome.vercel.app)",
    viewport: { width: 1280, height: 900 },
  });

  const visited = new Set<string>();
  const canonicalVisited = new Set<string>();
  const pending = [url];
  let pagesCrawled = 0;

  try {
    while (pending.length > 0 && pagesCrawled < limit) {
      const pageUrl = pending.shift();
      const canonical = normalizeUrl(pageUrl || "");

      if (!pageUrl || visited.has(pageUrl) || canonicalVisited.has(canonical)) continue;

      visited.add(pageUrl);
      canonicalVisited.add(canonical);
      const page = await context.newPage();

      try {
        const response = await page.goto(pageUrl, {
          waitUntil: "domcontentloaded",
          timeout: 30000,
        });

        await page.waitForLoadState("networkidle", { timeout: 5000 }).catch(() => undefined);

        const title = await page.title();
        const statusCode = response?.status() ?? null;

        // Gate detection heuristics
        let isGated = false;
        let gateReason = "";

        if (statusCode === 403 || statusCode === 429) {
          isGated = true;
          gateReason = `HTTP ${statusCode}`;
        } else if (title.includes("Just a moment") || title.includes("Attention Required!")) {
          isGated = true;
          gateReason = "Cloudflare Challenge";
        } else {
          const hasTurnstile = await page.locator('input[name="cf-turnstile-response"], .cf-turnstile').count();
          if (hasTurnstile > 0) {
            isGated = true;
            gateReason = "Cloudflare Turnstile";
          }
        }

        const elements = isGated ? [] : await extractElements(page);
        const screenshot = await page.screenshot({ fullPage: true, type: "png" });
        const screenshotUrl = await screenshotStorage.uploadScreenshot(
          crawlId,
          pageSlug(pageUrl, pagesCrawled + 1),
          screenshot,
        );

        const crawledPage: CrawledPage = {
          crawlId,
          url: pageUrl,
          title,
          statusCode,
          elements,
          screenshotUrl,
          crawledAt: new Date(),
          isGated,
          gateReason: isGated ? gateReason : undefined,
        };

        await crawlStorage.addPage(crawledPage);
        pagesCrawled += 1;

        await crawlStorage.updateCrawl(crawlId, {
          pagesCrawled,
          pagesTotal: Math.max(pending.length + pagesCrawled, pagesCrawled),
        });

        await job.updateProgress(Math.round((pagesCrawled / limit) * 100));

        // Skip enqueueing links if page is gated
        if (!isGated) {
          const links = await page.$$eval("a[href]", (anchors) =>
            anchors.map((anchor) => (anchor as HTMLAnchorElement).href),
          );

          for (const link of uniqueInternalLinks(url, links)) {
            const linkCanonical = normalizeUrl(link);
            if (!visited.has(link) && !canonicalVisited.has(linkCanonical) && !pending.includes(link)) {
              pending.push(link);
            }
          }
        }
      } catch (err) {
        console.warn(`[worker] Failed to crawl ${pageUrl}:`, err);
      } finally {
        await page.close();
      }
    }

    await crawlStorage.updateCrawl(crawlId, {
      status: "done",
      pagesTotal: pagesCrawled,
      pagesCrawled,
      finishedAt: new Date(),
    });

    console.log(`[worker] ${crawlId} completed: ${pagesCrawled} pages`);
  } catch (err) {
    await crawlStorage.updateCrawl(crawlId, {
      status: "failed",
      errorMessage: err instanceof Error ? err.message : String(err),
      finishedAt: new Date(),
    });

    throw err;
  } finally {
    await context.close();
  }
}

export async function startWorker(): Promise<Worker<CrawlJob>> {
  const crawlStorage = await createCrawlStorageAdapter();
  const browser = await chromium.launch({ headless: true });

  const worker = new Worker<CrawlJob>(
    "crawl",
    (job) => crawlSite(job, browser, crawlStorage),
    { connection: redisConnection, concurrency: CONCURRENCY },
  );

  worker.on("completed", (job) => console.log(`[worker] Job ${job.id} completed`));
  worker.on("failed", (job, err) => console.error(`[worker] Job ${job?.id} failed:`, err));

  async function shutdown() {
    await worker.close();
    await browser.close();
    await redisConnection.quit();
    process.exit(0);
  }

  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);

  console.log(`[worker] Started with ${crawlStorage.name} storage, concurrency=${CONCURRENCY}`);
  return worker;
}

if (require.main === module) {
  startWorker().catch((err) => {
    console.error("[worker] Startup failed:", err);
    process.exit(1);
  });
}
