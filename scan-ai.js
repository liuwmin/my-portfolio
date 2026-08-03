/**
 * 一键刷新 AI 作品 — 扫描 public/ai-works/ 里的图片，
 * 按子文件夹（写真 / 创意 / 人设）自动分类，
 * 生成 content/ai-works.json。
 *
 * 用法：直接把图拖进对应分类文件夹，双击 scan-all.bat 即可。
 */
const fs = require("fs");
const path = require("path");

const WORKS_DIR = path.join(__dirname, "public", "ai-works");
const OUTPUT_FILE = path.join(__dirname, "content", "ai-works.json");

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"];

// 分类文件夹 → 分类名。根目录的散图归入"创意"（默认）
// 顺序即网站标签页展示顺序（二次元放最后）
const CATEGORY_FOLDERS = ["写真", "创意", "人设", "二次元"];
const DEFAULT_CATEGORY = "创意";

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

// 扫描某个目录里的图片（不递归子目录）
function scanDir(dir, category) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => IMAGE_EXTENSIONS.includes(path.extname(f).toLowerCase()))
    .sort()
    .map((file) => ({
      title: getTitle(file),
      src: `/ai-works/${category}/${file}`,
      prompt: "",
      model: "AI Generated",
      date: getDate(path.join(dir, file)),
      category,
    }));
}

function scanWorks() {
  if (!fs.existsSync(WORKS_DIR)) {
    fs.mkdirSync(WORKS_DIR, { recursive: true });
  }
  // 确保三个分类文件夹存在
  for (const cat of CATEGORY_FOLDERS) {
    fs.mkdirSync(path.join(WORKS_DIR, cat), { recursive: true });
  }

  let works = [];

  // 1. 分类子文件夹
  for (const cat of CATEGORY_FOLDERS) {
    works = works.concat(scanDir(path.join(WORKS_DIR, cat), cat));
  }

  // 2. 根目录散图 → 归入默认分类
  works = works.concat(scanDir(WORKS_DIR, DEFAULT_CATEGORY));

  if (works.length === 0) {
    console.log("\n⚠️  public/ai-works/ 里还没有图片。\n");
    return;
  }

  // 重新编号 id
  const finalWorks = works.map((w, idx) => ({ id: String(idx + 1), ...w }));

  const json = { works: finalWorks };
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(json, null, 2) + "\n", "utf-8");

  const countByCat = {};
  for (const w of finalWorks) {
    countByCat[w.category] = (countByCat[w.category] || 0) + 1;
  }
  console.log(`\n✅ 已扫描 ${finalWorks.length} 张 AI 作品，写入 content/ai-works.json`);
  console.log("   分类统计：" + Object.entries(countByCat).map(([k, v]) => `${k} ${v}张`).join("，"));
  console.log("   提示：直接把图片拖进 public/ai-works/ 对应分类文件夹即可。\n");
}

scanWorks();
