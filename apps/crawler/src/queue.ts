import IORedis from "ioredis";
import { Queue } from "bullmq";
import { CrawlJob } from "./types";

// Support both REDIS_URL (Railway/Upstash) and individual vars (local dev).
export const redisConnection = process.env.REDIS_URL
  ? new IORedis(process.env.REDIS_URL, {
      maxRetriesPerRequest: null,
      tls: process.env.REDIS_URL.startsWith("rediss://") ? {} : undefined,
    })
  : new IORedis({
    host: process.env.REDIS_HOST!,
    port: parseInt(process.env.REDIS_PORT || "6379"),
    password: process.env.REDIS_PASSWORD,
    tls: process.env.REDIS_TLS === "true" ? {} : undefined,
    maxRetriesPerRequest: null,
  });

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
  return bullJob.id!;
}
