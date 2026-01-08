/**
 * Section-based profile editor
 * Allows editing Profile fields and sections
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProfileSection } from "@/lib/profile-sections";
import { ExperienceEditor } from "./experience-editor";
import { PhotoUpload } from "./photo-upload";

interface Profile {
  id: string;
  username: string;
  published: boolean;
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
  experiences?: Array<{
    id: string;
    company: string;
    role: string;
    startDate: string;
    endDate: string | null;
    description: string;
    techStack: string[];
    location?: string | null;
    order: number;
  }>;
  sections?: ProfileSection[];
}

export function SectionBasedEditor({ profile }: { profile: Profile }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [published, setPublished] = useState(profile.published);

  // Profile fields
  const [displayName, setDisplayName] = useState(profile.displayName || "");
  const [headline, setHeadline] = useState(profile.headline || "");
  const [location, setLocation] = useState(profile.location || "");
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(
    profile.profilePhotoUrl || ""
  );
  const [accentColor, setAccentColor] = useState(
    profile.accentColor || "#3b82f6"
  );
  const [layoutStyle, setLayoutStyle] = useState(
    profile.layoutStyle || "minimal"
  );

  // Social links
  const [githubUrl, setGithubUrl] = useState(profile.githubUrl || "");
  const [linkedinUrl, setLinkedinUrl] = useState(profile.linkedinUrl || "");
  const [websiteUrl, setWebsiteUrl] = useState(profile.websiteUrl || "");
  const [twitterUrl, setTwitterUrl] = useState(profile.twitterUrl || "");

  // Experiences - normalize techStack to ensure it's always an array
  const [experiences, setExperiences] = useState(
    (profile.experiences || []).map((exp: any) => ({
      ...exp,
      techStack: Array.isArray(exp.techStack) ? exp.techStack : [],
    }))
  );

  useEffect(() => {
    setPublished(profile.published);
    setDisplayName(profile.displayName || "");
    setHeadline(profile.headline || "");
    setLocation(profile.location || "");
    setProfilePhotoUrl(profile.profilePhotoUrl || "");
    setAccentColor(profile.accentColor || "#3b82f6");
    setLayoutStyle(profile.layoutStyle || "minimal");
    setGithubUrl(profile.githubUrl || "");
    setLinkedinUrl(profile.linkedinUrl || "");
    setWebsiteUrl(profile.websiteUrl || "");
    setTwitterUrl(profile.twitterUrl || "");
    setExperiences(
      (profile.experiences || []).map((exp: any) => ({
        ...exp,
        techStack: Array.isArray(exp.techStack) ? exp.techStack : [],
      }))
    );
  }, [profile]);

  const handleSave = async () => {
    setError("");
    setLoading(true);

    try {
      const experiencesToSave = experiences
        .filter((exp) => exp.company && exp.role)
        .map((exp) => ({
          ...exp,
          techStack: Array.isArray(exp.techStack) ? exp.techStack : [],
        }));

      console.log(
        "[Editor] Saving experiences:",
        experiencesToSave.map((exp) => ({
          company: exp.company,
          role: exp.role,
          techStack: exp.techStack,
          techStackType: typeof exp.techStack,
          techStackIsArray: Array.isArray(exp.techStack),
        }))
      );

      const response = await fetch(`/api/profile/${profile.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          published,
          displayName: displayName || null,
          headline: headline || null,
          location: location || null,
          profilePhotoUrl:
            profilePhotoUrl && profilePhotoUrl.trim() ? profilePhotoUrl : null,
          accentColor: accentColor || null,
          layoutStyle: layoutStyle || null,
          githubUrl: githubUrl && githubUrl.trim() ? githubUrl : null,
          linkedinUrl: linkedinUrl && linkedinUrl.trim() ? linkedinUrl : null,
          websiteUrl: websiteUrl && websiteUrl.trim() ? websiteUrl : null,
          twitterUrl: twitterUrl && twitterUrl.trim() ? twitterUrl : null,
          experiences: experiencesToSave,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("[Editor] API Error Response:", data);
        const errorMessage =
          data.details && Array.isArray(data.details) && data.details.length > 0
            ? `${data.error}: ${data.details.map((d: any) => `${d.path.join(".")} - ${d.message}`).join(", ")}`
            : data.error || "Failed to save profile";
        setError(errorMessage);
        return;
      }

      router.refresh();
    } catch (err: any) {
      console.error("[Editor] Save error:", err);
      setError(`An error occurred: ${err.message || "Please try again."}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>
            Configure your public resume appearance and information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-200">
              {error}
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="displayName" className="text-sm font-medium">
                Display Name
              </label>
              <Input
                id="displayName"
                type="text"
                placeholder="John Doe"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Name shown on your profile (defaults to username if empty)
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="headline" className="text-sm font-medium">
                Professional Headline
              </label>
              <Input
                id="headline"
                type="text"
                placeholder="Senior Software Engineer"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
              />
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Your professional title or tagline
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="location" className="text-sm font-medium">
                Location
              </label>
              <Input
                id="location"
                type="text"
                placeholder="San Francisco, CA"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Profile Photo</label>
              <PhotoUpload
                currentPhotoUrl={profilePhotoUrl}
                onUploadComplete={(url) => setProfilePhotoUrl(url)}
                profileId={profile.id}
              />
              <div className="mt-2">
                <p className="mb-2 text-xs text-gray-600 dark:text-gray-400">
                  Or enter a URL manually:
                </p>
                <Input
                  id="profilePhotoUrl"
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  value={profilePhotoUrl}
                  onChange={(e) => setProfilePhotoUrl(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="accentColor" className="text-sm font-medium">
                Accent Color
              </label>
              <div className="flex gap-2">
                <Input
                  id="accentColor"
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="h-10 w-20"
                />
                <Input
                  type="text"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  placeholder="#3b82f6"
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="layoutStyle" className="text-sm font-medium">
                Layout Style
              </label>
              <select
                id="layoutStyle"
                value={layoutStyle}
                onChange={(e) => setLayoutStyle(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white p-2 dark:border-gray-700 dark:bg-gray-900"
              >
                <option value="minimal">Minimal</option>
                <option value="modern">Modern</option>
                <option value="compact">Compact</option>
              </select>
            </div>
          </div>

          {/* Social Links */}
          <div className="border-t border-gray-200 pt-6 dark:border-gray-800">
            <h3 className="mb-4 text-lg font-semibold">Social Links</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="githubUrl" className="text-sm font-medium">
                  GitHub
                </label>
                <Input
                  id="githubUrl"
                  type="url"
                  placeholder="https://github.com/username"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="linkedinUrl" className="text-sm font-medium">
                  LinkedIn
                </label>
                <Input
                  id="linkedinUrl"
                  type="url"
                  placeholder="https://linkedin.com/in/username"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="websiteUrl" className="text-sm font-medium">
                  Website/Portfolio
                </label>
                <Input
                  id="websiteUrl"
                  type="url"
                  placeholder="https://yourwebsite.com"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="twitterUrl" className="text-sm font-medium">
                  Twitter/X
                </label>
                <Input
                  id="twitterUrl"
                  type="url"
                  placeholder="https://twitter.com/username"
                  value={twitterUrl}
                  onChange={(e) => setTwitterUrl(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <span className="text-sm font-medium">Publish profile</span>
            </label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
            {profile.username && (
              <Button
                variant="outline"
                onClick={() =>
                  window.open(
                    `/u/${profile.username}${published ? "" : "?preview=1"}`,
                    "_blank"
                  )
                }
              >
                Preview
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Professional Experience */}
      <Card>
        <CardHeader>
          <CardTitle>Professional Experience</CardTitle>
          <CardDescription>
            Add up to 3 professional experiences to showcase your career
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ExperienceEditor
            experiences={experiences}
            onChange={setExperiences}
            maxExperiences={3}
          />
        </CardContent>
      </Card>

      {/* Sections Info */}
      <Card>
        <CardHeader>
          <CardTitle>Sections</CardTitle>
          <CardDescription>
            Your profile has {profile.sections?.length || 0} section
            {profile.sections?.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Section editing will be available in a future update. For now, you
            can preview your profile and adjust the settings above.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
