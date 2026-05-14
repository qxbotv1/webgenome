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

  if (req.query.format === "html") {
    const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    const crawl = payload.crawl;
    const pages = payload.pages;

    let pagesHtml = "";
    for (const pg of pages) {
      const gatedBadge = pg.isGated
        ? `<span style="background:#ff4d6a22;color:#ff4d6a;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:700">GATED — ${esc(pg.gateReason || "blocked")}</span>`
        : "";
      const statusColor = (pg.statusCode ?? 0) >= 400 ? "#ff4d6a" : (pg.statusCode ?? 0) >= 300 ? "#ffa726" : "#00d4ff";

      let elemRows = "";
      for (const el of pg.elements) {
        elemRows += `<tr>
          <td><code>${esc(el.tag)}</code></td>
          <td>${esc(el.text ?? "")}</td>
          <td><code style="font-size:10px">${esc(el.css)}</code></td>
          <td><code style="font-size:10px">${esc(el.xpath)}</code></td>
          <td>${esc(el.href ?? "")}</td>
        </tr>`;
      }

      pagesHtml += `
        <div style="margin-bottom:32px;border:1px solid #333;border-radius:12px;overflow:hidden">
          <div style="padding:16px 20px;background:#1a1a2e;display:flex;align-items:center;gap:12px;flex-wrap:wrap">
            <h3 style="margin:0;font-size:14px;color:#e0e0e0">${esc(pg.title || "Untitled")}</h3>
            ${gatedBadge}
            <span style="color:${statusColor};font-size:12px;font-family:monospace">${pg.statusCode ?? "—"}</span>
          </div>
          <div style="padding:8px 20px;background:#16162a;font-size:11px;color:#888;font-family:monospace">${esc(pg.url)}</div>
          ${pg.elements.length > 0 ? `
          <div style="overflow-x:auto">
            <table style="width:100%;border-collapse:collapse;font-size:12px">
              <thead><tr style="background:#1e1e3a;color:#aaa;text-align:left">
                <th style="padding:8px 12px">Tag</th>
                <th style="padding:8px 12px">Text</th>
                <th style="padding:8px 12px">CSS Selector</th>
                <th style="padding:8px 12px">XPath</th>
                <th style="padding:8px 12px">Href</th>
              </tr></thead>
              <tbody>${elemRows}</tbody>
            </table>
          </div>` : `<div style="padding:20px;text-align:center;color:#666;font-size:12px">No elements extracted</div>`}
        </div>`;
    }

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>WebGenome Report — ${esc(crawl.crawlId)}</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{background:#0d0d1a;color:#e0e0e0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;padding:40px 24px}
    .container{max-width:1100px;margin:0 auto}
    h1{font-size:22px;margin-bottom:4px;color:#fff}
    .subtitle{color:#888;font-size:13px;margin-bottom:32px}
    .summary{display:flex;gap:16px;flex-wrap:wrap;margin-bottom:32px}
    .chip{background:#1a1a2e;border:1px solid #333;border-radius:8px;padding:12px 20px}
    .chip-label{font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#888;margin-bottom:4px}
    .chip-value{font-size:16px;font-weight:700;color:#00d4ff}
    table{color:#ccc}
    tr:nth-child(even){background:#12122a}
    td{padding:6px 12px;border-bottom:1px solid #222;vertical-align:top;word-break:break-all}
    code{background:#222;padding:1px 4px;border-radius:3px;font-size:11px}
    a{color:#00d4ff}
  </style>
</head>
<body>
  <div class="container">
    <h1>WebGenome Crawl Report</h1>
    <p class="subtitle">${esc(crawl.crawlId)} · ${esc(crawl.siteUrl)} · ${new Date(crawl.createdAt).toISOString()}</p>
    <div class="summary">
      <div class="chip"><div class="chip-label">Pages</div><div class="chip-value">${pages.length}</div></div>
      <div class="chip"><div class="chip-label">Elements</div><div class="chip-value">${payload.elementsTotal}</div></div>
      <div class="chip"><div class="chip-label">Status</div><div class="chip-value">${esc(crawl.status)}</div></div>
      ${crawl.blockedAtUrl ? `<div class="chip"><div class="chip-label">Blocked At</div><div class="chip-value" style="color:#ff4d6a;font-size:12px">${esc(crawl.blockedAtUrl)}</div></div>` : ""}
    </div>
    ${pagesHtml}
    <p style="text-align:center;color:#444;font-size:11px;margin-top:40px">Generated by WebGenome · webgenome.vercel.app</p>
  </div>
</body>
</html>`;

    res.setHeader("Content-Type", "text/html");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="webgenome-${crawl.crawlId}.html"`,
    );
    return res.send(html);
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
