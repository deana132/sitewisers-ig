import { access } from "node:fs/promises";
import path from "node:path";
import { loadQueue } from "./queue.js";

const MAX_CAPTION = 2200;
const HASHTAG_MIN = 8;
const HASHTAG_MAX = 12;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const VALID_TYPES = new Set(["image", "carousel", "reel"]);
const VALID_STATUSES = new Set(["pending", "posted", "failed"]);

// US -> UK spelling pairs. Word-boundary, case-insensitive match.
const US_UK_SPELLINGS = [
  ["optimize", "optimise"],
  ["optimizing", "optimising"],
  ["optimized", "optimised"],
  ["organize", "organise"],
  ["organizing", "organising"],
  ["organized", "organised"],
  ["recognize", "recognise"],
  ["recognized", "recognised"],
  ["analyze", "analyse"],
  ["analyzing", "analysing"],
  ["analyzed", "analysed"],
  ["customize", "customise"],
  ["customized", "customised"],
  ["finalize", "finalise"],
  ["finalized", "finalised"],
  ["realize", "realise"],
  ["realized", "realised"],
  ["specialize", "specialise"],
  ["specialized", "specialised"],
  ["prioritize", "prioritise"],
  ["prioritized", "prioritised"],
  ["color", "colour"],
  ["colors", "colours"],
  ["colored", "coloured"],
  ["center", "centre"],
  ["centered", "centred"],
  ["behavior", "behaviour"],
  ["behaviors", "behaviours"],
  ["favor", "favour"],
  ["favorite", "favourite"],
  ["honor", "honour"],
  ["labor", "labour"],
  ["harbor", "harbour"],
  ["defense", "defence"],
  ["offense", "offence"],
  ["catalog", "catalogue"],
  ["dialog", "dialogue"],
  ["gray", "grey"],
  ["aluminum", "aluminium"],
];

const BANNED_WORDS = ["synergy", "leverage", "ecosystem", "circle back", "innovative"];

async function main() {
  const queue = await loadQueue();
  const errors = [];
  const warnings = [];

  for (const [i, post] of queue.posts.entries()) {
    const ctx = `posts[${i}] (id=${post.id ?? "?"})`;

    if (!VALID_TYPES.has(post.type)) {
      errors.push(`${ctx}: type "${post.type}" not in {image, carousel, reel}`);
    }

    if (!VALID_STATUSES.has(post.status)) {
      errors.push(`${ctx}: status "${post.status}" not in {pending, posted, failed}`);
    }

    if (!DATE_RE.test(post.scheduled_for ?? "")) {
      errors.push(`${ctx}: scheduled_for "${post.scheduled_for}" must be YYYY-MM-DD`);
    } else {
      const parsed = new Date(post.scheduled_for + "T00:00:00Z");
      if (isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== post.scheduled_for) {
        errors.push(`${ctx}: scheduled_for "${post.scheduled_for}" is not a real date`);
      }
    }

    if (typeof post.caption !== "string") {
      errors.push(`${ctx}: caption must be a string`);
    } else {
      if (post.caption.length > MAX_CAPTION) {
        errors.push(`${ctx}: caption ${post.caption.length} chars exceeds ${MAX_CAPTION}`);
      }

      // Hard reject: em-dashes (brand rule, no exceptions).
      if (post.caption.includes("—")) {
        errors.push(`${ctx}: caption contains em-dash (U+2014). Use a full stop or comma instead.`);
      }

      // Hard reject: hashtag count outside [8, 12].
      const hashtags = post.caption.match(/#[\p{L}\p{N}_]+/gu) ?? [];
      if (hashtags.length < HASHTAG_MIN || hashtags.length > HASHTAG_MAX) {
        errors.push(
          `${ctx}: ${hashtags.length} hashtags (need ${HASHTAG_MIN}-${HASHTAG_MAX}, target 10).`,
        );
      }

      // Caption body without hashtag line, lower-cased, for word scans.
      const body = stripHashtagLine(post.caption).toLowerCase();

      // Warn: US-English spellings.
      for (const [us, uk] of US_UK_SPELLINGS) {
        const re = new RegExp(`\\b${us}\\b`, "i");
        if (re.test(body)) {
          warnings.push(`${ctx}: US spelling "${us}" detected. Use UK "${uk}".`);
        }
      }

      // Warn: banned brand-voice words.
      for (const w of BANNED_WORDS) {
        const re = new RegExp(`\\b${w.replace(/\s+/g, "\\s+")}\\b`, "i");
        if (re.test(body)) {
          warnings.push(`${ctx}: banned word "${w}" detected.`);
        }
      }
    }

    if (!Array.isArray(post.media) || post.media.length === 0) {
      errors.push(`${ctx}: media must be a non-empty array`);
    } else {
      if (post.type === "image" && post.media.length !== 1) {
        errors.push(`${ctx}: image requires exactly 1 media file (got ${post.media.length})`);
      }
      if (post.type === "carousel" && (post.media.length < 2 || post.media.length > 10)) {
        errors.push(`${ctx}: carousel requires 2-10 media files (got ${post.media.length})`);
      }
      if (post.type === "reel" && post.media.length !== 1) {
        errors.push(`${ctx}: reel requires exactly 1 media file (got ${post.media.length})`);
      }
      for (const m of post.media) {
        const abs = path.resolve("content", m);
        try {
          await access(abs);
        } catch {
          errors.push(`${ctx}: missing media file "${m}" (looked at ${abs})`);
        }
      }
    }
  }

  if (warnings.length > 0) {
    console.warn(`! ${warnings.length} warning(s):`);
    for (const w of warnings) console.warn(`  - ${w}`);
    console.warn("");
  }

  if (errors.length === 0) {
    console.log(`OK: validated ${queue.posts.length} post(s).`);
    return;
  }
  console.error(`x ${errors.length} validation error(s):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

function stripHashtagLine(caption) {
  const lines = caption.split("\n");
  for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].trim().startsWith("#")) {
      return lines.slice(0, i).join("\n");
    }
  }
  return caption;
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});
