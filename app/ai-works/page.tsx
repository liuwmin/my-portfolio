import aiWorks from "@/content/ai-works.json";
import { AIGrid } from "@/components/ai-grid";

export const metadata = { title: "AI Works" };

export default function AIWorksPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-28">
      <div className="mb-10 flex items-center gap-4">
        <span className="h-10 w-[3px] bg-white/70" />
        <h1 className="text-4xl font-semibold uppercase tracking-[0.25em] text-neutral-100 md:text-6xl">
          AI Works
        </h1>
      </div>
      <AIGrid data={aiWorks.works} />
    </div>
  );
}
