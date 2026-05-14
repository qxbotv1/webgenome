import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export const runtime = "nodejs";

const CRAWLER_API_URL = process.env.CRAWLER_API_URL || "http://localhost:4000";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(req: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  try {
    const { userId } = await auth();

    // Verify ownership first
    const verifyRes = await fetch(`${CRAWLER_API_URL}/crawl/${id}`);
    if (verifyRes.ok) {
      const crawlData = await verifyRes.json();
      if (crawlData.userId && crawlData.userId !== userId) {
        return NextResponse.json({ error: "Forbidden: only the crawl owner can unlock it." }, { status: 403 });
      }
    }

    const body = await req.json();
    const res = await fetch(`${CRAWLER_API_URL}/crawl/${id}/unlock`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return NextResponse.json(await res.json(), { status: res.status });
  } catch (err) {
    console.error("[crawl] unlock proxy error:", err);
    return NextResponse.json(
      { error: "Crawler service unavailable." },
      { status: 503 },
    );
  }
}
