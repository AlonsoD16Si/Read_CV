/**
 * Mock database for local development without Prisma
 */

export interface MockUser {
  id: string;
  email: string;
  name: string | null;
  username: string | null;
  image: string | null;
  planId: string;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MockProfile {
  id: string;
  userId: string;
  username: string;
  content?: string; // Legacy MDX content (optional for backward compatibility)
  published: boolean;
  views?: number; // Legacy views counter
  theme?: string | null;
  customDomain?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string | null;
  removeBranding?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MockProfileSection {
  id: string;
  profileId: string;
  type: string;
  content: any; // JSON content
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface MockAnalytics {
  id: string;
  profileId: string;
  eventType: string;
  referrer?: string | null;
  userAgent?: string | null;
  ipAddress?: string | null;
  metadata?: any | null;
  createdAt: Date;
}

export interface MockProfileExperience {
  id: string;
  profileId: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string | null;
  description: string | null;
  techStack: string[];
  location: string | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

// In-memory storage
const users: Map<string, MockUser> = new Map();
const profiles: Map<string, MockProfile> = new Map();
const profilesByUsername: Map<string, MockProfile> = new Map();
const profilesByUserId: Map<string, MockProfile> = new Map();
const profileSections: Map<string, MockProfileSection> = new Map();
const sectionsByProfileId: Map<string, MockProfileSection[]> = new Map();
const profileExperiences: Map<string, MockProfileExperience> = new Map();
const experiencesByProfileId: Map<string, MockProfileExperience[]> = new Map();
const analytics: Map<string, MockAnalytics> = new Map();
const analyticsByProfileId: Map<string, MockAnalytics[]> = new Map();

// Initialize with a default test user
// Email: test@example.com
// Password: password123
// Hash generado con bcrypt para "password123"
const defaultUser: MockUser = {
  id: "user_test_001",
  email: "test@example.com",
  name: "Usuario de Prueba",
  username: "testuser",
  image: null,
  planId: "free",
  password: "$2a$12$gIA/bdXgjJZWwwB4kV9XX.0Ojgl/nreV2aZiyKpJwkCtMh87dsMFS", // password123
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Add default user on initialization
users.set(defaultUser.id, defaultUser);

export const mockDb = {
  user: {
    findUnique: async (args: {
      where: { id?: string; email?: string; username?: string };
      include?: any;
      select?: any;
    }) => {
      let user: MockUser | null = null;

      if (args.where.id) {
        user = users.get(args.where.id) || null;
      } else if (args.where.email) {
        user =
          Array.from(users.values()).find(
            (u) => u.email === args.where.email
          ) || null;
      } else if (args.where.username) {
        user =
          Array.from(users.values()).find(
            (u) => u.username === args.where.username
          ) || null;
      }

      if (!user) return null;

      // Handle include
      if (args.include?.profile) {
        const profile = profilesByUserId.get(user.id);
        return { ...user, profile: profile || null };
      }

      // Handle select
      if (args.select) {
        const selected: any = {};
        Object.keys(args.select).forEach((key) => {
          if (args.select[key] && user) {
            selected[key] = (user as any)[key];
          }
        });
        return selected;
      }

      return user;
    },
    findFirst: async (args: { where: any }) => {
      if (args.where.email) {
        return (
          Array.from(users.values()).find(
            (u) => u.email === args.where.email
          ) || null
        );
      }
      return null;
    },
    create: async (data: any) => {
      const user: MockUser = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email: data.email,
        name: data.name || null,
        username: data.username || null,
        image: data.image || null,
        planId: data.planId || "free",
        password: data.password,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      users.set(user.id, user);
      return user;
    },
    update: async (args: { where: { id: string }; data: any }) => {
      const user = users.get(args.where.id);
      if (!user) return null;
      const updated = { ...user, ...args.data, updatedAt: new Date() };
      users.set(user.id, updated);
      return updated;
    },
  },
  profile: {
    findUnique: async (args: {
      where: {
        id?: string;
        username?: string;
        userId?: string;
        published?: boolean;
      };
      include?: any;
    }) => {
      let profile: MockProfile | null = null;

      if (args.where.id) {
        profile = profiles.get(args.where.id) || null;
      } else if (args.where.username) {
        profile = profilesByUsername.get(args.where.username) || null;
      } else if (args.where.userId) {
        profile = profilesByUserId.get(args.where.userId) || null;
      }

      if (!profile) return null;

      // Filter by published if specified
      if (
        args.where.published !== undefined &&
        profile.published !== args.where.published
      ) {
        return null;
      }

      // Handle include
      const result: any = { ...profile };

      if (args.include?.user) {
        const user = users.get(profile.userId);
        result.user = user || null;
      }

      if (args.include?.sections) {
        result.sections = sectionsByProfileId.get(profile.id) || [];
      }

      if (args.include?.analytics) {
        result.analytics = analyticsByProfileId.get(profile.id) || [];
      }

      if (args.include?.experiences) {
        const experiences = experiencesByProfileId.get(profile.id) || [];
        if (args.include.experiences.orderBy) {
          const orderBy = args.include.experiences.orderBy;
          if (orderBy.order === "asc") {
            result.experiences = [...experiences].sort(
              (a, b) => a.order - b.order
            );
          } else {
            result.experiences = [...experiences].sort(
              (a, b) => b.order - a.order
            );
          }
        } else {
          result.experiences = experiences;
        }
      }

      return result;
    },
    findFirst: async (args: { where: any }) => {
      if (args.where.username) {
        return profilesByUsername.get(args.where.username) || null;
      }
      if (args.where.userId) {
        return profilesByUserId.get(args.where.userId) || null;
      }
      return null;
    },
    create: async (data: any) => {
      const profile: MockProfile = {
        id: `profile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: data.userId,
        username: data.username,
        content: data.content, // Legacy support
        published: data.published || false,
        views: 0, // Legacy support
        theme: data.theme || null,
        customDomain: data.customDomain || null,
        seoTitle: data.seoTitle || null,
        seoDescription: data.seoDescription || null,
        seoKeywords: data.seoKeywords || null,
        removeBranding: data.removeBranding || false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      profiles.set(profile.id, profile);
      profilesByUsername.set(profile.username, profile);
      profilesByUserId.set(profile.userId, profile);

      // Create sections if provided
      // Handle both direct array and Prisma nested create syntax
      let sectionsToCreate: any[] = [];
      if (data.sections) {
        if (Array.isArray(data.sections)) {
          // Direct array (legacy mock format)
          sectionsToCreate = data.sections;
        } else if (
          data.sections.create &&
          Array.isArray(data.sections.create)
        ) {
          // Prisma nested create syntax
          sectionsToCreate = data.sections.create;
        }
      }

      if (sectionsToCreate.length > 0) {
        const sections: MockProfileSection[] = [];
        for (const sectionData of sectionsToCreate) {
          const section: MockProfileSection = {
            id:
              sectionData.id ||
              `section_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            profileId: profile.id,
            type: sectionData.type,
            content: sectionData.content,
            order: sectionData.order || 0,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          profileSections.set(section.id, section);
          sections.push(section);
        }
        sectionsByProfileId.set(profile.id, sections);
      }

      return profile;
    },
    update: async (args: { where: { id: string }; data: any }) => {
      const profile = profiles.get(args.where.id);
      if (!profile) return null;

      // Handle increment operations
      const updated = { ...profile };
      if (args.data.views?.increment !== undefined) {
        updated.views = profile.views + args.data.views.increment;
      } else {
        Object.assign(updated, args.data);
      }
      updated.updatedAt = new Date();

      profiles.set(profile.id, updated);
      if (updated.username) {
        profilesByUsername.set(updated.username, updated);
      }
      profilesByUserId.set(updated.userId, updated);
      return updated;
    },
  },
  account: {
    findUnique: async () => null,
    create: async () => null,
  },
  session: {
    findUnique: async () => null,
    create: async () => null,
    delete: async () => null,
  },
  verificationToken: {
    findUnique: async () => null,
    create: async () => null,
    delete: async () => null,
  },
  profileSection: {
    findMany: async (args: {
      where: { profileId: string };
      orderBy?: { order: string };
    }) => {
      const sections = sectionsByProfileId.get(args.where.profileId) || [];
      if (args.orderBy?.order === "asc") {
        return sections.sort((a, b) => a.order - b.order);
      }
      return sections;
    },
    create: async (data: any) => {
      const section: MockProfileSection = {
        id: `section_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        profileId: data.profileId,
        type: data.type,
        content: data.content,
        order: data.order || 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      profileSections.set(section.id, section);
      const sections = sectionsByProfileId.get(data.profileId) || [];
      sections.push(section);
      sectionsByProfileId.set(data.profileId, sections);
      return section;
    },
    update: async (args: { where: { id: string }; data: any }) => {
      const section = profileSections.get(args.where.id);
      if (!section) return null;
      const updated = { ...section, ...args.data, updatedAt: new Date() };
      profileSections.set(section.id, updated);
      const sections = sectionsByProfileId.get(section.profileId) || [];
      const index = sections.findIndex((s) => s.id === section.id);
      if (index >= 0) {
        sections[index] = updated;
        sectionsByProfileId.set(section.profileId, sections);
      }
      return updated;
    },
    delete: async (args: { where: { id: string } }) => {
      const section = profileSections.get(args.where.id);
      if (!section) return null;
      profileSections.delete(section.id);
      const sections = sectionsByProfileId.get(section.profileId) || [];
      const filtered = sections.filter((s) => s.id !== section.id);
      sectionsByProfileId.set(section.profileId, filtered);
      return section;
    },
    deleteMany: async (args: { where: { profileId: string } }) => {
      const sections = sectionsByProfileId.get(args.where.profileId) || [];
      sections.forEach((s) => profileSections.delete(s.id));
      sectionsByProfileId.delete(args.where.profileId);
      return { count: sections.length };
    },
  },
  analytics: {
    create: async (data: any) => {
      const analytic: MockAnalytics = {
        id: `analytics_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        profileId: data.profileId,
        eventType: data.eventType,
        referrer: data.referrer || null,
        userAgent: data.userAgent || null,
        ipAddress: data.ipAddress || null,
        metadata: data.metadata || null,
        createdAt: new Date(),
      };
      analytics.set(analytic.id, analytic);
      const profileAnalytics = analyticsByProfileId.get(data.profileId) || [];
      profileAnalytics.push(analytic);
      analyticsByProfileId.set(data.profileId, profileAnalytics);
      return analytic;
    },
    findMany: async (args: {
      where: { profileId: string; eventType?: string };
      orderBy?: { createdAt: string };
    }) => {
      let profileAnalytics =
        analyticsByProfileId.get(args.where.profileId) || [];
      if (args.where.eventType) {
        profileAnalytics = profileAnalytics.filter(
          (a) => a.eventType === args.where.eventType
        );
      }
      if (args.orderBy?.createdAt === "desc") {
        profileAnalytics.sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        );
      }
      return profileAnalytics;
    },
  },
  profileExperience: {
    findMany: async (args: {
      where: { profileId: string };
      orderBy?: { order: string };
    }) => {
      const experiences =
        experiencesByProfileId.get(args.where.profileId) || [];
      if (args.orderBy?.order === "asc") {
        return [...experiences].sort((a, b) => a.order - b.order);
      } else if (args.orderBy?.order === "desc") {
        return [...experiences].sort((a, b) => b.order - a.order);
      }
      return experiences;
    },
    create: async (data: any) => {
      const experience: MockProfileExperience = {
        id: `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        profileId: data.profileId,
        company: data.company,
        role: data.role,
        startDate: data.startDate,
        endDate: data.endDate || null,
        description: data.description || null,
        techStack: Array.isArray(data.techStack) ? data.techStack : [],
        location: data.location || null,
        order: data.order || 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      profileExperiences.set(experience.id, experience);

      const experiences = experiencesByProfileId.get(data.profileId) || [];
      experiences.push(experience);
      experiencesByProfileId.set(data.profileId, experiences);

      return experience;
    },
    createMany: async (args: { data: any[] }) => {
      const created: MockProfileExperience[] = [];
      for (const data of args.data) {
        const experience: MockProfileExperience = {
          id: `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          profileId: data.profileId,
          company: data.company,
          role: data.role,
          startDate: data.startDate,
          endDate: data.endDate || null,
          description: data.description || null,
          techStack: Array.isArray(data.techStack) ? data.techStack : [],
          location: data.location || null,
          order: data.order || 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        profileExperiences.set(experience.id, experience);
        created.push(experience);

        const experiences = experiencesByProfileId.get(data.profileId) || [];
        experiences.push(experience);
        experiencesByProfileId.set(data.profileId, experiences);
      }
      return { count: created.length };
    },
    deleteMany: async (args: { where: { profileId: string } }) => {
      const experiences =
        experiencesByProfileId.get(args.where.profileId) || [];
      experiences.forEach((exp) => {
        profileExperiences.delete(exp.id);
      });
      experiencesByProfileId.delete(args.where.profileId);
      return { count: experiences.length };
    },
    update: async (args: { where: { id: string }; data: any }) => {
      const experience = profileExperiences.get(args.where.id);
      if (!experience) return null;
      const updated = { ...experience, ...args.data, updatedAt: new Date() };
      profileExperiences.set(experience.id, updated);

      // Update in the profile's experiences array
      const experiences =
        experiencesByProfileId.get(experience.profileId) || [];
      const index = experiences.findIndex((e) => e.id === experience.id);
      if (index !== -1) {
        experiences[index] = updated;
        experiencesByProfileId.set(experience.profileId, experiences);
      }

      return updated;
    },
    delete: async (args: { where: { id: string } }) => {
      const experience = profileExperiences.get(args.where.id);
      if (!experience) return null;
      profileExperiences.delete(args.where.id);

      const experiences =
        experiencesByProfileId.get(experience.profileId) || [];
      const filtered = experiences.filter((e) => e.id !== experience.id);
      experiencesByProfileId.set(experience.profileId, filtered);

      return experience;
    },
  },
};
