import { Queue } from "bullmq";
import IORedis from "ioredis";
import { CrawlJob } from "./types";

function createRedisConnection() {
  const url = process.env.REDIS_URL || process.env.KV_URL;

  if (url) {
    return new IORedis(url, {
      maxRetriesPerRequest: null,
      tls: url.startsWith("rediss://") ? {} : undefined,
    });
  }

  return new IORedis({
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT || 6379),
    password: process.env.REDIS_PASSWORD,
    tls: process.env.REDIS_TLS === "true" ? {} : undefined,
    maxRetriesPerRequest: null,
  });
}

export const redisConnection = createRedisConnection();

export const crawlQueue = new Queue<CrawlJob>("crawl", {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 2,
    backoff: { type: "exponential", delay: 5000 },
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 50 },
  },
});

export async function enqueueCrawl(job: CrawlJob): Promise<string> {
  const bullJob = await crawlQueue.add("crawl", job, { jobId: job.crawlId });
  return bullJob.id ?? job.crawlId;
}
