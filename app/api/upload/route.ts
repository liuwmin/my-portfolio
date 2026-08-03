import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, readFile } from "fs/promises";
import { join, extname, relative, sep } from "path";
import { exec } from "child_process";

const PUBLIC_DIR = join(process.cwd(), "public");
const CONTENT_DIR = join(process.cwd(), "content");

export async function POST(req: NextRequest) {
  try {
    const { target, filename, data, category } = await req.json();
    if (!target || !filename || !data) {
      return NextResponse.json({ error: "缺少参数" }, { status: 400 });
    }

    // 去掉 data URL 前缀（如 data:image/png;base64,）
    const base64 = data.replace(/^data:[^;]+;base64,/, "");
    const buffer = Buffer.from(base64, "base64");

    let publicPath: string;
    const siteUpdate: Record<string, string> = {};
    const ext = (extname(filename).toLowerCase() || ".jpg").replace(/[^.a-z0-9]/gi, "");

    if (target === "hero") {
      const safeName = "hero" + ext;
      publicPath = join(PUBLIC_DIR, safeName);
      siteUpdate["hero.backgroundImage"] = "/" + safeName;
    } else if (target === "avatar") {
      const safeName = "avatar" + ext;
      publicPath = join(PUBLIC_DIR, safeName);
      siteUpdate["profile.avatar"] = "/" + safeName;
    } else if (target === "works") {
      publicPath = join(PUBLIC_DIR, "works", filename);
    } else if (target === "ai") {
      // AI 作品：按分类存到 public/ai-works/<分类>/，默认"写真"
      const validCats = ["写真", "创意", "人设", "二次元", "开源专区"];
      const safeCat = validCats.includes(category) ? category : "写真";
      publicPath = join(PUBLIC_DIR, "ai-works", safeCat, filename);
    } else if (target === "video-cover") {
      // 视频封面：存到 public/video-covers/，文件名带时间戳避免重名
      const safeName = `cover-${Date.now()}${ext}`;
      publicPath = join(PUBLIC_DIR, "video-covers", safeName);
    } else {
      return NextResponse.json({ error: "未知目标：" + target }, { status: 400 });
    }

    await mkdir(join(publicPath, ".."), { recursive: true });
    await writeFile(publicPath, buffer);

    // 同步更新 site.json
    if (Object.keys(siteUpdate).length > 0) {
      const sitePath = join(CONTENT_DIR, "site.json");
      const site = JSON.parse(await readFile(sitePath, "utf-8"));
      for (const [keyPath, value] of Object.entries(siteUpdate)) {
        const parts = keyPath.split(".");
        let cur: any = site;
        for (let i = 0; i < parts.length - 1; i++) cur = cur[parts[i]];
        cur[parts[parts.length - 1]] = value;
      }
      await writeFile(sitePath, JSON.stringify(site, null, 2) + "\n", "utf-8");
    }

    // 自动重扫作品列表（works / ai）
    if (target === "works" || target === "ai") {
      const script = target === "works" ? "scan-photos.js" : "scan-ai.js";
      await new Promise<void>((resolve) => {
        exec(`node "${join(process.cwd(), script)}"`, () => resolve());
      });
    }

    const publicUrl = "/" + relative(PUBLIC_DIR, publicPath).split(sep).join("/");
    return NextResponse.json({ ok: true, url: publicUrl });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
