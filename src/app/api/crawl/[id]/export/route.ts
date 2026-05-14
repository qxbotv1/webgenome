import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const CRAWLER_API_URL = process.env.CRAWLER_API_URL || "http://localhost:4000";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(req: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const format = req.nextUrl.searchParams.get("format") || "json";

  try {
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

    return NextResponse.json(await res.json(), { status: res.status });
  } catch (err) {
    console.error("[crawl] export proxy error:", err);
    return NextResponse.json(
      { error: "Crawler service unavailable." },
      { status: 503 },
    );
  }
}
