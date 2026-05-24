import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { TOPIC_BANK } from "./topic-bank.js";
import { renderImage } from "./render-image.js";

const TOPIC_BANK_PATH = path.resolve("content/topic-bank.json");
const DRAFTS_PATH = path.resolve("content/drafts.json");
const QUEUE_PATH = path.resolve("content/queue.json");

const COOLDOWN_DAYS = 14;
const SLOTS = ["09:00", "18:00"];
const RECENT_CATEGORY_BLOCK = 3;
const RECENT_NICHE_BLOCK = 5;
const BODY_CHAR_LIMIT = 200;
const MAX_REWRITES = 2;
const ANTHROPIC_MAX_ATTEMPTS = 3;

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-5";

const BRAND_VOICE_SYSTEM = `You are writing Instagram captions for Sitewisers, a UK web design agency for service businesses (med spas, dentists, physios, personal trainers, builders, nail salons, barbers, beauticians, cleaners, accountants, electricians).

VOICE
- Direct. No fluff, no preamble, no warm-up sentences.
- Punchy. Challenger brand. Confident, never corporate.
- UK English spelling throughout: optimise, colour, organisation, behaviour, prioritise, recognise, analyse.
- Mobile-first formatting: short lines. Line breaks between thoughts.
- The first line is the hook. It must stop the scroll on its own.
- NEVER use em-dashes (—). Use a full stop, comma, or line break instead. This is a hard rule.
- Do not use the words: transform, elevate, leverage, unlock, synergy, game-changer, revolutionise, empower.
- Never open with "In today's digital landscape" or any equivalent throat-clearing.
- Do not write like LinkedIn.

LENGTH (strictly enforced. Over-length captions are rejected and you'll be asked to rewrite.)
- HARD MAXIMUM 200 characters for the caption body before the hashtag block. Count characters, not words.
- Target window: 100 to 180 characters. Tighter wins.
- Prefer fewer lines of punchier copy over more lines of softer copy.
- Cut adjectives. Cut throat-clearing. Cut anything that does not earn its place.
- The hook line alone often justifies 60-80 of those 200 characters. Budget the rest accordingly.
- Exactly 10 hashtags on a single line at the end, space-separated.
- Mix niche, UK location, and category hashtags. Keep them readable, not clogged.

BRAND FACTS (only mention if directly relevant to the angle)
- Starter package: £1,200. Growth: £2,000 plus £400 per month.
- Five demo sites scoring 100/100 Lighthouse mobile: Thorne Dental, Linden Aesthetics, Kestrel Physio, Forge PT, Marne & Lyle.
- Two retrofit case studies: Amber Oak, Ridgeline.

OUTPUT FORMAT
- Caption body first.
- One blank line.
- Hashtag line (10 hashtags, space-separated).
- Nothing else. No preamble such as "Here's the caption". No quotation marks wrapping the whole thing.`;

async function main() {
  const count = parseCount(process.argv[2]);
  requireEnv("ANTHROPIC_API_KEY");

  const bank = await loadTopicBank();
  const drafts = await loadJson(DRAFTS_PATH, { posts: [] });
  const queue = await loadJson(QUEUE_PATH, { posts: [] });

  const slots = findNextSlots(count, drafts, queue);
  const recentCategories = [];
  const recentNiches = [];
  let succeeded = 0;

  for (let i = 0; i < count; i++) {
    const angle = pickAngle(bank, recentCategories, recentNiches);
    if (!angle) {
      console.error("No angle available. Topic bank is empty.");
      break;
    }
    const slot = slots[i];
    console.log(
      `\n[${i + 1}/${count}] angle=${angle.id} (${angle.category}/${angle.niche}) → ${slot.date} ${slot.slot}`,
    );
    try {
      await generateOne(angle, slot, drafts);
      recentCategories.push(angle.category);
      recentNiches.push(angle.niche);
      succeeded++;
    } catch (err) {
      console.error(`  FAILED: ${err.message}`);
      continue;
    }
    await saveTopicBank(bank);
    await writeJson(DRAFTS_PATH, drafts);
  }

  console.log(`\nDone. ${succeeded}/${count} drafts generated. Run \`npm run review\` to approve.`);
}

function parseCount(arg) {
  const n = arg === undefined ? 1 : parseInt(arg, 10);
  if (!Number.isInteger(n) || n < 1) {
    console.error("Usage: node src/generate-post.js [count]");
    process.exit(1);
  }
  return n;
}

