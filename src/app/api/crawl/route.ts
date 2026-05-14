import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { Redis } from "@upstash/redis";

export const runtime = "nodejs";

const CRAWLER_API_URL = process.env.CRAWLER_API_URL || "http://localhost:4000";

// Optional: only enforce quotas if Redis is configured
const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // 1. Enforce max pages per crawl (5 pages limit)
    if (body.maxPages && body.maxPages > 5) {
      return NextResponse.json(
        { error: "Free tier is limited to 5 pages per crawl." },
        { status: 403 },
      );
    }

    // 2. Enforce daily crawl quota & concurrent active crawls via Redis
    if (redis) {
      const today = new Date().toISOString().split("T")[0];
      const dailyKey = `quota:crawls:${userId}:${today}`;
      const activeKey = `active:crawls:${userId}`;

      const [dailyCrawls, activeCrawls] = await Promise.all([
        redis.get<number>(dailyKey),
        redis.get<number>(activeKey),
      ]);

      if ((dailyCrawls || 0) >= 10) {
        return NextResponse.json(
          { error: "Daily crawl limit reached (10/day)." },
          { status: 429 },
        );
      }

      if ((activeCrawls || 0) >= 1) {
        return NextResponse.json(
          { error: "Only 1 active crawl allowed at a time." },
          { status: 429 },
        );
      }

      // Increment counters
      await redis.incr(dailyKey);
      await redis.expire(dailyKey, 60 * 60 * 24); // 24h
      
      // Increment active counter (will be decremented by crawler worker on completion, or we set a TTL fallback)
      await redis.incr(activeKey);
      await redis.expire(activeKey, 60 * 15); // Fallback TTL 15 mins
    }

    const res = await fetch(`${CRAWLER_API_URL}/crawl`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, userId }),
    });

    return NextResponse.json(await res.json(), { status: res.status });
  } catch (err) {
    console.error("[crawl] POST proxy error:", err);
    return NextResponse.json(
      { error: "Crawler service unavailable." },
      { status: 503 },
    );
  }
}
