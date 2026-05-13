import { kv } from "@vercel/kv";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const EMAIL_SET_KEY = "waitlist:emails";
const SIGNUP_LOG_KEY = "waitlist:log";

function hasKvConfig() {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

function normalizeEmail(email: unknown) {
  return typeof email === "string" ? email.toLowerCase().trim() : "";
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  if (!hasKvConfig()) {
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

    const exists = await kv.sismember(EMAIL_SET_KEY, normalizedEmail);

    if (exists) {
      return NextResponse.json(
        { message: "Already on the waitlist!" },
        { status: 200 },
      );
    }

    await kv.sadd(EMAIL_SET_KEY, normalizedEmail);
    await kv.lpush(
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
  if (!hasKvConfig()) {
    return NextResponse.json(
      { error: "Waitlist storage is not configured." },
      { status: 503 },
    );
  }

  try {
    const count = await kv.scard(EMAIL_SET_KEY);

    return NextResponse.json({ count });
  } catch (err) {
    console.error("Waitlist count error:", err);
    return NextResponse.json(
      { error: "Server error. Please try again." },
      { status: 500 },
    );
  }
}