function requireEnv(name) {
  if (!process.env[name]) {
    console.error(`Missing env var: ${name}`);
    process.exit(1);
  }
}

async function loadTopicBank() {
  await mkdir(path.dirname(TOPIC_BANK_PATH), { recursive: true });
  if (!existsSync(TOPIC_BANK_PATH)) {
    const seeded = TOPIC_BANK.map((a) => ({ ...a, used_count: 0, last_used: null }));
    await writeFile(TOPIC_BANK_PATH, JSON.stringify(seeded, null, 2) + "\n");
    return seeded;
  }
  const existing = JSON.parse(await readFile(TOPIC_BANK_PATH, "utf8"));
  const byId = new Map(existing.map((a) => [a.id, a]));
  for (const angle of TOPIC_BANK) {
    if (!byId.has(angle.id)) {
      byId.set(angle.id, { ...angle, used_count: 0, last_used: null });
    } else {
      const existing = byId.get(angle.id);
      byId.set(angle.id, {
        ...angle,
        used_count: existing.used_count ?? 0,
        last_used: existing.last_used ?? null,
      });
    }
  }
  return [...byId.values()];
}

async function saveTopicBank(bank) {
  await writeFile(TOPIC_BANK_PATH, JSON.stringify(bank, null, 2) + "\n");
}

async function loadJson(p, fallback) {
  if (!existsSync(p)) return fallback;
  return JSON.parse(await readFile(p, "utf8"));
}

async function writeJson(p, data) {
  await mkdir(path.dirname(p), { recursive: true });
  await writeFile(p, JSON.stringify(data, null, 2) + "\n");
}

function pickAngle(bank, recentCategories = [], recentNiches = []) {
  if (bank.length === 0) return null;
  const now = Date.now();
  const cooldownMs = COOLDOWN_DAYS * 86_400_000;

  const blockedCats = new Set(recentCategories.slice(-RECENT_CATEGORY_BLOCK));
  // "all" is a wildcard niche. Never add it to the block set, otherwise picking
  // one pain post would lock out every other "all"-niche angle.
  const blockedNiches = new Set(
    recentNiches.slice(-RECENT_NICHE_BLOCK).filter((n) => n && n !== "all"),
  );

  const cooledDown = bank.filter(
    (a) => a.last_used === null || now - new Date(a.last_used).getTime() > cooldownMs,
  );

  // Best: respect cooldown + category block + niche block.
  const ideal = cooledDown.filter(
    (a) => !blockedCats.has(a.category) && !blockedNiches.has(a.niche),
  );
  if (ideal.length > 0) return sortAngles(ideal)[0];

  // Relax niche block, keep category block.
  const catOnly = cooledDown.filter((a) => !blockedCats.has(a.category));
  if (catOnly.length > 0) return sortAngles(catOnly)[0];

  // Relax both rotation blocks, keep cooldown.
  if (cooledDown.length > 0) return sortAngles(cooledDown)[0];

  // Last resort: anything, so we always return something.
  return sortAngles(bank)[0];
}

function sortAngles(pool) {
  return [...pool].sort((a, b) => {
    if (a.used_count !== b.used_count) return a.used_count - b.used_count;
    const aLast = a.last_used ? new Date(a.last_used).getTime() : 0;
    const bLast = b.last_used ? new Date(b.last_used).getTime() : 0;
    return aLast - bLast;
  });
}

function findNextSlots(count, drafts, queue) {
  const used = new Set();
  for (const p of [...drafts.posts, ...queue.posts]) {
    if (p.scheduled_for) {
      used.add(`${p.scheduled_for}|${p.slot ?? "09:00"}`);
    }
  }

  const out = [];
  const cursor = new Date();
  cursor.setUTCDate(cursor.getUTCDate() + 1);
  cursor.setUTCHours(0, 0, 0, 0);

  let safety = 0;
  while (out.length < count && safety < 365) {
    const dateStr = cursor.toISOString().slice(0, 10);
    for (const slot of SLOTS) {
      const key = `${dateStr}|${slot}`;
      if (!used.has(key)) {
        out.push({ date: dateStr, slot });
        used.add(key);
        if (out.length >= count) break;
      }
    }
    cursor.setUTCDate(cursor.getUTCDate() + 1);
    safety++;
  }
  return out;
}

