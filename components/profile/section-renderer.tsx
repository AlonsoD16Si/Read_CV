/**
 * Section renderer - renders different section types
 */

import { ProfileSection } from "@/lib/profile-sections";
import { HeroSection } from "./sections/hero-section";
import { AboutSection } from "./sections/about-section";
import { ExperienceSection } from "./sections/experience-section";
import { LinksSection } from "./sections/links-section";

interface SectionRendererProps {
  section: ProfileSection;
  profile?: {
    displayName?: string | null;
    headline?: string | null;
    location?: string | null;
    profilePhotoUrl?: string | null;
    accentColor?: string | null;
    layoutStyle?: string | null;
    githubUrl?: string | null;
    linkedinUrl?: string | null;
    websiteUrl?: string | null;
    twitterUrl?: string | null;
  };
}

export function SectionRenderer({ section, profile }: SectionRendererProps) {
  switch (section.type) {
    case "hero":
      return <HeroSection section={section as any} profile={profile} />;
    case "about":
      return <AboutSection section={section as any} />;
    case "experience":
      return <ExperienceSection section={section as any} />;
    case "links":
      return <LinksSection section={section as any} />;
    // TODO: Add more section types (education, skills, projects, etc.)
    default:
      return (
        <div className="mb-12 rounded-lg border border-gray-200 p-4 dark:border-gray-800">
          <p className="text-sm text-gray-500">
            Section type "{section.type}" is not yet implemented
          </p>
        </div>
      );
  }
}
