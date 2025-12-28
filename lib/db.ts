/**
 * Mock database for local development
 * No real database required - everything is stored in memory
 */

const { mockDb } = require("./db-mock");

export const prisma = mockDb;

