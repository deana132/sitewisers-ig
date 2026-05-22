import { readFile, writeFile, unlink, mkdir } from "node:fs/promises";
import { existsSync, writeFileSync, readFileSync } from "node:fs";
import { spawn } from "node:child_process";
import readline from "node:readline";
import path from "node:path";
import { tmpdir } from "node:os";

const DRAFTS_PATH = path.resolve("content/drafts.json");
const QUEUE_PATH = path.resolve("content/queue.json");

async function main() {
  const drafts = await loadJson(DRAFTS_PATH, { posts: [] });
  const queue = await loadJson(QUEUE_PATH, { posts: [] });

  if (drafts.posts.length === 0) {
    console.log("No drafts to review.");
    return;
  }

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  console.log(`${drafts.posts.length} draft(s) to review.\n`);

  let i = 0;
  let quit = false;
  while (i < drafts.posts.length && !quit) {
    const post = drafts.posts[i];
    printDraft(post, i, drafts.posts.length);

    const action = (await ask(rl, "[a]pprove / [e]dit / [s]kip / [d]elete / [q]uit: ")).trim().toLowerCase();
    switch (action) {
      case "a":
      case "approve": {
        const { slot, angle_id, ...rest } = post;
        queue.posts.push({ ...rest, status: "pending", slot, angle_id });
        drafts.posts.splice(i, 1);
        console.log("  approved → queue.json (pending)");
        break;
      }
      case "e":
      case "edit": {
        const edited = await openEditor(post.caption);
        if (edited != null) {
          post.caption = edited;
          console.log("  caption updated");
        }
        break;
      }
      case "s":
      case "skip":
        console.log("  skipped");
        i++;
        break;
      case "d":
      case "delete": {
        for (const m of post.media) {
          const abs = path.resolve("content", m);
          try {
            await unlink(abs);
            console.log(`  removed ${m}`);
          } catch {
            // file already gone, ignore
          }
        }
        drafts.posts.splice(i, 1);
        console.log("  deleted from drafts.json");
        break;
      }
      case "q":
      case "quit":
        quit = true;
        break;
      default:
        console.log("  unrecognised, try a / e / s / d / q");
    }
    console.log("");
  }

  rl.close();
  await writeJson(DRAFTS_PATH, drafts);
  await writeJson(QUEUE_PATH, queue);
  console.log(`Saved. ${drafts.posts.length} draft(s) remaining.`);
}

function printDraft(post, i, total) {
  console.log("─".repeat(60));
  console.log(`Draft ${i + 1} of ${total}`);
  console.log(`  scheduled: ${post.scheduled_for} ${post.slot ?? ""}`);
  console.log(`  angle:     ${post.angle_id ?? "(none)"}`);
  console.log(`  type:      ${post.type}`);
  console.log(`  image:     ${post.media.join(", ")}`);
  console.log("─".repeat(60));
  console.log(post.caption);
  console.log("─".repeat(60));
  for (const m of post.media) {
    console.log(`  open: ${path.resolve("content", m)}`);
  }
  console.log("");
}

function ask(rl, prompt) {
  return new Promise((resolve) => rl.question(prompt, resolve));
}

function openEditor(text) {
  const editor = process.env.EDITOR || process.env.VISUAL || "nano";
  const tmpFile = path.join(tmpdir(), `sitewisers-caption-${Date.now()}.txt`);
  writeFileSync(tmpFile, text);
  return new Promise((resolve) => {
    const child = spawn(editor, [tmpFile], { stdio: "inherit" });
    child.on("exit", () => {
      try {
        const updated = readFileSync(tmpFile, "utf8");
        try { unlink(tmpFile); } catch {}
        resolve(updated.replace(/\s+$/, ""));
      } catch {
        resolve(null);
      }
    });
    child.on("error", (err) => {
      console.error(`  editor (${editor}) failed: ${err.message}`);
      resolve(null);
    });
  });
}

async function loadJson(p, fallback) {
  if (!existsSync(p)) return fallback;
  return JSON.parse(await readFile(p, "utf8"));
}

async function writeJson(p, data) {
  await mkdir(path.dirname(p), { recursive: true });
  await writeFile(p, JSON.stringify(data, null, 2) + "\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
