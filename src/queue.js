import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export const QUEUE_PATH = path.resolve("content/queue.json");

export async function loadQueue() {
  const raw = await readFile(QUEUE_PATH, "utf8");
  const data = JSON.parse(raw);
  if (!Array.isArray(data.posts)) {
    throw new Error("queue.json is missing a `posts` array");
  }
  return data;
}

export async function saveQueue(queue) {
  const serialized = JSON.stringify(queue, null, 2) + "\n";
  await writeFile(QUEUE_PATH, serialized, "utf8");
}

export function findNextPost(queue, today = new Date()) {
  const todayStr = toDateString(today);
  const eligible = queue.posts
    .filter((p) => p.status === "pending" && p.scheduled_for <= todayStr)
    .sort((a, b) => a.scheduled_for.localeCompare(b.scheduled_for));
  return eligible[0] ?? null;
}

export function markPosted(post, igMediaId) {
  post.status = "posted";
  post.posted_at = new Date().toISOString();
  post.ig_media_id = igMediaId;
  post.error = null;
}

export function markFailed(post, error) {
  post.status = "failed";
  post.error = error instanceof Error ? error.message : String(error);
}

function toDateString(d) {
  return d.toISOString().slice(0, 10);
}
