import { Mail } from "lucide-react";
import site from "@/content/site.json";

export function Footer() {
  const { profile } = site;
  return (
    <footer className="border-t border-white/10 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white">
            {profile.name}
          </p>
          <p className="mt-1 text-xs text-neutral-500">
            © 2024 {profile.name}
          </p>
        </div>
        <div className="flex items-center gap-5">
          <a
            href={`mailto:${profile.email}`}
            className="text-neutral-400 transition-colors hover:text-white"
            aria-label="Email"
          >
            <Mail size={18} />
          </a>
          <a
            href={profile.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs uppercase tracking-[0.25em] text-neutral-400 transition-colors hover:text-white"
          >
            Instagram
          </a>
          <a
            href={profile.social.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs uppercase tracking-[0.25em] text-neutral-400 transition-colors hover:text-white"
          >
            Twitter
          </a>
          <a
            href={profile.social.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs uppercase tracking-[0.25em] text-neutral-400 transition-colors hover:text-white"
          >
            YouTube
          </a>
          <a
            href={profile.social.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs uppercase tracking-[0.25em] text-neutral-400 transition-colors hover:text-white"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
