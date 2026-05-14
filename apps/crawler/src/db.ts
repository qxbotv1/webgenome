import dns from "node:dns";
import { Db, MongoClient } from "mongodb";

// ── DNS Fix ──────────────────────────────────────────────────────────────────
// The system DNS (fe80::1) can't resolve MongoDB Atlas SRV records.
// Force Node to use Google Public DNS and prefer IPv4.
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

let client: MongoClient | null = null;
let db: Db | null = null;

export function hasMongoConfig(): boolean {
  return Boolean(process.env.MONGODB_URI);
}

export async function getMongoDb(): Promise<Db> {
  if (db) return db;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not configured.");
  }

  client = new MongoClient(uri);
  await client.connect();
  db = client.db(process.env.MONGODB_DB_NAME || "webgenome");

  await db.collection("crawls").createIndex({ crawlId: 1 }, { unique: true });
  await db.collection("pages").createIndex({ crawlId: 1 });
  await db.collection("pages").createIndex({ url: 1 });

  console.log("[db] Connected to MongoDB Atlas");
  return db;
}

export async function closeMongoDb(): Promise<void> {
  await client?.close();
  client = null;
  db = null;
}

