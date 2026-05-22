import sodium from "libsodium-wrappers";
import { GRAPH_BASE } from "./instagram.js";

const GITHUB_API = "https://api.github.com";
const SECRET_NAME = "IG_ACCESS_TOKEN";

async function main() {
  const appId = required("META_APP_ID");
  const appSecret = required("META_APP_SECRET");
  const currentToken = required("IG_ACCESS_TOKEN");
  const ghToken = required("GH_TOKEN");
  const repo = required("GITHUB_REPOSITORY");

  console.log("→ Refreshing long-lived token...");
  const refreshed = await refreshToken(currentToken, appId, appSecret);
  const expiresInDays = Math.round((refreshed.expires_in ?? 0) / 86400);
  console.log(`  ok (expires in ~${expiresInDays} days)`);

  console.log(`→ Fetching public key for ${repo}...`);
  const { key_id, key } = await getPublicKey(repo, ghToken);

  console.log(`→ Encrypting and uploading ${SECRET_NAME}...`);
  await updateSecret(repo, ghToken, SECRET_NAME, refreshed.access_token, key_id, key);
  console.log("  ok");

  console.log("Token rotated.");
}

async function refreshToken(current, appId, appSecret) {
  const url = new URL(GRAPH_BASE + "/oauth/access_token");
  url.searchParams.set("grant_type", "fb_exchange_token");
  url.searchParams.set("client_id", appId);
  url.searchParams.set("client_secret", appSecret);
  url.searchParams.set("fb_exchange_token", current);
  const res = await fetch(url);
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.error || !data.access_token) {
    throw new Error(`Token refresh failed: ${data.error?.message || res.status}`);
  }
  return data;
}

async function getPublicKey(repo, ghToken) {
  const res = await fetch(
    `${GITHUB_API}/repos/${repo}/actions/secrets/public-key`,
    { headers: ghHeaders(ghToken) },
  );
  if (!res.ok) {
    throw new Error(
      `Fetch public key failed: ${res.status} ${await res.text()}`,
    );
  }
  return res.json();
}

async function updateSecret(repo, ghToken, name, value, keyId, publicKeyB64) {
  await sodium.ready;
  const messageBytes = sodium.from_string(value);
  const keyBytes = sodium.from_base64(publicKeyB64, sodium.base64_variants.ORIGINAL);
  const encrypted = sodium.crypto_box_seal(messageBytes, keyBytes);
  const encryptedB64 = sodium.to_base64(encrypted, sodium.base64_variants.ORIGINAL);

  const res = await fetch(
    `${GITHUB_API}/repos/${repo}/actions/secrets/${name}`,
    {
      method: "PUT",
      headers: { ...ghHeaders(ghToken), "Content-Type": "application/json" },
      body: JSON.stringify({ encrypted_value: encryptedB64, key_id: keyId }),
    },
  );
  if (res.status !== 201 && res.status !== 204) {
    throw new Error(`Secret update failed: ${res.status} ${await res.text()}`);
  }
}

function ghHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "sitewisers-ig",
  };
}

function required(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});
