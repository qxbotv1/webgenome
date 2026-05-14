import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export const runtime = "nodejs";

const CRAWLER_API_URL = process.env.CRAWLER_API_URL || "http://localhost:4000";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(req: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const format = req.nextUrl.searchParams.get("format") || "json";

  try {
    const { userId } = await auth();

    // Verify ownership first
    const verifyRes = await fetch(`${CRAWLER_API_URL}/crawl/${id}`);
    if (verifyRes.ok) {
      const crawlData = await verifyRes.json();
      if (crawlData.userId && crawlData.userId !== userId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    const res = await fetch(`${CRAWLER_API_URL}/crawl/${id}/export?format=${format}`);

    if (format === "csv") {
      return new NextResponse(await res.text(), {
        status: res.status,
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="webgenome-${id}.csv"`,
        },
      });
    }
    
    if (format === "html") {
      return new NextResponse(await res.text(), {
        status: res.status,
        headers: {
          "Content-Type": "text/html",
          "Content-Disposition": `attachment; filename="webgenome-${id}.html"`,
        },
      });
    }

    return NextResponse.json(await res.json(), { status: res.status });
  } catch (err) {
    console.error("[crawl] export proxy error:", err);
    return NextResponse.json(
      { error: "Crawler service unavailable." },
      { status: 503 },
    );
  }
}
