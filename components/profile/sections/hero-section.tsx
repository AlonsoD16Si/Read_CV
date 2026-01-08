/**
 * Hero section component
 */

import { HeroSection as HeroSectionType } from "@/lib/profile-sections";

interface HeroSectionProps {
  section: HeroSectionType;
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

export function HeroSection({ section, profile }: HeroSectionProps) {
  const {
    fullName,
    title,
    tagline,
    location: sectionLocation,
    avatar,
    bio,
  } = section.content;

  // Use Profile fields as fallback/override for section fields
  // Priority: Profile fields > Section fields > Legacy fields
  const name =
    profile?.displayName || fullName || (section.content as any).name || "";
  const role =
    profile?.headline || title || (section.content as any).role || "";
  const location = profile?.location || sectionLocation || "";
  const photoUrl = profile?.profilePhotoUrl || avatar || "";
  const displayTagline = tagline || "";

  // Apply accent color if available
  const accentColorStyle = profile?.accentColor
    ? { color: profile.accentColor }
    : {};

  return (
    <header className="mb-16 border-b border-gray-200 pb-8 dark:border-gray-800">
      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        {photoUrl && (
          <img
            src={photoUrl}
            alt={name}
            className="h-24 w-24 shrink-0 rounded-full object-cover"
          />
        )}
        <div className="flex-1">
          <h1
            className="mb-3 text-5xl font-bold tracking-tight text-gray-900 dark:text-white"
            style={accentColorStyle}
          >
            {name}
          </h1>
          <div className="space-y-1 text-base text-gray-600 dark:text-gray-400">
            {role && (
              <p className="font-medium">
                {role}
                {location && ` in ${location}`}
              </p>
            )}
            {!role && location && <p className="font-medium">{location}</p>}
            {displayTagline && (
              <p className="text-gray-500 italic dark:text-gray-500">
                {displayTagline}
              </p>
            )}
          </div>
          {bio && (
            <p className="mt-4 leading-relaxed text-gray-700 dark:text-gray-300">
              {bio}
            </p>
          )}

          {/* Social Links */}
          {(profile?.githubUrl ||
            profile?.linkedinUrl ||
            profile?.websiteUrl ||
            profile?.twitterUrl) && (
            <div className="mt-4 flex flex-wrap gap-3">
              {profile.websiteUrl && (
                <a
                  href={profile.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 underline decoration-gray-300 transition-colors hover:text-gray-900 hover:decoration-gray-500 dark:text-gray-400 dark:decoration-gray-600 dark:hover:text-white dark:hover:decoration-gray-400"
                >
                  {profile.websiteUrl
                    .replace(/^https?:\/\//, "")
                    .replace(/\/$/, "")}
                </a>
              )}
              {profile.githubUrl && (
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 underline decoration-gray-300 transition-colors hover:text-gray-900 hover:decoration-gray-500 dark:text-gray-400 dark:decoration-gray-600 dark:hover:text-white dark:hover:decoration-gray-400"
                >
                  GitHub
                </a>
              )}
              {profile.linkedinUrl && (
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 underline decoration-gray-300 transition-colors hover:text-gray-900 hover:decoration-gray-500 dark:text-gray-400 dark:decoration-gray-600 dark:hover:text-white dark:hover:decoration-gray-400"
                >
                  LinkedIn
                </a>
              )}
              {profile.twitterUrl && (
                <a
                  href={profile.twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 underline decoration-gray-300 transition-colors hover:text-gray-900 hover:decoration-gray-500 dark:text-gray-400 dark:decoration-gray-600 dark:hover:text-white dark:hover:decoration-gray-400"
                >
                  Twitter
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
