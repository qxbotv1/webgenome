import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const EMAIL_SET_KEY = "waitlist:emails";
const SIGNUP_LOG_KEY = "waitlist:log";

const redis = Redis.fromEnv();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email =
      typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!email || !email.includes("@") || !email.includes(".")) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 },
      );
    }

    const exists = await redis.sismember(EMAIL_SET_KEY, email);

    if (exists) {
      return NextResponse.json({ message: "Already on the waitlist!" });
    }

    await redis.sadd(EMAIL_SET_KEY, email);
    await redis.lpush(
      SIGNUP_LOG_KEY,
      JSON.stringify({ email, ts: Date.now() }),
    );

    return NextResponse.json({ success: true, message: "You're on the list!" });
  } catch (err) {
    console.error("[waitlist] POST error:", err);
    return NextResponse.json(
      { error: "Service temporarily unavailable." },
      { status: 503 },
    );
  }
}

export async function GET() {
  try {
    const count = await redis.scard(EMAIL_SET_KEY);

    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
