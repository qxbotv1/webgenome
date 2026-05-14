import "dotenv/config";
import "./db"; // DNS fix must run before any network imports
import cors from "cors";
import express from "express";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { enqueueCrawl } from "./queue";
import { createCrawlStorageAdapter, CrawlStorageAdapter } from "./storage";
import { CrawlRecord } from "./types";
import { startWorker } from "./worker";

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

let crawlStorage: CrawlStorageAdapter;

const crawlSchema = z.object({
  url: z.string().url(),
  maxPages: z.number().int().min(1).max(50).default(10),
});

function csvCell(value: unknown): string {
  return `"${String(value ?? "").replace(/"/g, "\"\"")}"`;
}

app.post("/crawl", async (req, res) => {
  const parsed = crawlSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  try {
    const { url, maxPages } = parsed.data;
    const crawlId = `crwl_${uuidv4().slice(0, 8)}`;

    const record: CrawlRecord = {
      crawlId,
      siteUrl: url,
      status: "queued",
      maxPages,
      pagesTotal: 0,
      pagesCrawled: 0,
      createdAt: new Date(),
    };

    await crawlStorage.createCrawl(record);
    await enqueueCrawl({ crawlId, url, maxPages });

    return res.status(202).json({
      crawlId,
      status: "queued",
      pollUrl: `/crawl/${crawlId}`,
    });
  } catch (err) {
    console.error("[server] Failed to enqueue crawl:", err);
    return res.status(503).json({ error: "Crawler queue unavailable." });
  }
});

app.get("/crawl/:id", async (req, res) => {
  const crawl = await crawlStorage.getCrawl(req.params.id);
  if (!crawl) return res.status(404).json({ error: "Crawl not found." });

  return res.json(crawl);
});

app.post("/crawl/:id/unlock", async (req, res) => {
  const crawl = await crawlStorage.getCrawl(req.params.id);
  if (!crawl) return res.status(404).json({ error: "Crawl not found." });

  const { token } = req.body;
  if (!token || typeof token !== "string") {
    return res.status(400).json({ error: "A valid string token must be provided." });
  }

  // Update status back to queued
  await crawlStorage.updateCrawl(crawl.crawlId, { status: "queued" });

  // Re-enqueue the job with the session token
  await enqueueCrawl({
    crawlId: crawl.crawlId,
    url: crawl.siteUrl,
    maxPages: crawl.maxPages,
    sessionCookie: token.trim(),
  });

  return res.status(202).json({ status: "queued", message: "Crawl resumed with provided access token." });
});

app.get("/crawl/:id/pages", async (req, res) => {
  const limit = Math.min(Number(req.query.limit || 20), 100);
  const skip = Math.max(Number(req.query.skip || 0), 0);
  const pages = await crawlStorage.getPages(req.params.id, { skip, limit });

  return res.json({ pages, skip, limit });
});

app.get("/crawl/:id/export", async (req, res) => {
  const payload = await crawlStorage.getExport(req.params.id);

  if (!payload) {
    return res.status(404).json({ error: "Crawl not found." });
  }

  if (payload.crawl.status !== "done" && payload.crawl.status !== "waiting_for_access") {
    return res.status(202).json({
      error: "Crawl is not complete yet.",
      status: payload.crawl.status,
    });
  }

  if (req.query.format === "csv") {
    const rows = [["crawlId", "url", "title", "tag", "text", "css", "xpath", "type", "href"]];

    for (const page of payload.pages) {
      for (const element of page.elements) {
        rows.push([
          payload.crawl.crawlId,
          page.url,
          page.title,
          element.tag,
          element.text ?? "",
          element.css,
          element.xpath,
          element.type ?? "",
          element.href ?? "",
        ]);
      }
    }

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="webgenome-${payload.crawl.crawlId}.csv"`,
    );

    return res.send(rows.map((row) => row.map(csvCell).join(",")).join("\n"));
  }

  return res.json({
    crawlId: payload.crawl.crawlId,
    siteUrl: payload.crawl.siteUrl,
    pages: payload.pages.length,
    elements: payload.elementsTotal,
    status: "ready",
    data: payload.pages,
  });
});

app.get("/health", (_req, res) => {
  return res.json({
    status: "ok",
    storage: crawlStorage.name,
    ts: new Date().toISOString(),
  });
});

async function main() {
  crawlStorage = await createCrawlStorageAdapter();

  const port = Number(process.env.PORT || 4000);
  app.listen(port, () => {
    console.log(`[server] WebGenome crawler API listening on :${port}`);
    console.log(`[server] Storage adapter: ${crawlStorage.name}`);
  });

  if (process.env.START_WORKER !== "false") {
    await startWorker();
  }
}

main().catch((err) => {
  console.error("[server] Startup failed:", err);
  process.exit(1);
});
