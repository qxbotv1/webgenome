#!/usr/bin/env node

/**
 * WebGenome Health Check Script
 *
 * Pings the Railway crawler /health endpoint and measures latency.
 * Exits with code 1 on failure (downtime, timeout, or slow response).
 *
 * Usage:
 *   node scripts/check-health.mjs
 *   node scripts/check-health.mjs https://custom-url.up.railway.app
 *
 * Environment:
 *   HEALTH_URL       — Override the target URL
 *   LATENCY_WARN_MS  — Warn threshold (default: 2000)
 *   LATENCY_FAIL_MS  — Fail threshold (default: 5000)
 *   TIMEOUT_MS       — Request timeout (default: 10000)
 */

const TARGET =
  process.argv[2] ||
  process.env.HEALTH_URL ||
  "https://webgenome-crawler-production.up.railway.app/health";

const LATENCY_WARN = Number(process.env.LATENCY_WARN_MS || 2000);
const LATENCY_FAIL = Number(process.env.LATENCY_FAIL_MS || 5000);
const TIMEOUT = Number(process.env.TIMEOUT_MS || 10000);

async function check() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT);

  const start = performance.now();

  try {
    const res = await fetch(TARGET, { signal: controller.signal });
    const latency = Math.round(performance.now() - start);
    clearTimeout(timer);

    if (!res.ok) {
      console.error(`❌ FAIL — HTTP ${res.status} from ${TARGET}`);
      process.exit(1);
    }

    const body = await res.json();

    if (body.status !== "ok") {
      console.error(`❌ FAIL — health status: "${body.status}" (expected "ok")`);
      process.exit(1);
    }

    if (latency > LATENCY_FAIL) {
      console.error(`❌ FAIL — latency ${latency}ms exceeds ${LATENCY_FAIL}ms threshold`);
      process.exit(1);
    }

    if (latency > LATENCY_WARN) {
      console.warn(`⚠️  WARN — latency ${latency}ms exceeds ${LATENCY_WARN}ms warn threshold`);
    }

    console.log(`✅ OK — ${TARGET}`);
    console.log(`   status: ${body.status}`);
    console.log(`   storage: ${body.storage}`);
    console.log(`   latency: ${latency}ms`);
    console.log(`   timestamp: ${body.ts}`);

    process.exit(0);
  } catch (err) {
    clearTimeout(timer);

    if (err.name === "AbortError") {
      console.error(`❌ FAIL — timeout after ${TIMEOUT}ms for ${TARGET}`);
    } else {
      console.error(`❌ FAIL — ${err.message}`);
    }

    process.exit(1);
  }
}

check();
