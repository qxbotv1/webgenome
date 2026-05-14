import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Db } from "mongodb";
import IORedis from "ioredis";
import { getMongoDb, hasMongoConfig } from "./db";
import { redisConnection } from "./queue";
import { CrawlExport, CrawlRecord, CrawledPage } from "./types";

export interface CrawlStorageAdapter {
  name: "redis" | "mongo";
  createCrawl(record: CrawlRecord): Promise<void>;
  updateCrawl(crawlId: string, patch: Partial<CrawlRecord>): Promise<void>;
  getCrawl(crawlId: string): Promise<CrawlRecord | null>;
  addPage(page: CrawledPage): Promise<void>;
  getPages(crawlId: string, options?: { skip?: number; limit?: number }): Promise<CrawledPage[]>;
  getExport(crawlId: string): Promise<CrawlExport | null>;
}

export interface ScreenshotStorageAdapter {
  uploadScreenshot(crawlId: string, pageSlug: string, buffer: Buffer): Promise<string | null>;
}

function crawlKey(crawlId: string): string {
  return `webgenome:crawl:${crawlId}`;
}

function pagesKey(crawlId: string): string {
  return `webgenome:crawl:${crawlId}:pages`;
}

function stripUndefined<T extends Record<string, unknown>>(value: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(value).filter(([, item]) => item !== undefined),
  ) as Partial<T>;
}

class RedisCrawlStorageAdapter implements CrawlStorageAdapter {
  name = "redis" as const;

  constructor(private readonly redis: IORedis) {}

  async createCrawl(record: CrawlRecord): Promise<void> {
    await this.redis
      .multi()
      .set(crawlKey(record.crawlId), JSON.stringify(record))
      .del(pagesKey(record.crawlId))
      .exec();
  }

  async updateCrawl(crawlId: string, patch: Partial<CrawlRecord>): Promise<void> {
    const existing = await this.getCrawl(crawlId);
    if (!existing) return;

    await this.redis.set(
      crawlKey(crawlId),
      JSON.stringify({ ...existing, ...stripUndefined(patch as Record<string, unknown>) }),
    );
  }

  async getCrawl(crawlId: string): Promise<CrawlRecord | null> {
    const payload = await this.redis.get(crawlKey(crawlId));
    return payload ? (JSON.parse(payload) as CrawlRecord) : null;
  }

  async addPage(page: CrawledPage): Promise<void> {
    await this.redis.rpush(pagesKey(page.crawlId), JSON.stringify(page));
  }

  async getPages(
    crawlId: string,
    options: { skip?: number; limit?: number } = {},
  ): Promise<CrawledPage[]> {
    const skip = options.skip ?? 0;
    const limit = options.limit ?? 20;
    const end = limit > 0 ? skip + limit - 1 : -1;
    const payloads = await this.redis.lrange(pagesKey(crawlId), skip, end);

    return payloads.map((payload) => JSON.parse(payload) as CrawledPage);
  }

  async getExport(crawlId: string): Promise<CrawlExport | null> {
    const crawl = await this.getCrawl(crawlId);
    if (!crawl) return null;

    const pages = await this.getPages(crawlId, { skip: 0, limit: 0 });
    return {
      crawl,
      pages,
      elementsTotal: pages.reduce((total, page) => total + page.elements.length, 0),
    };
  }
}

class MongoCrawlStorageAdapter implements CrawlStorageAdapter {
  name = "mongo" as const;

  constructor(private readonly db: Db) {}

  async createCrawl(record: CrawlRecord): Promise<void> {
    await this.db.collection<CrawlRecord>("crawls").insertOne(record);
    await this.db.collection<CrawledPage>("pages").deleteMany({ crawlId: record.crawlId });
  }

  async updateCrawl(crawlId: string, patch: Partial<CrawlRecord>): Promise<void> {
    await this.db.collection<CrawlRecord>("crawls").updateOne(
      { crawlId },
      { $set: stripUndefined(patch as Record<string, unknown>) },
    );
  }

  async getCrawl(crawlId: string): Promise<CrawlRecord | null> {
    return this.db.collection<CrawlRecord>("crawls").findOne(
      { crawlId },
      { projection: { _id: 0 } },
    );
  }

  async addPage(page: CrawledPage): Promise<void> {
    await this.db.collection<CrawledPage>("pages").insertOne(page);
  }

  async getPages(
    crawlId: string,
    options: { skip?: number; limit?: number } = {},
  ): Promise<CrawledPage[]> {
    return this.db
      .collection<CrawledPage>("pages")
      .find({ crawlId }, { projection: { _id: 0 } })
      .skip(options.skip ?? 0)
      .limit(options.limit ?? 20)
      .toArray();
  }

  async getExport(crawlId: string): Promise<CrawlExport | null> {
    const crawl = await this.getCrawl(crawlId);
    if (!crawl) return null;

    const pages = await this.getPages(crawlId, { skip: 0, limit: 0 });
    return {
      crawl,
      pages,
      elementsTotal: pages.reduce((total, page) => total + page.elements.length, 0),
    };
  }
}

class NoopScreenshotStorageAdapter implements ScreenshotStorageAdapter {
  async uploadScreenshot(): Promise<null> {
    return null;
  }
}

class R2ScreenshotStorageAdapter implements ScreenshotStorageAdapter {
  private readonly client = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID ?? "",
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? "",
    },
  });

  async uploadScreenshot(crawlId: string, pageSlug: string, buffer: Buffer): Promise<string | null> {
    try {
      const key = `screenshots/${crawlId}/${pageSlug}.png`;

      await this.client.send(
        new PutObjectCommand({
          Bucket: process.env.R2_BUCKET,
          Key: key,
          Body: buffer,
          ContentType: "image/png",
        }),
      );

      const publicUrl = process.env.R2_PUBLIC_URL?.replace(/\/$/, "");
      return publicUrl ? `${publicUrl}/${key}` : key;
    } catch (err) {
      console.error("[storage] R2 upload failed:", err);
      return null;
    }
  }
}

export async function createCrawlStorageAdapter(): Promise<CrawlStorageAdapter> {
  if (hasMongoConfig()) {
    return new MongoCrawlStorageAdapter(await getMongoDb());
  }

  return new RedisCrawlStorageAdapter(redisConnection);
}

export function createScreenshotStorageAdapter(): ScreenshotStorageAdapter {
  const hasR2Config = Boolean(
    process.env.R2_ACCOUNT_ID &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY &&
      process.env.R2_BUCKET,
  );

  return hasR2Config ? new R2ScreenshotStorageAdapter() : new NoopScreenshotStorageAdapter();
}