async function generateOne(angle, slot, drafts) {
  console.log("  → caption (Anthropic)...");
  const caption = await generateCaption(angle);
  console.log(`  → image (template: ${angle.template})...`);

  const id = randomUUID();
  const absOutput = path.resolve("content/images", `${id}.png`);
  await renderImage({ template: angle.template, data: angle.data, outputPath: absOutput });
  const mediaPath = `images/${id}.png`;

  drafts.posts.push({
    id,
    type: "image",
    media: [mediaPath],
    caption,
    scheduled_for: slot.date,
    slot: slot.slot,
    status: "draft",
    posted_at: null,
    ig_media_id: null,
    error: null,
    angle_id: angle.id,
    template: angle.template,
  });

  angle.used_count = (angle.used_count ?? 0) + 1;
  angle.last_used = new Date().toISOString();
}

async function generateCaption(angle) {
  const dataLine =
    angle.data && Object.keys(angle.data).length > 0
      ? `\n\nThe accompanying image (template: ${angle.template}) shows these exact values: ${JSON.stringify(angle.data)}.\n` +
        "Your caption MUST reference the same numbers, percentages, currency amounts, and proper nouns that appear in the image. " +
        "Do not invent different statistics or substitute synonyms for named businesses (Thorne Dental, Linden Aesthetics, Kestrel Physio, Forge PT, Marne & Lyle, Amber Oak, Ridgeline). " +
        "If the image shows 63%, the caption must say 63% (not 40% or 'over half')."
      : "";

  const userPrompt =
    `${angle.hook_template}\n\n` +
    "Generate the full Instagram caption with hashtags. " +
    "Follow the voice and length rules exactly. UK English. No em-dashes. " +
    `Body must be under ${BODY_CHAR_LIMIT} characters before the hashtag line.` +
    dataLine;

  const messages = [{ role: "user", content: userPrompt }];
  let text = await callAnthropic(messages);

  for (let attempt = 0; attempt < MAX_REWRITES; attempt++) {
    const bodyLen = extractBody(text).length;
    if (bodyLen <= BODY_CHAR_LIMIT) return text;
    console.log(`     body ${bodyLen} chars > ${BODY_CHAR_LIMIT}, requesting rewrite...`);
    messages.push({ role: "assistant", content: text });
    messages.push({
      role: "user",
      content:
        `The body is ${bodyLen} characters. Shorten it to under ${BODY_CHAR_LIMIT} characters. ` +
        "Keep the hook intact. Keep the punch. Keep the same 10 hashtags on a single line. " +
        "Output only the rewritten caption.",
    });
    text = await callAnthropic(messages);
  }

  const finalLen = extractBody(text).length;
  if (finalLen > BODY_CHAR_LIMIT) {
    console.log(`     WARN: body still ${finalLen} chars after ${MAX_REWRITES} rewrites; accepting.`);
  }
  return text;
}

async function callAnthropic(messages) {
  let lastErr;
  for (let attempt = 1; attempt <= ANTHROPIC_MAX_ATTEMPTS; attempt++) {
    try {
      const res = await fetch(ANTHROPIC_URL, {
        method: "POST",
        headers: {
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: 1024,
          system: BRAND_VOICE_SYSTEM,
          messages,
        }),
      });

      if (!res.ok) {
        const err = new Error(`Anthropic ${res.status}: ${await res.text()}`);
        err.status = res.status;
        throw err;
      }
      const data = await res.json();
      const text = data.content?.[0]?.text?.trim();
      if (!text) throw new Error("Anthropic returned empty content");
      return text;
    } catch (err) {
      lastErr = err;
      // Don't retry on terminal 4xx (auth, bad request, etc). Only 429 is worth retrying.
      const terminal = err.status && err.status >= 400 && err.status < 500 && err.status !== 429;
      if (terminal || attempt >= ANTHROPIC_MAX_ATTEMPTS) throw err;
      const delayMs = 1000 * 2 ** (attempt - 1); // 1s, 2s, 4s
      console.log(`     anthropic retry ${attempt}/${ANTHROPIC_MAX_ATTEMPTS - 1} in ${delayMs}ms: ${String(err.message).slice(0, 120)}`);
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  throw lastErr;
}

function extractBody(text) {
  const lines = text.split("\n");
  let hashtagIdx = -1;
  for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].trim().startsWith("#")) {
      hashtagIdx = i;
      break;
    }
  }
  if (hashtagIdx === -1) return text.trim();
  return lines.slice(0, hashtagIdx).join("\n").trim();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
