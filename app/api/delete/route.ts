export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { unlink } from "fs/promises";
import { join } from "path";
import { exec } from "child_process";

const PUBLIC = join(process.cwd(), "public");

export async function POST(req: NextRequest) {
  try {
    const { target, filename } = await req.json();
    if (!target || !filename) {
      return NextResponse.json({ error: "缺少参数" }, { status: 400 });
    }
    if (!/^[\w\u4e00-\u9fa5.\-]+$/.test(filename)) {
      return NextResponse.json({ error: "文件名非法" }, { status: 400 });
    }

    let subdir = "";
    if (target === "works") subdir = "works";
    else if (target === "ai") subdir = "ai-works";
    else return NextResponse.json({ error: "未知目标" }, { status: 400 });

    const filePath = join(PUBLIC, subdir, filename);
    await unlink(filePath);

    const script = target === "works" ? "scan-photos.js" : "scan-ai.js";
    await new Promise<void>((resolve) => {
      exec(`node "${join(process.cwd(), script)}"`, () => resolve());
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
