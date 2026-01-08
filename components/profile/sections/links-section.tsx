/**
 * Links section component
 */

import { LinksSection as LinksSectionType } from "@/lib/profile-sections";

interface LinksSectionProps {
  section: LinksSectionType;
}

export function LinksSection({ section }: LinksSectionProps) {
  // Support both new schema (items) and legacy (links) for backward compatibility
  const items = section.content.items || (section.content as any).links || [];

  if (!items || items.length === 0) {
    return null;
  }

  const getLinkLabel = (item: any) => {
    if (item.label) return item.label;
    const typeLabels: Record<string, string> = {
      github: "GitHub",
      linkedin: "LinkedIn",
      portfolio: "Portfolio",
      email: "Email",
      twitter: "Twitter",
      other: "Link",
    };
    return typeLabels[item.type] || item.type || "Link";
  };

  const getLinkIcon = (item: any) => {
    if (item.icon) return item.icon;
    const icons: Record<string, string> = {
      github: "🔗",
      linkedin: "💼",
      portfolio: "🌐",
      email: "✉️",
      twitter: "🐦",
    };
    return icons[item.type] || "🔗";
  };

  return (
    <section className="mb-16">
      <h2 className="mb-6 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
        Links
      </h2>
      <div className="flex flex-wrap gap-3">
        {items.map((item: any, index: number) => (
          <a
            key={index}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-gray-700 underline decoration-gray-300 transition-colors hover:text-gray-900 hover:decoration-gray-500 dark:text-gray-300 dark:decoration-gray-600 dark:hover:text-white dark:hover:decoration-gray-400"
          >
            {getLinkLabel(item)}
            <span className="text-xs">↗</span>
          </a>
        ))}
      </div>
    </section>
  );
}
