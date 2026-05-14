# WebGenome Crawler

G2 crawler service for Railway. It exposes an Express API, queues crawl jobs with BullMQ, runs a persistent Playwright worker, and stores crawl metadata through a `CrawlStorageAdapter`.

## Local

```bash
cd apps/crawler
npm install
npm run build
npm run dev
```

Required for a real crawl:

- `REDIS_URL`: Redis protocol URL for BullMQ and default crawl storage.

Optional:

- `MONGODB_URI`: switches crawl record/page persistence from Redis to MongoDB.
- `R2_*`: enables screenshot upload to Cloudflare R2.

## Railway

Set the Railway service root to `apps/crawler`, use the included `Dockerfile`, and add the environment variables from `.env.example`.
