import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import posts from "@/content/posts.json";

export function generateStaticParams() {
  return posts.posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = posts.posts.find((p) => p.slug === slug);
  return { title: post ? post.title : "Post" };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = posts.posts.find((p) => p.slug === slug);
  if (!post) notFound();

  const paragraphs = post.content
    .split("\n")
    .map((s) => s.trim())
    .filter((s) => s !== "");

  return (
    <article className="mx-auto max-w-3xl px-6 pb-24 pt-28">
      <Link
        href="/blog"
        className="text-xs uppercase tracking-[0.25em] text-neutral-400 transition-colors hover:text-white"
      >
        ← Back to Journal
      </Link>
      <h1 className="mt-6 text-4xl font-semibold tracking-wide text-neutral-100 md:text-5xl">
        {post.title}
      </h1>
      <p className="mt-3 text-sm text-neutral-500">{post.date}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {post.tags.map((t) => (
          <Badge key={t}>{t}</Badge>
        ))}
      </div>
      <div className="mt-10 space-y-6 text-base leading-8 text-neutral-300">
        {paragraphs.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
    </article>
  );
}
