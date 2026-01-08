/**
 * Professional Experience section component
 * Displays experiences from ProfileExperience table
 */

import { format } from "date-fns";
import { MarkdownContent } from "@/components/profile/markdown-content";

interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string | null;
  description: string | null;
  techStack: string[];
  location: string | null;
  order: number;
}

interface ProfessionalExperienceSectionProps {
  experiences: Experience[];
}

export function ProfessionalExperienceSection({
  experiences,
}: ProfessionalExperienceSectionProps) {
  if (!experiences || experiences.length === 0) {
    return null;
  }

  return (
    <section className="mb-16">
      <h2 className="mb-6 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
        Experience
      </h2>
      <div className="space-y-10">
        {experiences.map((exp) => {
          const startDate = exp.startDate ? new Date(exp.startDate) : null;
          const endDate = exp.endDate ? new Date(exp.endDate) : null;
          const isCurrent = exp.endDate === null;

          return (
            <div key={exp.id} className="flex gap-6">
              <div className="w-20 shrink-0 text-sm font-medium text-gray-500 dark:text-gray-500">
                {startDate
                  ? format(startDate, "yyyy")
                  : exp.startDate?.substring(0, 4) || ""}
                {isCurrent
                  ? ""
                  : endDate
                    ? `-${format(endDate, "yyyy")}`
                    : exp.endDate
                      ? `-${exp.endDate.substring(0, 4)}`
                      : ""}
              </div>
              <div className="flex-1">
                <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                  {exp.role}
                </h3>
                <p className="mb-3 text-base text-gray-700 dark:text-gray-300">
                  {exp.company}
                </p>
                {exp.description && (
                  <div className="prose prose-sm dark:prose-invert max-w-none leading-relaxed text-gray-600 dark:text-gray-400">
                    <MarkdownContent content={exp.description} />
                  </div>
                )}
                {exp.techStack && exp.techStack.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {exp.techStack.map((tech: string, i: number) => (
                      <span
                        key={i}
                        className="rounded-md bg-gray-100 px-2.5 py-1 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
