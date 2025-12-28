/**
 * Profile renderer component
 */

import { ProfileFrontmatter } from "@/lib/mdx";
import { siteConfig } from "@/config/site";
import Link from "next/link";

interface ProfileRendererProps {
  frontmatter: ProfileFrontmatter;
  children: React.ReactNode;
}

export function ProfileRenderer({
  frontmatter,
  children,
}: ProfileRendererProps) {
  return (
    <article className="prose prose-lg dark:prose-invert max-w-none">
      <header className="mb-12">
        <h1 className="mb-4 text-4xl font-bold">{frontmatter.title}</h1>
        {frontmatter.description && (
          <p className="text-xl text-gray-600 dark:text-gray-400">
            {frontmatter.description}
          </p>
        )}

        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          {frontmatter.location && (
            <span className="text-gray-600 dark:text-gray-400">
              📍 {frontmatter.location}
            </span>
          )}
          {frontmatter.email && (
            <a
              href={`mailto:${frontmatter.email}`}
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              ✉️ {frontmatter.email}
            </a>
          )}
          {frontmatter.website && (
            <a
              href={frontmatter.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              🌐 Website
            </a>
          )}
          {frontmatter.twitter && (
            <a
              href={`https://twitter.com/${frontmatter.twitter}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              🐦 Twitter
            </a>
          )}
          {frontmatter.github && (
            <a
              href={`https://github.com/${frontmatter.github}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              💻 GitHub
            </a>
          )}
          {frontmatter.linkedin && (
            <a
              href={`https://linkedin.com/in/${frontmatter.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              💼 LinkedIn
            </a>
          )}
        </div>
      </header>

      <div className="prose-content">{children}</div>

      <footer className="mt-16 border-t border-gray-200 pt-8 dark:border-gray-800">
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Powered by{" "}
          <Link
            href="/"
            className="font-medium text-black hover:underline dark:text-white"
          >
            {siteConfig.name}
          </Link>
        </p>
      </footer>
    </article>
  );
}

