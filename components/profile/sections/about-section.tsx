/**
 * About section component
 */

import { AboutSection as AboutSectionType } from "@/lib/profile-sections";
import { MarkdownContent } from "@/components/profile/markdown-content";

interface AboutSectionProps {
  section: AboutSectionType;
}

export function AboutSection({ section }: AboutSectionProps) {
  // Support both new schema (summary) and legacy (bio) for backward compatibility
  const content = section.content.summary || (section.content as any).bio || "";

  if (!content) {
    return null;
  }

  return (
    <section className="mb-16">
      <h2 className="mb-6 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
        About
      </h2>
      <div className="prose prose-lg dark:prose-invert max-w-none leading-relaxed text-gray-700 dark:text-gray-300">
        <MarkdownContent content={content} />
      </div>
    </section>
  );
}
