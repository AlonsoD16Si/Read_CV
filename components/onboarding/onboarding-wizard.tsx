/**
 * Onboarding wizard for new users
 * Guides users through: username → basic info → sections → publish
 */

"use client";

import { useState } from "react";
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
import { validateUsername } from "@/lib/utils";
import { getDefaultSections } from "@/lib/profile-sections";

type OnboardingStep = "username" | "hero" | "about" | "review" | "publish";

interface OnboardingData {
  username: string;
  // Profile fields
  displayName: string;
  headline: string;
  location: string;
  profilePhotoUrl: string;
  accentColor: string;
  layoutStyle: string;
  // Hero section (using new schema)
  hero: {
    fullName: string;
    title: string;
    tagline: string;
    location: string;
  };
  // About section (using new schema)
  about: {
    summary: string;
  };
}

export function OnboardingWizard({ userId }: { userId: string }) {
  const router = useRouter();
  const [step, setStep] = useState<OnboardingStep>("username");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<OnboardingData>({
    username: "",
    displayName: "",
    headline: "",
    location: "",
    profilePhotoUrl: "",
    accentColor: "#3b82f6",
    layoutStyle: "minimal",
    hero: {
      fullName: "",
      title: "",
      tagline: "",
      location: "",
    },
    about: {
      summary: "",
    },
  });

  const updateData = (
    section: "hero" | "about",
    field: string,
    value: string
  ) => {
    setData((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [field]: value,
      },
    }));
  };

  const handleNext = () => {
    setError("");

    if (step === "username") {
      if (!data.username.trim()) {
        setError("Username is required");
        return;
      }
      if (!validateUsername(data.username)) {
        setError(
          "Username must be 3-20 characters, lowercase letters, numbers, and hyphens only"
        );
        return;
      }
      setStep("hero");
    } else if (step === "hero") {
      if (!data.hero.fullName.trim() || !data.hero.title.trim()) {
        setError("Full name and title are required");
        return;
      }
      // Sync hero location to profile location if not set
      if (!data.location && data.hero.location) {
        setData((prev) => ({ ...prev, location: prev.hero.location }));
      }
      setStep("about");
    } else if (step === "about") {
      setStep("review");
    }
  };

  const handleBack = () => {
    if (step === "hero") setStep("username");
    else if (step === "about") setStep("hero");
    else if (step === "review") setStep("about");
  };

  const handlePublish = async (shouldPublish: boolean) => {
    setLoading(true);
    setError("");

    try {
      // Create profile with sections
      const defaultSections = getDefaultSections(userId);

      // Update hero section with new schema
      const heroSection = defaultSections[0];
      if (heroSection.type === "hero") {
        heroSection.content = {
          fullName: data.hero.fullName,
          title: data.hero.title,
          tagline: data.hero.tagline,
          location: data.hero.location,
        };
      }

      // Update about section with new schema
      const aboutSection = defaultSections[1];
      if (aboutSection.type === "about") {
        aboutSection.content = {
          summary: data.about.summary,
        };
      }

      const response = await fetch("/api/profile/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: data.username.toLowerCase(),
          sections: defaultSections,
          published: shouldPublish,
          // New Profile fields
          displayName: data.displayName || null,
          headline: data.headline || null,
          location: data.location || null,
          profilePhotoUrl: data.profilePhotoUrl || null,
          accentColor: data.accentColor || null,
          layoutStyle: data.layoutStyle || null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Failed to create profile");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: "username", label: "Username", number: 1 },
    { id: "hero", label: "Basic Info", number: 2 },
    { id: "about", label: "About", number: 3 },
    { id: "review", label: "Review", number: 4 },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === step);

  return (
    <div className="mx-auto max-w-2xl">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((s, index) => (
            <div key={s.id} className="flex flex-1 items-center">
              <div className="flex flex-1 flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                    index <= currentStepIndex
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-gray-300 text-gray-400"
                  }`}
                >
                  {index < currentStepIndex ? "✓" : s.number}
                </div>
                <span className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                  {s.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`mx-2 h-1 flex-1 ${
                    index < currentStepIndex ? "bg-blue-600" : "bg-gray-300"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {step === "username" && "Choose Your Username"}
            {step === "hero" && "Tell Us About Yourself"}
            {step === "about" && "Write Your Bio"}
            {step === "review" && "Review Your Profile"}
          </CardTitle>
          <CardDescription>
            {step === "username" &&
              `This will be your profile URL: nexary.dev/u/${data.username || "username"}`}
            {step === "hero" && "Let's start with the basics"}
            {step === "about" && "Add a brief bio to introduce yourself"}
            {step === "review" && "Review your profile before publishing"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-200">
              {error}
            </div>
          )}

          {/* Username Step */}
          {step === "username" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">
                  Username
                </label>
                <Input
                  id="username"
                  type="text"
                  placeholder="johndoe"
                  value={data.username}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      username: e.target.value.toLowerCase(),
                    }))
                  }
                  required
                />
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  3-20 characters, lowercase letters, numbers, and hyphens only
                </p>
              </div>
            </div>
          )}

          {/* Hero Step */}
          {step === "hero" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="fullName" className="text-sm font-medium">
                  Full Name *
                </label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={data.hero.fullName}
                  onChange={(e) =>
                    updateData("hero", "fullName", e.target.value)
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Professional Title *
                </label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Software Engineer"
                  value={data.hero.title}
                  onChange={(e) => updateData("hero", "title", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="tagline" className="text-sm font-medium">
                  Tagline
                </label>
                <Input
                  id="tagline"
                  type="text"
                  placeholder="Building amazing products"
                  value={data.hero.tagline}
                  onChange={(e) =>
                    updateData("hero", "tagline", e.target.value)
                  }
                />
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  A short one-liner about yourself
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
                  value={data.hero.location}
                  onChange={(e) => {
                    updateData("hero", "location", e.target.value);
                    // Also update profile location
                    setData((prev) => ({ ...prev, location: e.target.value }));
                  }}
                />
              </div>

              {/* Profile-level fields */}
              <div className="mt-6 border-t border-gray-200 pt-4 dark:border-gray-800">
                <h3 className="mb-4 text-sm font-semibold">
                  Additional Profile Settings
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label
                      htmlFor="displayName"
                      className="text-sm font-medium"
                    >
                      Display Name
                    </label>
                    <Input
                      id="displayName"
                      type="text"
                      placeholder="John Doe"
                      value={data.displayName}
                      onChange={(e) =>
                        setData((prev) => ({
                          ...prev,
                          displayName: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="headline" className="text-sm font-medium">
                      Headline
                    </label>
                    <Input
                      id="headline"
                      type="text"
                      placeholder="Senior Software Engineer"
                      value={data.headline}
                      onChange={(e) =>
                        setData((prev) => ({
                          ...prev,
                          headline: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="profilePhotoUrl"
                      className="text-sm font-medium"
                    >
                      Profile Photo URL
                    </label>
                    <Input
                      id="profilePhotoUrl"
                      type="url"
                      placeholder="https://example.com/photo.jpg"
                      value={data.profilePhotoUrl}
                      onChange={(e) =>
                        setData((prev) => ({
                          ...prev,
                          profilePhotoUrl: e.target.value,
                        }))
                      }
                    />
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      You can upload a photo after creating your profile
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="accentColor"
                      className="text-sm font-medium"
                    >
                      Accent Color
                    </label>
                    <div className="flex gap-2">
                      <Input
                        id="accentColor"
                        type="color"
                        value={data.accentColor}
                        onChange={(e) =>
                          setData((prev) => ({
                            ...prev,
                            accentColor: e.target.value,
                          }))
                        }
                        className="h-10 w-20"
                      />
                      <Input
                        type="text"
                        value={data.accentColor}
                        onChange={(e) =>
                          setData((prev) => ({
                            ...prev,
                            accentColor: e.target.value,
                          }))
                        }
                        placeholder="#3b82f6"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* About Step */}
          {step === "about" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="about-summary" className="text-sm font-medium">
                  Professional Summary
                </label>
                <textarea
                  id="about-summary"
                  rows={8}
                  className="w-full rounded-md border border-gray-300 bg-white p-3 dark:border-gray-700 dark:bg-gray-900"
                  placeholder="Tell us about yourself, your experience, and what you're passionate about..."
                  value={data.about.summary}
                  onChange={(e) =>
                    updateData("about", "summary", e.target.value)
                  }
                />
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  You can use Markdown formatting here
                </p>
              </div>
            </div>
          )}

          {/* Review Step */}
          {step === "review" && (
            <div className="space-y-6">
              <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-800">
                <h3 className="mb-4 text-lg font-semibold">Profile Preview</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Username
                    </p>
                    <p className="font-medium">nexary.dev/u/{data.username}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Full Name
                    </p>
                    <p className="font-medium">{data.hero.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Title
                    </p>
                    <p className="font-medium">{data.hero.title}</p>
                  </div>
                  {data.hero.tagline && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Tagline
                      </p>
                      <p className="font-medium">{data.hero.tagline}</p>
                    </div>
                  )}
                  {data.hero.location && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Location
                      </p>
                      <p className="font-medium">{data.hero.location}</p>
                    </div>
                  )}
                  {data.about.summary && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Summary
                      </p>
                      <p className="font-medium">
                        {data.about.summary.substring(0, 100)}...
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={step === "username" || loading}
            >
              Back
            </Button>
            {step === "review" ? (
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={async () => {
                    await handlePublish(false);
                  }}
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Save as Draft"}
                </Button>
                <Button
                  type="button"
                  onClick={async () => {
                    await handlePublish(true);
                  }}
                  disabled={loading}
                >
                  {loading ? "Publishing..." : "Publish Now"}
                </Button>
              </div>
            ) : (
              <Button type="button" onClick={handleNext} disabled={loading}>
                Next
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
