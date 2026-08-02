import { Hero } from "@/components/hero";
import { SelectedWorks } from "@/components/selected-works";
import { Footer } from "@/components/footer";
import { BlogCard } from "@/components/blog-card";
import posts from "@/content/posts.json";

export default function Home() {
  const latest = [...posts.posts]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3);

  return (
    <>
      <Hero />
      <SelectedWorks />
      <section className="border-t border-white/10 bg-neutral-950 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10">
            <h2 className="text-3xl font-semibold uppercase tracking-[0.25em] text-neutral-100 md:text-4xl">
              Latest Thoughts
            </h2>
            <div className="section-rule mt-4" />
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {latest.map((p) => (
              <BlogCard key={p.id} post={p} />
            ))}
          </div>
          <div className="mt-12 flex justify-center">
            <a
              href="/blog"
              className="inline-flex items-center justify-center rounded-sm border border-white/15 bg-white/[0.03] px-6 py-3 text-xs uppercase tracking-[0.25em] text-neutral-100 backdrop-blur-md transition-all hover:border-white/40 hover:bg-white/[0.08]"
            >
              Read All
            </a>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
