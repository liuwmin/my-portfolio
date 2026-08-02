export const runtime = "edge";

import { NextResponse } from "next/server";
import { readdir } from "fs/promises";
import { join } from "path";

const IMG_RE = /\.(jpe?g|png|webp|gif)$/i;

export async function GET() {
  const PUBLIC = join(process.cwd(), "public");
  const listDir = async (dir: string, prefix: string) => {
    try {
      const files = await readdir(join(PUBLIC, dir));
      return files
        .filter((f) => IMG_RE.test(f))
        .map((name) => ({ name, url: `/${dir}/${name}` }));
    } catch {
      return [];
    }
  };
  const [works, ai] = await Promise.all([
    listDir("works", ""),
    listDir("ai-works", ""),
  ]);
  return NextResponse.json({ works, ai });
}
