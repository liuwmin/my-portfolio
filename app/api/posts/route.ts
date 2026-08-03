import { NextRequest, NextResponse } from "next/server";
import { writeFile, readFile } from "fs/promises";
import { join } from "path";

const POSTS_PATH = join(process.cwd(), "content", "posts.json");

export async function GET() {
  try {
    const data = await readFile(POSTS_PATH, "utf-8");
    return NextResponse.json(JSON.parse(data));
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // body: { posts: [...] } — 整份保存
    await writeFile(POSTS_PATH, JSON.stringify(body, null, 2) + "\n", "utf-8");
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
