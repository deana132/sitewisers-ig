import { readFile, writeFile } from "node:fs/promises";
import { GRAPH_BASE } from "./instagram.js";

async function main() {
  const shortLived = process.argv[2];
  if (!shortLived || shortLived.startsWith("-")) {
    console.error("Usage: node src/setup-token.js <short_lived_user_token>");
    console.error("");
    console.error("Generate a short-lived user token at:");
    console.error("  https://developers.facebook.com/tools/explorer/");
    console.error("with scopes: instagram_basic, instagram_content_publish,");
    console.error("             pages_show_list, pages_read_engagement");
    process.exit(1);
  }

  const appId = required("META_APP_ID");
  const appSecret = required("META_APP_SECRET");

  console.log("→ Exchanging for long-lived user token...");
  const longLived = await exchangeToken(shortLived, appId, appSecret);
  console.log(`  ok (expires in ~${Math.round((longLived.expires_in ?? 0) / 86400)} days)`);

  console.log("→ Fetching Pages...");
  const pages = await getPages(longLived.access_token);
  if (pages.length === 0) {
    fail("This user has no Pages. Link an Instagram Business account to a Page first.");
  }
  console.log(`  found ${pages.length} page(s)`);

  console.log("→ Resolving Instagram Business accounts...");
  const candidates = [];
  for (const page of pages) {
    const igId = await getIgAccount(page.id, page.access_token);
    if (igId) candidates.push({ pageName: page.name, pageId: page.id, igId });
  }

  if (candidates.length === 0) {
    fail("No Pages have a linked Instagram Business/Creator account.");
  }

  console.log("");
  console.log("Discovered Instagram Business accounts:");
  for (const c of candidates) {
    console.log(`  ${c.igId}  ←  Page "${c.pageName}" (${c.pageId})`);
  }

  const picked = candidates[0];
  if (candidates.length > 1) {
    console.log("");
    console.log(`Multiple matches — defaulting to first (${picked.igId}).`);
    console.log("Edit .env to override IG_BUSINESS_ACCOUNT_ID.");
  }

  await writeEnv({
    IG_ACCESS_TOKEN: longLived.access_token,
    IG_BUSINESS_ACCOUNT_ID: picked.igId,
  });

  console.log("");
  console.log("Wrote .env:");
  console.log(`  IG_BUSINESS_ACCOUNT_ID=${picked.igId}`);
  console.log(`  IG_ACCESS_TOKEN=<long-lived, ~60 day expiry — refresh weekly>`);
  console.log("");
  console.log("Next: add IG_ACCESS_TOKEN and IG_BUSINESS_ACCOUNT_ID as GitHub repo secrets.");
}

async function exchangeToken(shortLived, appId, appSecret) {
  const url = new URL(GRAPH_BASE + "/oauth/access_token");
  url.searchParams.set("grant_type", "fb_exchange_token");
  url.searchParams.set("client_id", appId);
  url.searchParams.set("client_secret", appSecret);
  url.searchParams.set("fb_exchange_token", shortLived);
  const data = await fetchJson(url);
  if (!data.access_token) throw new Error("No access_token in exchange response");
  return data;
}

async function getPages(userToken) {
  const url = new URL(GRAPH_BASE + "/me/accounts");
  url.searchParams.set("access_token", userToken);
  url.searchParams.set("fields", "id,name,access_token");
  const data = await fetchJson(url);
  return data.data ?? [];
}

async function getIgAccount(pageId, pageToken) {
  const url = new URL(GRAPH_BASE + `/${pageId}`);
  url.searchParams.set("fields", "instagram_business_account");
  url.searchParams.set("access_token", pageToken);
  const data = await fetchJson(url);
  return data.instagram_business_account?.id ?? null;
}

async function fetchJson(url) {
  const res = await fetch(url);
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`Non-JSON response (${res.status}): ${text.slice(0, 200)}`);
  }
  if (!res.ok || json.error) {
    throw new Error(`Graph API error: ${json.error?.message || res.status}`);
  }
  return json;
}

async function writeEnv(updates) {
  const existing = {};
  let order = [];
  try {
    const raw = await readFile(".env", "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
      if (m) {
        existing[m[1]] = m[2];
        order.push(m[1]);
      }
    }
  } catch (e) {
    if (e.code !== "ENOENT") throw e;
  }
  for (const k of Object.keys(updates)) {
    if (!order.includes(k)) order.push(k);
    existing[k] = updates[k];
  }
  const out = order.map((k) => `${k}=${existing[k]}`).join("\n") + "\n";
  await writeFile(".env", out, "utf8");
}

function required(name) {
  const v = process.env[name];
  if (!v) {
    fail(`Missing env var ${name}. Put it in .env and re-run with --env-file=.env.`);
  }
  return v;
}

function fail(msg) {
  console.error("ERROR: " + msg);
  process.exit(1);
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});
