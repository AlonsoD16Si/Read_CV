/**
 * Profile editor component
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { parseMDX, validateFrontmatter } from "@/lib/mdx";

interface Profile {
  id: string;
  username: string;
  content: string;
  published: boolean;
}

export function ProfileEditor({ profile }: { profile: Profile }) {
  const router = useRouter();
  const [content, setContent] = useState(profile.content);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [published, setPublished] = useState(profile.published);

  useEffect(() => {
    setContent(profile.content);
    setPublished(profile.published);
  }, [profile]);

  const handleSave = async () => {
    setError("");

    try {
      const parsed = parseMDX(content);
      const validation = validateFrontmatter(parsed.frontmatter);

      if (!validation.valid) {
        setError(validation.errors.join(", "));
        return;
      }

      setLoading(true);

      const response = await fetch(`/api/profile/${profile.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          published,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to save profile");
        return;
      }

      router.refresh();
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
          <CardDescription>
            Edit your MDX profile content. Changes are saved automatically.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-200">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-medium">
              MDX Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[600px] w-full rounded-md border border-gray-300 bg-white p-4 font-mono text-sm dark:border-gray-700 dark:bg-gray-900"
              spellCheck={false}
            />
          </div>
          <div className="flex items-center gap-4">
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
          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
            {published && profile.username && (
              <Button
                variant="outline"
                onClick={() =>
                  window.open(`/u/${profile.username}`, "_blank")
                }
              >
                Preview
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

