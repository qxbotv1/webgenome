import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const CRAWLER_API_URL = process.env.CRAWLER_API_URL || "http://localhost:4000";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_req: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  try {
    const res = await fetch(`${CRAWLER_API_URL}/crawl/${id}`);
    return NextResponse.json(await res.json(), { status: res.status });
  } catch (err) {
    console.error("[crawl] GET proxy error:", err);
    return NextResponse.json(
      { error: "Crawler service unavailable." },
      { status: 503 },
    );
  }
}
