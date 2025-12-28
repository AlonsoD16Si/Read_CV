/**
 * Landing page
 */

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { generateSiteMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = generateSiteMetadata(
  "Create Beautiful Professional Profiles",
  "Build your professional profile with MDX. Minimal, SEO-optimized, and beautiful."
);

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl">
          Create Beautiful
          <br />
          Professional Profiles
        </h1>
        <p className="mb-12 text-xl text-gray-600 dark:text-gray-400">
          Build your professional profile with MDX. Minimal, SEO-optimized, and
          beautiful. Owned by Nexary.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/register">
            <Button size="lg">Get Started Free</Button>
          </Link>
          <Link href="/pricing">
            <Button variant="outline" size="lg">
              View Pricing
            </Button>
          </Link>
        </div>
      </div>

      <div className="mx-auto mt-32 max-w-6xl">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-800">
            <h3 className="mb-2 text-xl font-semibold">MDX-Powered</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Write your profile in MDX for maximum flexibility and control.
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-800">
            <h3 className="mb-2 text-xl font-semibold">SEO Optimized</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Built-in SEO optimization to help your profile rank higher.
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-800">
            <h3 className="mb-2 text-xl font-semibold">Minimal Design</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Clean, minimal design that puts your content first.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

