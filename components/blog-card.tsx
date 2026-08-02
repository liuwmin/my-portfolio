"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

export type Post = {
  id: string;
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  tags: string[];
};

export function BlogCard({ post }: { post: Post }) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.3 }} className="h-full">
      <Link
        href={`/blog/${post.slug}`}
        className="flex h-full flex-col rounded-lg border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl transition-colors duration-300 hover:border-white/30"
      >
        <p className="text-xs text-neutral-500">{post.date}</p>
        <h3 className="mt-2 text-lg font-medium tracking-wide text-neutral-100">
          {post.title}
        </h3>
        <p className="mt-3 line-clamp-2 flex-1 text-sm text-neutral-400">
          {post.excerpt}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags.map((t) => (
            <Badge key={t}>{t}</Badge>
          ))}
        </div>
      </Link>
    </motion.div>
  );
}
