import posts from "@/content/posts.json";
import { BlogCard } from "@/components/blog-card";

export const metadata = { title: "Journal" };

export default function BlogPage() {
  const sorted = [...posts.posts].sort((a, b) =>
    b.date.localeCompare(a.date)
  );
  return (
    <div className="mx-auto max-w-5xl px-6 pb-24 pt-28">
      <div className="mb-10 flex items-center gap-4">
        <span className="h-10 w-[3px] bg-white/70" />
        <h1 className="text-4xl font-semibold uppercase tracking-[0.25em] text-neutral-100 md:text-6xl">
          Journal
        </h1>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {sorted.map((p) => (
          <BlogCard key={p.id} post={p} />
        ))}
      </div>
    </div>
  );
}
