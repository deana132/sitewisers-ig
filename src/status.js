import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const DRAFTS_PATH = path.resolve("content/drafts.json");
const QUEUE_PATH = path.resolve("content/queue.json");
const TOPIC_BANK_PATH = path.resolve("content/topic-bank.json");

// Rough per-draft Anthropic cost. One main call + occasional rewrite, Sonnet 4.5 pricing.
// input ~1300 tokens * $3/1M, output ~400 tokens * $15/1M = ~$0.0099, x1.2 for rewrites ~= $0.012.
const COST_PER_DRAFT_USD = 0.012;

async function main() {
  const drafts = await loadJson(DRAFTS_PATH, { posts: [] });
  const queue = await loadJson(QUEUE_PATH, { posts: [] });
  const topicBank = await loadJson(TOPIC_BANK_PATH, []);

  const now = new Date();
  const sectionBar = "─".repeat(56);

  console.log(`\nSitewisers IG status  (${now.toISOString()})\n${sectionBar}`);

  // ── Drafts awaiting review ──────────────────────────────────────
  const draftsAwaiting = drafts.posts;
  const earliestDraft = oldest(draftsAwaiting);
  console.log(`Drafts awaiting review:  ${draftsAwaiting.length}`);
  if (earliestDraft) {
    console.log(`  earliest scheduled:    ${earliestDraft.scheduled_for} ${earliestDraft.slot ?? ""}`.trimEnd());
  }
  if (draftsAwaiting.length > 0) {
    console.log(`  run 'npm run review' to approve`);
  }

  // ── Queue pending ───────────────────────────────────────────────
  const pending = queue.posts.filter((p) => p.status === "pending");
  const nextDue = oldest(pending);
  console.log(`\nQueue pending:           ${pending.length}`);
  if (nextDue) {
    const due = parseSlot(nextDue);
    const delta = due.getTime() - now.getTime();
    console.log(`  next scheduled:        ${nextDue.scheduled_for} ${nextDue.slot ?? ""}`.trimEnd());
    console.log(`  time until:            ${formatDelta(delta)}`);
    console.log(`  angle:                 ${nextDue.angle_id ?? "(unknown)"}`);
  } else {
    console.log(`  nothing queued. Approve drafts or run 'npm run generate'.`);
  }

  // ── Posted ──────────────────────────────────────────────────────
  const posted = queue.posts.filter((p) => p.status === "posted");
  const oneWeekAgo = now.getTime() - 7 * 86_400_000;
  const postedThisWeek = posted.filter((p) => {
    if (!p.posted_at) return false;
    return new Date(p.posted_at).getTime() >= oneWeekAgo;
  });
  console.log(`\nPosted (total):          ${posted.length}`);
  console.log(`  this week (7 days):    ${postedThisWeek.length}`);
  const mostRecent = posted
    .filter((p) => p.posted_at)
    .sort((a, b) => new Date(b.posted_at) - new Date(a.posted_at))[0];
  if (mostRecent) {
    console.log(`  most recent:           ${mostRecent.posted_at} (${mostRecent.angle_id ?? "?"})`);
  }

  // ── Failed (call attention) ─────────────────────────────────────
  const failed = queue.posts.filter((p) => p.status === "failed");
  if (failed.length > 0) {
    console.log(`\nFailed:                  ${failed.length}`);
    for (const f of failed) {
      console.log(`  - ${f.scheduled_for} ${f.slot ?? ""}  ${f.angle_id ?? "?"}`);
      console.log(`    error: ${(f.error ?? "(none)").slice(0, 80)}`);
    }
    console.log(`  (edit status back to 'pending' in content/queue.json to retry)`);
  }

  // ── Topic bank coverage ─────────────────────────────────────────
  if (Array.isArray(topicBank) && topicBank.length > 0) {
    const unused = topicBank.filter((a) => (a.used_count ?? 0) === 0).length;
    const inCooldown = topicBank.filter((a) => {
      if (!a.last_used) return false;
      return now.getTime() - new Date(a.last_used).getTime() < 14 * 86_400_000;
    }).length;
    console.log(`\nTopic bank:              ${topicBank.length} angles`);
    console.log(`  never used:            ${unused}`);
    console.log(`  in 14-day cooldown:    ${inCooldown}`);
  }

  // ── Spend estimate ──────────────────────────────────────────────
  const generatedCount = draftsAwaiting.length + queue.posts.length;
  const estimatedSpendUsd = generatedCount * COST_PER_DRAFT_USD;
  console.log(`\nAnthropic spend (est):   ~$${estimatedSpendUsd.toFixed(2)}`);
  console.log(`  basis:                 ${generatedCount} captions generated x ~$${COST_PER_DRAFT_USD.toFixed(3)}/draft`);
  console.log(`  verify at:             https://console.anthropic.com/settings/usage`);

  console.log(`${sectionBar}\n`);
}

function oldest(posts) {
  if (posts.length === 0) return null;
  return [...posts].sort((a, b) =>
    (`${a.scheduled_for} ${a.slot ?? "00:00"}`).localeCompare(
      `${b.scheduled_for} ${b.slot ?? "00:00"}`,
    ),
  )[0];
}

function parseSlot(post) {
  const time = post.slot && /^\d{2}:\d{2}$/.test(post.slot) ? post.slot : "09:00";
  return new Date(`${post.scheduled_for}T${time}:00Z`);
}

function formatDelta(ms) {
  if (ms < 0) {
    return `${formatDelta(-ms)} ago (overdue)`;
  }
  const seconds = Math.floor(ms / 1000);
  const days = Math.floor(seconds / 86_400);
  const hours = Math.floor((seconds % 86_400) / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (mins > 0 || parts.length === 0) parts.push(`${mins}m`);
  return parts.join(" ");
}

async function loadJson(p, fallback) {
  if (!existsSync(p)) return fallback;
  return JSON.parse(await readFile(p, "utf8"));
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});
