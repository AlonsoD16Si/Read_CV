/**
 * Experience editor component - allows adding/editing up to 3 professional experiences
 */

"use client";

import { useState, KeyboardEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,

  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Experience {
  id?: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string | null;
  description: string;
  techStack: string[];
  location?: string | null;
  order: number;
}

interface ExperienceEditorProps {
  experiences: Experience[];
  onChange: (experiences: Experience[]) => void;
  maxExperiences?: number;
}

export function ExperienceEditor({
  experiences,
  onChange,
  maxExperiences = 3,
}: ExperienceEditorProps) {
  const [localExperiences, setLocalExperiences] = useState<Experience[]>(
    experiences.length > 0
      ? experiences
      : [
          {
            company: "",
            role: "",
            startDate: "",
            endDate: null,
            description: "",
            techStack: [],
            order: 0,
          },
        ]
  );

  // Sync local state with props when experiences change
  useEffect(() => {
    if (experiences.length > 0) {
      setLocalExperiences(experiences);
    } else if (localExperiences.length === 0) {
      setLocalExperiences([
        {
          company: "",
          role: "",
          startDate: "",
          endDate: null,
          description: "",
          techStack: [],
          order: 0,
        },
      ]);
    }
  }, [experiences]);

  const updateExperience = (
    index: number,
    field: keyof Experience,
    value: any
  ) => {
    const updated = [...localExperiences];
    updated[index] = { ...updated[index], [field]: value };
    setLocalExperiences(updated);
    // Ensure techStack is always an array when updating
    onChange(
      updated.map((exp) => ({
        ...exp,
        techStack: Array.isArray(exp.techStack) ? exp.techStack : [],
      }))
    );
  };

  const addExperience = () => {
    if (localExperiences.length >= maxExperiences) return;
    const newExp: Experience = {
      company: "",
      role: "",
      startDate: "",
      endDate: null,
      description: "",
      techStack: [],
      order: localExperiences.length,
    };
    const updated = [...localExperiences, newExp];
    setLocalExperiences(updated);
    onChange(updated);
  };

  const removeExperience = (index: number) => {
    const updated = localExperiences.filter((_, i) => i !== index);
    setLocalExperiences(updated);
    onChange(updated);
  };

  const addTechToStack = (index: number, tech: string) => {
    const trimmedTech = tech.trim();
    if (!trimmedTech) return;

    const updated = [...localExperiences];
    const currentStack = Array.isArray(updated[index].techStack)
      ? updated[index].techStack
      : [];

    // Avoid duplicates
    if (!currentStack.includes(trimmedTech)) {
      updated[index] = {
        ...updated[index],
        techStack: [...currentStack, trimmedTech],
      };
      setLocalExperiences(updated);
      // Ensure we pass a fresh copy with proper techStack array
      onChange(
        updated.map((exp) => ({
          ...exp,
          techStack: Array.isArray(exp.techStack) ? exp.techStack : [],
        }))
      );
    }
  };

  const removeTechFromStack = (index: number, techToRemove: string) => {
    const updated = [...localExperiences];
    const currentStack = Array.isArray(updated[index].techStack)
      ? updated[index].techStack
      : [];
    updated[index] = {
      ...updated[index],
      techStack: currentStack.filter((tech) => tech !== techToRemove),
    };
    setLocalExperiences(updated);
    // Ensure we pass a fresh copy with proper techStack array
    onChange(
      updated.map((exp) => ({
        ...exp,
        techStack: Array.isArray(exp.techStack) ? exp.techStack : [],
      }))
    );
  };

  const handleTechInputKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    index: number,
    inputValue: string
  ) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (inputValue.trim()) {
        addTechToStack(index, inputValue);
        // Clear input
        const input = e.currentTarget;
        input.value = "";
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Professional Experience</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Add up to {maxExperiences} professional experiences
          </p>
        </div>
        {localExperiences.length < maxExperiences && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addExperience}
          >
            + Add Experience
          </Button>
        )}
      </div>

      {localExperiences.map((exp, index) => (
        <Card key={index}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                Experience {index + 1}
              </CardTitle>
              {localExperiences.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeExperience(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  Remove
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Company *</label>
                <Input
                  value={exp.company}
                  onChange={(e) =>
                    updateExperience(index, "company", e.target.value)
                  }
                  placeholder="Company Name"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Role/Title *</label>
                <Input
                  value={exp.role}
                  onChange={(e) =>
                    updateExperience(index, "role", e.target.value)
                  }
                  placeholder="Software Engineer"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Start Date *</label>
                <Input
                  type="month"
                  value={exp.startDate}
                  onChange={(e) =>
                    updateExperience(index, "startDate", e.target.value)
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">End Date</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="month"
                    value={exp.endDate || ""}
                    onChange={(e) =>
                      updateExperience(index, "endDate", e.target.value || null)
                    }
                    placeholder="Leave empty if current"
                  />
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={exp.endDate === null}
                      onChange={(e) =>
                        updateExperience(
                          index,
                          "endDate",
                          e.target.checked ? null : ""
                        )
                      }
                    />
                    Current
                  </label>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Input
                  value={exp.location || ""}
                  onChange={(e) =>
                    updateExperience(index, "location", e.target.value || null)
                  }
                  placeholder="San Francisco, CA"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Tech Stack</label>

                {/* Tech Stack Chips */}
                {exp.techStack && exp.techStack.length > 0 && (
                  <div className="mb-2 flex flex-wrap gap-2">
                    {exp.techStack.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="inline-flex items-center gap-1.5 rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                      >
                        {tech}
                        <button
                          type="button"
                          onClick={() => removeTechFromStack(index, tech)}
                          className="ml-1 rounded-full p-0.5 transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
                          aria-label={`Remove ${tech}`}
                        >
                          <svg
                            className="h-3 w-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Tech Stack Input */}
                <Input
                  placeholder="Type a technology and press Enter or comma"
                  onKeyDown={(e) => {
                    const input = e.currentTarget;
                    handleTechInputKeyDown(e, index, input.value);
                  }}
                  onBlur={(e) => {
                    if (e.target.value.trim()) {
                      addTechToStack(index, e.target.value);
                      e.target.value = "";
                    }
                  }}
                />
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Type a technology and press Enter or comma to add it
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea
                value={exp.description}
                onChange={(e) =>
                  updateExperience(index, "description", e.target.value)
                }
                rows={4}
                className="w-full rounded-md border border-gray-300 bg-white p-3 dark:border-gray-700 dark:bg-gray-900"
                placeholder="Describe your role, achievements, and responsibilities..."
              />
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Markdown formatting supported
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
