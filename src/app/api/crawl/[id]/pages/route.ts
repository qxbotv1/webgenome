import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const CRAWLER_API_URL = process.env.CRAWLER_API_URL || "http://localhost:4000";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(req: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const search = req.nextUrl.searchParams.toString();
  const suffix = search ? `?${search}` : "";

  try {
    const res = await fetch(`${CRAWLER_API_URL}/crawl/${id}/pages${suffix}`);
    return NextResponse.json(await res.json(), { status: res.status });
  } catch (err) {
    console.error("[crawl] pages proxy error:", err);
    return NextResponse.json(
      { error: "Crawler service unavailable." },
      { status: 503 },
    );
  }
}
