import { InstagramClient } from "./instagram.js";
import {
  loadQueue,
  saveQueue,
  findNextPost,
  markPosted,
  markFailed,
} from "./queue.js";

const DRY_RUN = process.argv.includes("--dry-run");

async function main() {
  const queue = await loadQueue();
  const post = findNextPost(queue);

  if (!post) {
    console.log("No pending posts due today. Exiting.");
    return;
  }

  console.log(`Selected post ${post.id} (${post.type}) scheduled ${post.scheduled_for}`);

  const mediaUrls = post.media.map(toMediaUrl);

  if (DRY_RUN) {
    console.log("--dry-run — would publish:");
    console.log(JSON.stringify({ id: post.id, type: post.type, mediaUrls, caption: post.caption }, null, 2));
    return;
  }

  const ig = new InstagramClient();

  try {
    const igMediaId = await ig.publish(post, mediaUrls);
    markPosted(post, igMediaId);
    console.log(`Published as IG media ${igMediaId}`);
  } catch (err) {
    markFailed(post, err);
    console.error(`Publish failed: ${post.error}`);
    await saveQueue(queue);
    process.exitCode = 1;
    return;
  }

  await saveQueue(queue);
}

function toMediaUrl(relPath) {
  const repo = process.env.GITHUB_REPOSITORY;
  const ref = process.env.GITHUB_SHA || process.env.GITHUB_REF_NAME || "main";
  if (!repo) {
    throw new Error(
      "GITHUB_REPOSITORY is required to build raw.githubusercontent.com media URLs."
    );
  }
  return `https://raw.githubusercontent.com/${repo}/${ref}/content/${relPath}`;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
