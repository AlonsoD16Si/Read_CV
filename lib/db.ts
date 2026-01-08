/**
 * Database client - uses Prisma for PostgreSQL or mock for development
 */

import { PrismaClient } from "@prisma/client";
import { mockDb } from "./db-mock";

// Check if we should use mock database
const useMockDb = process.env.USE_MOCK_DB === "true";
const hasDatabaseUrl = !!process.env.DATABASE_URL;

// Debug logging in development
if (process.env.NODE_ENV === "development") {
 
  if (hasDatabaseUrl) {
    // Show first and last chars of DATABASE_URL for security
    const dbUrl = process.env.DATABASE_URL || "";
    const masked =
      dbUrl.length > 20
        ? `${dbUrl.substring(0, 10)}...${dbUrl.substring(dbUrl.length - 10)}`
        : "***";
    console.log(`   DATABASE_URL preview: ${masked}`);
  }
}

// Initialize database client
let prismaInstance: PrismaClient | typeof mockDb;

if (hasDatabaseUrl && !useMockDb) {
  // Use real Prisma if DATABASE_URL is set and USE_MOCK_DB is not true
  console.log("✅ Using PostgreSQL database");
  const prismaClient = new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

  // Handle Prisma connection errors gracefully
  prismaClient.$connect().catch((error) => {
    console.error(" Failed to connect to database:", error);
    console.error(
      " Make sure DATABASE_URL is set correctly in your .env file"
    );
  });

  prismaInstance = prismaClient;
} else {
  // Use mock database for development
  prismaInstance = mockDb;

  if (process.env.NODE_ENV === "development") {
    if (useMockDb) {
      console.log("  Using mock database (USE_MOCK_DB=true).");
    } else if (!hasDatabaseUrl) {
      console.log("  Using mock database. DATABASE_URL not set.");
      console.log(
        " To use PostgreSQL, set DATABASE_URL in your .env file and set USE_MOCK_DB=false"
      );
    }
  }
}

export const prisma = prismaInstance;
