/**
 * Profile section types and utilities
 */

export type ProfileSectionType =
  | "hero"
  | "about"
  | "skills"
  | "experience"
  | "projects"
  | "education"
  | "links"
  | "certifications"
  | "mdx";

export interface BaseSection {
  id: string;
  type: ProfileSectionType;
  order: number;
}

// Hero Section - Standardized schema for public resume
export interface HeroSection extends BaseSection {
  type: "hero";
  content: {
    fullName: string; // Full name displayed at top
    title: string; // Professional title/role
    tagline?: string; // Short tagline/bio (one-liner)
    location?: string; // Geographic location
    avatar?: string; // Profile photo URL (deprecated, use Profile.profilePhotoUrl)
    bio?: string; // Extended bio (deprecated, use About section)
  };
}

// About Section - Standardized schema for public resume
export interface AboutSection extends BaseSection {
  type: "about";
  content: {
    summary: string; // Professional summary/bio (Markdown supported)
  };
}

// Experience Section - Standardized schema for public resume
export interface ExperienceSection extends BaseSection {
  type: "experience";
  content: {
    items: Array<{
      company: string;
      role: string;
      startDate: string; // ISO date string or "YYYY-MM"
      endDate: string | null; // ISO date string, "YYYY-MM", or null for current
      description: string; // Job description/achievements (Markdown supported)
      techStack?: string[]; // Technologies used
      location?: string; // Optional location
    }>;
  };
}

// Education Section - Standardized schema for public resume
export interface EducationSection extends BaseSection {
  type: "education";
  content: {
    items: Array<{
      degree: string; // Degree name (e.g., "Bachelor of Science")
      institution: string; // Institution name
      startYear: number; // Start year
      endYear: number | null; // End year or null for ongoing
      field?: string; // Field of study (optional)
      description?: string; // Additional details (optional)
    }>;
  };
}

// Skills Section - Standardized schema for public resume
export interface SkillsSection extends BaseSection {
  type: "skills";
  content: {
    categories: Array<{
      name: string; // Category name (e.g., "Frontend", "Backend", "Tools")
      items: string[]; // Array of skill names
    }>;
  };
}

// Links Section - Standardized schema for public resume
export interface LinksSection extends BaseSection {
  type: "links";
  content: {
    items: Array<{
      type: "github" | "linkedin" | "portfolio" | "email" | "twitter" | "other";
      url: string; // Full URL
      label?: string; // Optional custom label (for "other" type)
    }>;
  };
}

// Projects Section - Standardized schema for public resume
export interface ProjectsSection extends BaseSection {
  type: "projects";
  content: {
    items: Array<{
      name: string; // Project name
      description: string; // Project description (Markdown supported)
      role?: string; // Your role in the project
      techStack?: string[]; // Technologies used
      liveUrl?: string | null; // Live demo URL
      githubUrl?: string | null; // GitHub repository URL
      image?: string; // Project image URL (optional)
    }>;
  };
}

// Certifications Section - Standardized schema for public resume
export interface CertificationsSection extends BaseSection {
  type: "certifications";
  content: {
    items: Array<{
      name: string; // Certification name
      issuer: string; // Issuing organization
      date: string; // Issue date (ISO date string or "YYYY-MM")
      url?: string | null; // Verification URL
      expiryDate?: string | null; // Expiry date if applicable
    }>;
  };
}

// MDX Section (Pro feature) - Fully custom section
export interface MDXSection extends BaseSection {
  type: "mdx";
  content: {
    mdx: string; // Raw MDX content
  };
}

// Union type for all section types
export type ProfileSection =
  | HeroSection
  | AboutSection
  | SkillsSection
  | ExperienceSection
  | ProjectsSection
  | EducationSection
  | LinksSection
  | CertificationsSection
  | MDXSection;

/**
 * Default sections for new profiles - Standardized for public resume
 */
export function getDefaultSections(userId: string): ProfileSection[] {
  return [
    {
      id: `hero-${Date.now()}`,
      type: "hero",
      order: 0,
      content: {
        fullName: "",
        title: "",
        tagline: "",
        location: "",
      },
    },
    {
      id: `about-${Date.now()}`,
      type: "about",
      order: 1,
      content: {
        summary: "",
      },
    },
    {
      id: `links-${Date.now()}`,
      type: "links",
      order: 2,
      content: {
        items: [],
      },
    },
  ];
}

/**
 * Section type labels for UI
 */
export const sectionTypeLabels: Record<ProfileSectionType, string> = {
  hero: "Hero",
  about: "About",
  skills: "Skills",
  experience: "Experience",
  projects: "Projects",
  education: "Education",
  links: "Links",
  certifications: "Certifications",
  mdx: "Custom MDX",
};

/**
 * Section type descriptions for UI
 */
export const sectionTypeDescriptions: Record<ProfileSectionType, string> = {
  hero: "Your name, professional title, and tagline",
  about: "Professional summary and bio",
  skills: "Your skills organized by category",
  experience: "Your work experience and career history",
  projects: "Showcase your projects and portfolio work",
  education: "Your educational background and degrees",
  links: "Links to your social profiles and websites",
  certifications: "Professional certifications and credentials",
  mdx: "Fully custom section using MDX (Pro feature)",
};

/**
 * Check if section type is Pro-only
 */
export function isProSection(type: ProfileSectionType): boolean {
  return ["mdx"].includes(type);
}

