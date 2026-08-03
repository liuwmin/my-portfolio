import { NextResponse } from "next/server";
import { readdir } from "fs/promises";
import { join, extname } from "path";

const IMG_RE = /\.(jpe?g|png|webp|gif|avif)$/i;

export async function GET() {
  const PUBLIC = join(process.cwd(), "public");

  // 递归扫描目录，返回 [{ name, url, path }]
  // path 是相对目标目录的路径（含子文件夹，如 "写真/xxx.jpg"）
  const listDirRecursive = async (
    dir: string,
    rel: string
  ): Promise<{ name: string; url: string; path: string }[]> => {
    const results: { name: string; url: string; path: string }[] = [];
    try {
      const entries = await readdir(join(PUBLIC, dir), { withFileTypes: true });
      for (const entry of entries) {
        const entryPath = join(dir, entry.name);
        const entryRel = rel ? `${rel}/${entry.name}` : entry.name;
        if (entry.isDirectory()) {
          results.push(...(await listDirRecursive(entryPath, entryRel)));
        } else if (IMG_RE.test(entry.name)) {
          results.push({
            name: entry.name,
            url: `/${entryPath.split("\\").join("/")}`,
            path: entryRel,
          });
        }
      }
    } catch {
      // 目录不存在就返回空
    }
    return results;
  };

  const [works, ai] = await Promise.all([
    listDirRecursive("works", ""),
    listDirRecursive("ai-works", ""),
  ]);
  return NextResponse.json({ works, ai });
}
