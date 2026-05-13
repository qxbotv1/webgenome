import fs from "fs";
import path from "path";

import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const FILE_PATH = path.join(process.cwd(), "waitlist.json");

function readWaitlist(): string[] {
  try {
    if (!fs.existsSync(FILE_PATH)) return [];

    const data = fs.readFileSync(FILE_PATH, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeWaitlist(emails: string[]) {
  fs.writeFileSync(FILE_PATH, JSON.stringify(emails, null, 2));
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    const normalizedEmail =
      typeof email === "string" ? email.toLowerCase().trim() : "";

    if (!normalizedEmail || !normalizedEmail.includes("@")) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 },
      );
    }

    const emails = readWaitlist();

    if (emails.includes(normalizedEmail)) {
      return NextResponse.json(
        { error: "This email is already on the waitlist." },
        { status: 409 },
      );
    }

    emails.push(normalizedEmail);
    writeWaitlist(emails);

    console.log(
      `Waitlist signup: ${normalizedEmail} | Total: ${emails.length}`,
    );

    return NextResponse.json(
      { success: true, message: "Added to waitlist." },
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
  const emails = readWaitlist();

  return NextResponse.json({ count: emails.length, emails });
}
