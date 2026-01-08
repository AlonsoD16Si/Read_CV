/**
 * Landing page
 */

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { generateSiteMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import {
  FiTarget,
  FiTrendingUp,
  FiSearch,
  FiBriefcase,
} from "react-icons/fi";
import { FaRocket } from "react-icons/fa";

export const metadata: Metadata = generateSiteMetadata(
  "Nexary - Your Professional Identity Platform",
  "Nexary is your professional identity platform. Create a living, breathing representation of your career that's optimized to be found, understood, and hired."
);

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl">
          Your Professional Identity,
          <br />
          <span className="text-blue-600 dark:text-blue-400">Optimized</span>
        </h1>
        <p className="mb-4 text-xl text-gray-600 dark:text-gray-400">
          Nexary Identity is not a CV. It's your professional identity platform.
        </p>
        <p className="mb-12 text-lg text-gray-500 dark:text-gray-500">
          Create a living, breathing representation of your career that's optimized
          to be found, understood, and hired.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/register">
            <Button size="lg">Create My Profile</Button>
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
            <h3 className="mb-2 text-xl font-semibold">Professional Identity</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Not just a CV. A complete professional identity with timeline,
              projects, metrics, and more.
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-800">
            <h3 className="mb-2 text-xl font-semibold">SEO-First</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Built for discovery. Real indexing, rich snippets, and metadata
              optimization to be found by recruiters.
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-800">
            <h3 className="mb-2 text-xl font-semibold">Modular Sections</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Build your profile with flexible sections: Hero, Experience,
              Projects, Metrics, and custom MDX blocks.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-4xl text-center">
  <h2 className="mb-4 text-3xl font-bold">Why Nexary Identity?</h2>

  <div className="mt-8 grid gap-6 md:grid-cols-2">
    <div className="text-left">
      <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold">
        <FiTarget className="text-blue-600 dark:text-blue-400" />
        Optimized for Hiring
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Recruiter mode, skill highlights, and analytics to help you get hired.
      </p>
    </div>

    <div className="text-left">
      <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold">
        <FiTrendingUp className="text-blue-600 dark:text-blue-400" />
        Always Evolving
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Your professional identity is a living document, not a static CV.
      </p>
    </div>

    <div className="text-left">
      <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold">
        <FiSearch className="text-blue-600 dark:text-blue-400" />
        Discoverable
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        SEO-optimized to rank in search results and be found by the right people.
      </p>
    </div>

    <div className="text-left">
      <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold">
        <FiBriefcase className="text-blue-600 dark:text-blue-400" />
        Professional Branding
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Custom domains, themes, and full control over your professional presence.
      </p>
    </div>
  </div>
</div>

    </div>
  );
}

