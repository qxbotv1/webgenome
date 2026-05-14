import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export const runtime = "nodejs";

const CRAWLER_API_URL = process.env.CRAWLER_API_URL || "http://localhost:4000";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_req: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  try {
    const { userId } = await auth();

    const res = await fetch(`${CRAWLER_API_URL}/crawl/${id}`);
    if (!res.ok) {
      return NextResponse.json(await res.json(), { status: res.status });
    }

    const data = await res.json();

    // Ownership check: if the crawl belongs to a user, only that user can view it.
    // Legacy public crawls (no userId) remain visible to anyone (or we could hide them).
    // Let's protect user-linked crawls:
    if (data.userId && data.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("[crawl] GET proxy error:", err);
    return NextResponse.json(
      { error: "Crawler service unavailable." },
      { status: 503 },
    );
  }
}
