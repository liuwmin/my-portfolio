"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Upload, Trash2, Save, ExternalLink, Camera, Plus, Video as VideoIcon } from "lucide-react";

type Social = { instagram: string; twitter: string; youtube: string; github: string };
type Profile = {
  name: string;
  tagline: string;
  bio: string;
  email: string;
  avatar: string;
  social: Social;
};
type Hero = {
  backgroundImage: string;
  mobileBackgroundImage: string;
  title: string;
  subtitle: string;
};
type Site = { profile: Profile; hero: Hero };
type Media = { name: string; url: string; path?: string };
type VideoItem = {
  id: string;
  title: string;
  thumbnail: string;
  videoUrl: string;
  description?: string;
  duration: string;
};

type BlogPost = {
  id: string;
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  tags: string[];
};

function getYouTubeId(url: string): string | null {
  const patterns = [
    /youtube\.com\/watch\?v=([\w-]{6,})/,
    /youtu\.be\/([\w-]{6,})/,
    /youtube\.com\/embed\/([\w-]{6,})/,
    /youtube\.com\/shorts\/([\w-]{6,})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

function autoThumb(url: string): string {
  const yt = getYouTubeId(url);
  if (yt) return `https://img.youtube.com/vi/${yt}/hqdefault.jpg`;
  return "";
}

export default function AdminPage() {
  const [site, setSite] = useState<Site | null>(null);
  const [works, setWorks] = useState<Media[]>([]);
  const [ais, setAIs] = useState<Media[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [newPost, setNewPost] = useState({ title: "", date: "", tags: "", content: "" });
  const [aiCategory, setAiCategory] = useState("写真");
  const [status, setStatus] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const [s, l, v, p] = await Promise.all([
      fetch("/api/save-site").then((r) => (r.ok ? r.json() : null)),
      fetch("/api/list").then((r) => r.json()),
      fetch("/api/videos").then((r) => (r.ok ? r.json() : { videos: [] })),
      fetch("/api/posts").then((r) => (r.ok ? r.json() : { posts: [] })),
    ]);
    setSite(s);
    setWorks(l.works || []);
    setAIs(l.ai || []);
    setVideos(v.videos || []);
    setPosts(p.posts || []);
  }

  function flash(kind: "ok" | "err", text: string) {
    setStatus({ kind, text });
    setTimeout(() => setStatus(null), 3500);
  }

  function updatePath(path: string, value: string) {
    setSite((prev) => {
      if (!prev) return prev;
      const next: any = JSON.parse(JSON.stringify(prev));
      const parts = path.split(".");
      let cur = next;
      for (let i = 0; i < parts.length - 1; i++) cur = cur[parts[i]];
      cur[parts[parts.length - 1]] = value;
      return next;
    });
  }

  async function saveSite() {
    if (!site) return;
    setSaving(true);
    try {
      const r = await fetch("/api/save-site", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(site),
      });
      const data = await r.json();
      if (r.ok) flash("ok", "已保存");
      else flash("err", data.error || "保存失败");
    } finally {
      setSaving(false);
    }
  }

  async function uploadFile(
    file: File,
    target: "hero" | "hero-mobile" | "avatar" | "works" | "ai",
    category?: string
  ) {
    const reader = new FileReader();
    reader.onload = async () => {
      const data = reader.result as string;
      try {
        const r = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            target,
            filename: file.name,
            data,
            category: target === "ai" ? category : undefined,
          }),
        });
        const result = await r.json();
        if (r.ok) {
          flash("ok", `已上传 → ${result.url}`);
          await loadData();
        } else flash("err", result.error || "上传失败");
      } catch (e) {
        flash("err", (e as Error).message);
      }
    };
    reader.readAsDataURL(file);
  }

  async function uploadCover(file: File, index: number) {
    const reader = new FileReader();
    reader.onload = async () => {
      const data = reader.result as string;
      try {
        const r = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            target: "video-cover",
            filename: file.name,
            data,
          }),
        });
        const result = await r.json();
        if (r.ok) {
          updateVideo(index, "thumbnail", result.url);
          flash("ok", "封面已上传");
        } else flash("err", result.error || "上传失败");
      } catch (e) {
        flash("err", (e as Error).message);
      }
    };
    reader.readAsDataURL(file);
  }

  async function deleteFile(target: "works" | "ai", filename: string) {
    if (!confirm(`确定删除 ${filename}?`)) return;
    try {
      const r = await fetch("/api/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target, filename }),
      });
      const data = await r.json();
      if (r.ok) {
        flash("ok", "已删除");
        await loadData();
      } else flash("err", data.error || "删除失败");
    } catch (e) {
      flash("err", (e as Error).message);
    }
  }

  function addVideo() {
    setVideos((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        title: "",
        thumbnail: "",
        videoUrl: "",
        description: "",
        duration: "",
      },
    ]);
  }

  function updateVideo(index: number, field: keyof VideoItem, value: string) {
    setVideos((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      // 如果改的是 URL，自动补 YouTube 缩略图
      if (field === "videoUrl" && !next[index].thumbnail) {
        next[index].thumbnail = autoThumb(value);
      }
      return next;
    });
  }

  function removeVideo(index: number) {
    if (!confirm("确定删除这个视频?")) return;
    setVideos((prev) => prev.filter((_, i) => i !== index));
  }

  async function saveVideos() {
    setSaving(true);
    try {
      const r = await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videos }),
      });
      const data = await r.json();
      if (r.ok) flash("ok", "视频已保存");
      else flash("err", data.error || "保存失败");
    } finally {
      setSaving(false);
    }
  }

  function addPost() {
    const title = newPost.title.trim();
    if (!title) {
      flash("err", "请先填写文章标题");
      return;
    }
    const content = newPost.content.trim();
    if (!content) {
      flash("err", "请填写正文内容");
      return;
    }
    // 摘要：取正文第一段，截断到 80 字
    const firstPara =
      content
        .split("\n")
        .map((s) => s.trim())
        .find((s) => s !== "") || "";
    const excerpt =
      firstPara.length > 80 ? firstPara.slice(0, 80) + "..." : firstPara;
    const tags = newPost.tags
      .split(/[,，、\s]+/)
      .map((t) => t.trim())
      .filter(Boolean);
    const post: BlogPost = {
      id: String(Date.now()),
      slug: `post-${Date.now()}`,
      title,
      date: newPost.date || new Date().toISOString().slice(0, 10),
      excerpt,
      content,
      tags,
    };
    setPosts((prev) => [post, ...prev]);
    setNewPost({ title: "", date: "", tags: "", content: "" });
    flash("ok", "文章已添加（记得点保存）");
  }

  function removePost(index: number) {
    if (!confirm("确定删除这篇文章?")) return;
    setPosts((prev) => prev.filter((_, i) => i !== index));
  }

  async function savePosts() {
    setSaving(true);
    try {
      const r = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ posts }),
      });
      const data = await r.json();
      if (r.ok) flash("ok", "文章已保存");
      else flash("err", data.error || "保存失败");
    } finally {
      setSaving(false);
    }
  }

  if (!site)
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        加载中...
      </div>
    );

  return (
    <div className="min-h-screen bg-black text-neutral-100">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <h1 className="text-lg font-semibold uppercase tracking-[0.25em]">
            内容管理后台
          </h1>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.25em] text-neutral-400 transition-colors hover:text-white"
            >
              <ExternalLink size={14} /> 查看网站
            </Link>
            <button
              onClick={saveSite}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-sm border border-white/15 bg-white/[0.05] px-5 py-2 text-xs uppercase tracking-[0.25em] transition-all hover:border-white/40 hover:bg-white/[0.1] disabled:opacity-50"
            >
              <Save size={14} />
              {saving ? "保存中..." : "保存设置"}
            </button>
          </div>
        </div>
        {status && (
          <div
            className={`mx-auto max-w-6xl border-t px-6 py-2 text-sm ${
              status.kind === "ok"
                ? "border-green-500/30 bg-green-500/10 text-green-300"
                : "border-red-500/30 bg-red-500/10 text-red-300"
            }`}
          >
            {status.text}
          </div>
        )}
      </header>

      <div className="mx-auto max-w-6xl space-y-8 px-6 py-8">
        {/* Hero */}
        <Section title="首页大图背景" desc="首页全屏背景图。拖入图片即替换，文件名固定为 hero.jpg/webp/png。">
          <div className="grid gap-4 md:grid-cols-[300px_1fr]">
            <div className="overflow-hidden rounded-lg border border-white/10">
              <img
                src={site.hero.backgroundImage}
                alt=""
                className="h-48 w-full object-cover"
              />
            </div>
            <DropZone
              hint="拖入图片替换，或点击选择文件"
              onFiles={(files) =>
                files.forEach((f) => uploadFile(f, "hero"))
              }
            />
          </div>
          <Field
            label="图片 URL（覆盖上面预览时自动更新）"
            value={site.hero.backgroundImage}
            onChange={(v) => updatePath("hero.backgroundImage", v)}
          />
        </Section>

        {/* Hero Mobile */}
        <Section
          title="首页手机壁纸（可选）"
          desc="手机端单独用的竖版壁纸，避免横图被裁切。不设置则手机端沿用桌面大图。建议上传 9:16 竖图。"
        >
          <div className="grid gap-4 md:grid-cols-[200px_1fr]">
            <div className="overflow-hidden rounded-lg border border-white/10">
              {site.hero.mobileBackgroundImage ? (
                <img
                  src={site.hero.mobileBackgroundImage}
                  alt=""
                  className="h-64 w-full object-cover"
                />
              ) : (
                <div className="flex h-64 w-full items-center justify-center text-xs text-neutral-600">
                  未设置
                </div>
              )}
            </div>
            <div className="space-y-3">
              <DropZone
                hint="拖入竖版图片替换，或点击选择文件"
                onFiles={(files) =>
                  files.forEach((f) => uploadFile(f, "hero-mobile"))
                }
              />
              {site.hero.mobileBackgroundImage && (
                <button
                  onClick={() => updatePath("hero.mobileBackgroundImage", "")}
                  className="text-xs text-neutral-500 underline-offset-4 transition-colors hover:text-red-400 hover:underline"
                >
                  清除手机壁纸（恢复使用桌面图）
                </button>
              )}
            </div>
          </div>
        </Section>

        {/* Avatar */}
        <Section title="关于页头像" desc="About 页左侧的头像。">
          <div className="grid gap-4 md:grid-cols-[200px_1fr]">
            <div className="overflow-hidden rounded-full border border-white/10">
              <img src={site.profile.avatar} alt="" className="h-48 w-48 object-cover" />
            </div>
            <DropZone
              hint="拖入图片替换，或点击选择文件"
              onFiles={(files) =>
                files.forEach((f) => uploadFile(f, "avatar"))
              }
            />
          </div>
          <Field
            label="图片 URL"
            value={site.profile.avatar}
            onChange={(v) => updatePath("profile.avatar", v)}
          />
        </Section>

        {/* 文本信息 */}
        <Section title="网站信息" desc="填好后点右上角「保存设置」。">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="显示名称" value={site.profile.name} onChange={(v) => updatePath("profile.name", v)} />
            <Field label="副标题 / 标签" value={site.profile.tagline} onChange={(v) => updatePath("profile.tagline", v)} />
            <div className="md:col-span-2">
              <Field label="个人简介" textarea value={site.profile.bio} onChange={(v) => updatePath("profile.bio", v)} />
            </div>
            <Field label="联系邮箱" value={site.profile.email} onChange={(v) => updatePath("profile.email", v)} />
            <Field label="首页大标题" value={site.hero.title} onChange={(v) => updatePath("hero.title", v)} />
            <Field label="首页副标题" value={site.hero.subtitle} onChange={(v) => updatePath("hero.subtitle", v)} />
            <Field label="Instagram 链接" value={site.profile.social.instagram} onChange={(v) => updatePath("profile.social.instagram", v)} />
            <Field label="Twitter 链接" value={site.profile.social.twitter} onChange={(v) => updatePath("profile.social.twitter", v)} />
            <Field label="YouTube 链接" value={site.profile.social.youtube} onChange={(v) => updatePath("profile.social.youtube", v)} />
            <Field label="GitHub 链接" value={site.profile.social.github} onChange={(v) => updatePath("profile.social.github", v)} />
          </div>
        </Section>

        {/* Photography */}
        <Section title={`摄影作品 (${works.length})`} desc="拖入图片批量上传，悬停缩略图可删除。">
          <DropZone
            hint="拖入图片即可批量添加"
            onFiles={(files) =>
              files
                .filter((f) => f.type.startsWith("image/"))
                .forEach((f) => uploadFile(f, "works"))
            }
          />
          <MediaGrid items={works} onDelete={(n) => deleteFile("works", n)} />
        </Section>

        {/* AI */}
        <Section title={`AI 作品 (${ais.length})`}>
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-wider text-neutral-500">
              上传到分类：
            </span>
            {["写真", "创意", "人设", "二次元", "开源专区"].map((c) => (
              <button
                key={c}
                onClick={() => setAiCategory(c)}
                className={
                  aiCategory === c
                    ? "rounded-sm border border-white/40 bg-white/10 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-white"
                    : "rounded-sm border border-white/15 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-neutral-400 hover:text-white"
                }
              >
                {c}
              </button>
            ))}
          </div>
          <DropZone
            hint={`拖入图片批量添加到「${aiCategory}」分类`}
            onFiles={(files) =>
              files
                .filter((f) => f.type.startsWith("image/"))
                .forEach((f) => uploadFile(f, "ai", aiCategory))
            }
          />
          <MediaGrid items={ais} onDelete={(n) => deleteFile("ai", n)} />
        </Section>

        {/* Videos */}
        <Section
          title={`视频作品 (${videos.length})`}
          desc="支持 YouTube / B 站 / .mp4 直链。贴链接后自动识别平台，YouTube 自动补缩略图。"
        >
          <div className="space-y-3">
            {videos.map((v, i) => (
              <div
                key={v.id || i}
                className="grid gap-3 rounded border border-white/10 bg-black/30 p-3 md:grid-cols-[120px_1fr_auto]"
              >
                <div
                  title="点击或拖入图片设置封面"
                  onClick={() => {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.accept = "image/*";
                    input.onchange = () => {
                      const f = input.files?.[0];
                      if (f) uploadCover(f, i);
                    };
                    input.click();
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const f = e.dataTransfer.files?.[0];
                    if (f && f.type.startsWith("image/")) uploadCover(f, i);
                  }}
                  className="aspect-video cursor-pointer overflow-hidden rounded bg-neutral-900"
                >
                  {v.thumbnail || autoThumb(v.videoUrl) ? (
                    <img
                      src={v.thumbnail || autoThumb(v.videoUrl)}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-1 text-neutral-700">
                      <VideoIcon size={20} />
                      <span className="text-[10px]">点击设封面</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="标题（如：TOKYO NIGHTS）"
                    value={v.title}
                    onChange={(e) => updateVideo(i, "title", e.target.value)}
                    className="w-full rounded border border-white/15 bg-black/40 px-3 py-1.5 text-sm text-white outline-none focus:border-white/40"
                  />
                  <input
                    type="text"
                    placeholder="视频链接（YouTube / B站 / .mp4 直链）"
                    value={v.videoUrl}
                    onChange={(e) => updateVideo(i, "videoUrl", e.target.value)}
                    className="w-full rounded border border-white/15 bg-black/40 px-3 py-1.5 text-sm text-white outline-none focus:border-white/40"
                  />
                  <input
                    type="text"
                    placeholder="封面链接（B站/MP4 需要手动填，YouTube 自动生成可留空）"
                    value={v.thumbnail || ""}
                    onChange={(e) => updateVideo(i, "thumbnail", e.target.value)}
                    className="w-full rounded border border-white/15 bg-black/40 px-3 py-1.5 text-sm text-white outline-none focus:border-white/40"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="描述（可选）"
                      value={v.description || ""}
                      onChange={(e) => updateVideo(i, "description", e.target.value)}
                      className="rounded border border-white/15 bg-black/40 px-3 py-1.5 text-sm text-white outline-none focus:border-white/40"
                    />
                    <input
                      type="text"
                      placeholder="时长（如 12:06，可选）"
                      value={v.duration || ""}
                      onChange={(e) => updateVideo(i, "duration", e.target.value)}
                      className="rounded border border-white/15 bg-black/40 px-3 py-1.5 text-sm text-white outline-none focus:border-white/40"
                    />
                  </div>
                </div>
                <button
                  onClick={() => removeVideo(i)}
                  className="self-start rounded p-2 text-neutral-500 transition-colors hover:bg-red-500/20 hover:text-red-400"
                  aria-label="删除"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <button
              onClick={addVideo}
              className="inline-flex items-center gap-2 rounded border border-dashed border-white/20 px-4 py-2 text-sm text-neutral-400 transition-colors hover:border-white/40 hover:text-white"
            >
              <Plus size={16} /> 添加视频
            </button>
          </div>
          <button
            onClick={saveVideos}
            disabled={saving}
            className="mt-4 inline-flex items-center gap-2 rounded-sm border border-white/15 bg-white/[0.05] px-6 py-2.5 text-xs uppercase tracking-[0.25em] transition-all hover:border-white/40 hover:bg-white/[0.1] disabled:opacity-50"
          >
            <Save size={14} /> 保存视频列表
          </button>
        </Section>

        {/* Blog */}
        <Section
          title={`博客文章 (${posts.length})`}
          desc="写新文章：填标题 → 写正文（段落之间用空行隔开）→ 点「添加文章」，最后点「保存文章列表」。"
        >
          <div className="rounded border border-white/10 bg-black/30 p-4">
            <p className="mb-3 text-xs uppercase tracking-wider text-neutral-400">
              新建文章
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              <input
                type="text"
                placeholder="文章标题（必填）"
                value={newPost.title}
                onChange={(e) => setNewPost((p) => ({ ...p, title: e.target.value }))}
                className="w-full rounded border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-white/40"
              />
              <input
                type="date"
                value={newPost.date}
                onChange={(e) => setNewPost((p) => ({ ...p, date: e.target.value }))}
                className="w-full rounded border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-white/40 [color-scheme:dark]"
              />
            </div>
            <input
              type="text"
              placeholder="标签（用逗号分隔，如：AI, 随笔, 创作心得）"
              value={newPost.tags}
              onChange={(e) => setNewPost((p) => ({ ...p, tags: e.target.value }))}
              className="mt-3 w-full rounded border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-white/40"
            />
            <textarea
              placeholder={
                "正文内容（段落之间空一行）\n\n第一段会自动成为列表页的摘要。"
              }
              rows={8}
              value={newPost.content}
              onChange={(e) => setNewPost((p) => ({ ...p, content: e.target.value }))}
              className="mt-3 w-full rounded border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none placeholder:text-neutral-600 focus:border-white/40"
            />
            <button
              onClick={addPost}
              className="mt-3 inline-flex items-center gap-2 rounded border border-white/15 bg-white/[0.05] px-5 py-2 text-xs uppercase tracking-[0.25em] text-white transition-all hover:border-white/40 hover:bg-white/[0.1]"
            >
              <Plus size={14} /> 添加文章
            </button>
          </div>

          <div className="space-y-2">
            {posts.map((p, i) => (
              <div
                key={p.id}
                className="flex items-center justify-between gap-3 rounded border border-white/10 bg-black/30 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm text-white">{p.title}</p>
                  <p className="mt-0.5 text-xs text-neutral-500">
                    {p.date}
                    {p.tags.length > 0 ? ` · ${p.tags.join(" / ")}` : ""}
                  </p>
                </div>
                <button
                  onClick={() => removePost(i)}
                  className="shrink-0 rounded p-2 text-neutral-500 transition-colors hover:bg-red-500/20 hover:text-red-400"
                  aria-label="删除"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={savePosts}
            disabled={saving}
            className="mt-4 inline-flex items-center gap-2 rounded-sm border border-white/15 bg-white/[0.05] px-6 py-2.5 text-xs uppercase tracking-[0.25em] transition-all hover:border-white/40 hover:bg-white/[0.1] disabled:opacity-50"
          >
            <Save size={14} /> 保存文章列表
          </button>
        </Section>
      </div>
    </div>
  );
}

function Section({
  title,
  desc,
  children,
}: {
  title: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.03] p-6">
      <h2 className="mb-1 text-base font-medium tracking-wider">{title}</h2>
      {desc && <p className="mb-4 text-xs text-neutral-500">{desc}</p>}
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function DropZone({
  hint,
  onFiles,
}: {
  hint: string;
  onFiles: (files: File[]) => void;
}) {
  const [over, setOver] = useState(false);
  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        onFiles(Array.from(e.dataTransfer.files));
      }}
      onClick={() => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.multiple = true;
        input.onchange = () => onFiles(Array.from(input.files || []));
        input.click();
      }}
      className={`flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed px-6 py-10 text-center text-sm transition-all ${
        over
          ? "border-white/60 bg-white/[0.08] text-white"
          : "border-white/15 text-neutral-500 hover:border-white/30 hover:text-neutral-300"
      }`}
    >
      <div>
        <Upload className="mx-auto mb-2" size={20} />
        {hint}
      </div>
    </div>
  );
}

function MediaGrid({
  items,
  onDelete,
}: {
  items: Media[];
  onDelete: (name: string) => void;
}) {
  if (items.length === 0)
    return (
      <p className="rounded border border-dashed border-white/10 py-8 text-center text-xs text-neutral-600">
        还没有图片，往上面的框里拖几张吧
      </p>
    );
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6">
      {items.map((m) => (
        <div key={m.path || m.name} className="group relative">
          <div className="aspect-square overflow-hidden rounded border border-white/10">
            <img src={m.url} alt="" className="h-full w-full object-cover" />
          </div>
          {m.path && m.path.includes("/") && (
            <span className="absolute left-1 top-1 rounded bg-black/60 px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-white">
              {m.path.split("/")[0]}
            </span>
          )}
          <button
            onClick={() => onDelete(m.path || m.name)}
            className="absolute right-1 top-1 hidden rounded-full bg-black/70 p-1.5 text-white transition-opacity group-hover:block"
            aria-label="删除"
          >
            <Trash2 size={12} />
          </button>
          <p className="mt-1 truncate text-[10px] text-neutral-500" title={m.name}>
            {m.name}
          </p>
        </div>
      ))}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs uppercase tracking-wider text-neutral-500">
        {label}
      </span>
      {textarea ? (
        <textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full rounded border border-white/15 bg-black/40 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-white/40"
        />
      ) : (
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded border border-white/15 bg-black/40 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-white/40"
        />
      )}
    </label>
  );
}
