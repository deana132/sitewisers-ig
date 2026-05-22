import { access } from "node:fs/promises";
import path from "node:path";
import { loadQueue } from "./queue.js";

const MAX_CAPTION = 2200;
const MAX_HASHTAGS = 30;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const VALID_TYPES = new Set(["image", "carousel", "reel"]);
const VALID_STATUSES = new Set(["pending", "posted", "failed"]);

async function main() {
  const queue = await loadQueue();
  const errors = [];

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
      const hashtags = post.caption.match(/#[\p{L}\p{N}_]+/gu) ?? [];
      if (hashtags.length > MAX_HASHTAGS) {
        errors.push(`${ctx}: ${hashtags.length} hashtags exceeds ${MAX_HASHTAGS}`);
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

  if (errors.length === 0) {
    console.log(`OK — validated ${queue.posts.length} post(s).`);
    return;
  }
  console.error(`✗ ${errors.length} validation error(s):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});
