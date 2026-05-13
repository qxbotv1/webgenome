import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const EMAIL_SET_KEY = "waitlist:emails";
const SIGNUP_LOG_KEY = "waitlist:log";

const redis = Redis.fromEnv();

function hasRedisConfig() {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN,
  );
}

function normalizeEmail(email: unknown) {
  return typeof email === "string" ? email.toLowerCase().trim() : "";
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  if (!hasRedisConfig()) {
    return NextResponse.json(
      { error: "Waitlist storage is not configured." },
      { status: 503 },
    );
  }

  try {
    const { email } = await req.json();
    const normalizedEmail = normalizeEmail(email);

    if (!isValidEmail(normalizedEmail)) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 },
      );
    }

    const exists = await redis.sismember(EMAIL_SET_KEY, normalizedEmail);

    if (exists) {
      return NextResponse.json(
        { message: "Already on the waitlist!" },
        { status: 200 },
      );
    }

    await redis.sadd(EMAIL_SET_KEY, normalizedEmail);
    await redis.lpush(
      SIGNUP_LOG_KEY,
      JSON.stringify({ email: normalizedEmail, ts: Date.now() }),
    );

    return NextResponse.json(
      { success: true, message: "You're on the list!" },
      { status: 200 },
    );
  } catch (err) {
    console.error("Waitlist API error:", err);
    return NextResponse.json(
      { error: "Server error. Please try again." },
      { status: 500 },
    );
  }
}

export async function GET() {
  if (!hasRedisConfig()) {
    return NextResponse.json(
      { error: "Waitlist storage is not configured." },
      { status: 503 },
    );
  }

  try {
    const count = await redis.scard(EMAIL_SET_KEY);

    return NextResponse.json({ count });
  } catch (err) {
    console.error("Waitlist count error:", err);
    return NextResponse.json(
      { error: "Server error. Please try again." },
      { status: 500 },
    );
  }
}
