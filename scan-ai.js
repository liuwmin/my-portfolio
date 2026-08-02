/**
 * 一键刷新 AI 作品 — 扫描 public/ai-works/ 里的图片，
 * 自动生成 content/ai-works.json。
 *
 * prompt/model/date 会给默认值，你可手动改 JSON 补充。
 */
const fs = require("fs");
const path = require("path");

const WORKS_DIR = path.join(__dirname, "public", "ai-works");
const OUTPUT_FILE = path.join(__dirname, "content", "ai-works.json");

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

function getTitle(filename) {
  const ext = path.extname(filename);
  let name = path.basename(filename, ext);
  name = name.replace(/[_-]/g, " ").trim();
  name = name.replace(/^\d+[\s_-]*/, "").trim();
  return name || "Untitled";
}

function getDate(filePath) {
  try {
    const stat = fs.statSync(filePath);
    const d = stat.mtime;
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  } catch {
    return "";
  }
}

function scanWorks() {
  if (!fs.existsSync(WORKS_DIR)) {
    fs.mkdirSync(WORKS_DIR, { recursive: true });
  }

  const files = fs
    .readdirSync(WORKS_DIR)
    .filter((f) => IMAGE_EXTENSIONS.includes(path.extname(f).toLowerCase()))
    .sort();

  if (files.length === 0) {
    console.log("\n⚠️  public/ai-works/ 里还没有图片。\n");
    return;
  }

  const works = files.map((file, idx) => ({
    id: String(idx + 1),
    title: getTitle(file),
    src: `/ai-works/${file}`,
    prompt: "",
    model: "AI Generated",
    date: getDate(path.join(WORKS_DIR, file)),
  }));

  const json = { works };
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(json, null, 2) + "\n", "utf-8");

  console.log(`\n✅ 已扫描 ${works.length} 张 AI 作品，写入 content/ai-works.json`);
  console.log("   默认 prompt 为空，可在 JSON 里补写提示词。\n");
}

scanWorks();
