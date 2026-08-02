/**
 * 一键刷新作品 — 扫描 public/works/ 里的图片，
 * 自动生成 content/photos.json。
 *
 * 用法：node refresh-works.js
 */
const fs = require("fs");
const path = require("path");

const WORKS_DIR = path.join(__dirname, "public", "works");
const OUTPUT_FILE = path.join(__dirname, "content", "photos.json");

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

function getTitle(filename) {
  const ext = path.extname(filename);
  let name = path.basename(filename, ext);
  // 把下划线和横线替换为空格，去掉数字编号前缀
  name = name.replace(/[_-]/g, " ").trim();
  // 去掉类似 "01_", "1-" 这样的编号前缀
  name = name.replace(/^\d+[\s_-]*/, "").trim();
  return name || "Untitled";
}

function generateAspect(w, h) {
  if (!w || !h) return "4/3";
  const ratio = w / h;
  if (ratio > 1.6) return "16/9";
  if (ratio > 1.2) return "4/3";
  if (ratio > 0.9) return "1/1";
  if (ratio > 0.6) return "3/4";
  return "4/5";
}

// 尝试读取图片尺寸（同步方式，兼容 JPEG/PNG）
function getImageDims(filePath) {
  try {
    const buf = fs.readFileSync(filePath);
    // PNG: 前 8 字节是签名，之后 4 字节是宽度，再 4 字节是高度
    if (buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) {
      const w = buf.readUInt32BE(16);
      const h = buf.readUInt32BE(20);
      return { w, h };
    }
    // JPEG: 搜索 SOF0/SOF2 标记 (0xFF 0xC0 或 0xFF 0xC2)
    for (let i = 2; i < buf.length - 8; i++) {
      if (buf[i] === 0xff && (buf[i + 1] === 0xc0 || buf[i + 1] === 0xc2)) {
        const h = buf.readUInt16BE(i + 5);
        const w = buf.readUInt16BE(i + 7);
        return { w, h };
      }
    }
    // WebP
    if (buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50) {
      return { w: 0, h: 0 };
    }
    return { w: 0, h: 0 };
  } catch {
    return { w: 0, h: 0 };
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
    console.log("\n⚠️  public/works/ 里还没有图片，请先往这个文件夹放照片，再运行本脚本。\n");
    return;
  }

  const photos = files.map((file, idx) => {
    const { w, h } = getImageDims(path.join(WORKS_DIR, file));
    return {
      id: String(idx + 1),
      title: getTitle(file),
      src: `/works/${file}`,
      aspectRatio: generateAspect(w, h),
      location: "",
    };
  });

  const json = { photos };
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(json, null, 2) + "\n", "utf-8");

  console.log(`\n✅ 已扫描 ${photos.length} 张照片，写入 content/photos.json`);
  console.log("   刷新浏览器即可看到更新后的作品。\n");
}

scanWorks();
