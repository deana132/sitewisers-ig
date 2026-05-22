import puppeteer from "puppeteer";
import { readFile, mkdir } from "node:fs/promises";
import path from "node:path";

const TEMPLATES_DIR = path.resolve("templates");
const BASE_CSS_PATH = path.join(TEMPLATES_DIR, "_base.css");

export async function renderImage({ template, data, outputPath }) {
  const templatePath = path.join(TEMPLATES_DIR, `${template}.html`);
  let html = await readFile(templatePath, "utf8");

  // setContent defaults base URL to about:blank, which breaks relative <link href>.
  // Inline _base.css before rendering so templates stay DRY but render works headless.
  const baseCss = await readFile(BASE_CSS_PATH, "utf8");
  html = html.replace(
    /<link\s+[^>]*href=["']_base\.css["'][^>]*\/?>/,
    `<style>\n${baseCss}\n</style>`,
  );

  for (const [key, value] of Object.entries(data ?? {})) {
    html = html.replaceAll(`{{${key}}}`, escapeHtml(String(value)));
  }

  const unfilled = html.match(/\{\{[a-zA-Z_][a-zA-Z0-9_]*\}\}/g);
  if (unfilled) {
    console.log(`     WARN: unfilled placeholders in ${template}: ${unfilled.join(", ")}`);
  }

  await mkdir(path.dirname(outputPath), { recursive: true });

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 1 });
    await page.setContent(html, { waitUntil: "networkidle0" });
    await page.evaluate(() => document.fonts.ready);
    await new Promise((r) => setTimeout(r, 250));
    await page.screenshot({ path: outputPath, type: "png" });
  } finally {
    await browser.close();
  }

  return outputPath;
}

function escapeHtml(s) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
