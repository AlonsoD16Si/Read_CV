/**
 * Profile creator component
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { validateUsername } from "@/lib/utils";

const defaultMDXTemplate = `---
title: Your Name
description: A brief description about yourself
image: /images/profile.jpg
location: Your Location
email: your@email.com
website: https://yourwebsite.com
twitter: yourusername
github: yourusername
linkedin: yourusername
keywords: []
published: false
---

# About

Write about yourself here.

## Experience

### Job Title at Company
**Date Range**

Description of your role and achievements.

## Projects

### Project Name
Description of your project.

## Skills

- Skill 1
- Skill 2
- Skill 3
`;

export function ProfileCreator({ userId }: { userId: string }) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim()) {
      setError("Username is required");
      return;
    }

    if (!validateUsername(username)) {
      setError(
        "Username must be 3-20 characters, lowercase letters, numbers, and hyphens only"
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/profile/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.toLowerCase(),
          content: defaultMDXTemplate,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to create profile");
        return;
      }

      router.push("/dashboard/profile/edit");
      router.refresh();
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Choose Your Username</CardTitle>
        <CardDescription>
          This will be your profile URL: nexary.com/u/{username || "username"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-200">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">
              Username
            </label>
            <Input
              id="username"
              type="text"
              placeholder="johndoe"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
              required
            />
            <p className="text-xs text-gray-600 dark:text-gray-400">
              3-20 characters, lowercase letters, numbers, and hyphens only
            </p>
          </div>
        </CardContent>
        <div className="border-t border-gray-200 p-6 dark:border-gray-800">
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Profile"}
          </Button>
        </div>
      </form>
    </Card>
  );
}

