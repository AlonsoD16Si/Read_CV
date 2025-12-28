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
  content: string;
  published: boolean;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

// In-memory storage
const users: Map<string, MockUser> = new Map();
const profiles: Map<string, MockProfile> = new Map();
const profilesByUsername: Map<string, MockProfile> = new Map();
const profilesByUserId: Map<string, MockProfile> = new Map();

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
    findUnique: async (args: { where: { id?: string; email?: string; username?: string }; include?: any; select?: any }) => {
      let user: MockUser | null = null;
      
      if (args.where.id) {
        user = users.get(args.where.id) || null;
      } else if (args.where.email) {
        user = Array.from(users.values()).find(u => u.email === args.where.email) || null;
      } else if (args.where.username) {
        user = Array.from(users.values()).find(u => u.username === args.where.username) || null;
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
        Object.keys(args.select).forEach(key => {
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
        return Array.from(users.values()).find(u => u.email === args.where.email) || null;
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
    findUnique: async (args: { where: { id?: string; username?: string; userId?: string; published?: boolean }; include?: any }) => {
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
      if (args.where.published !== undefined && profile.published !== args.where.published) {
        return null;
      }
      
      // Handle include
      if (args.include?.user) {
        const user = users.get(profile.userId);
        return { ...profile, user: user || null };
      }
      
      return profile;
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
        content: data.content,
        published: data.published || false,
        views: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      profiles.set(profile.id, profile);
      profilesByUsername.set(profile.username, profile);
      profilesByUserId.set(profile.userId, profile);
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
};

