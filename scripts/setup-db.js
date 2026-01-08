/**
 * Script to setup database connection and run migrations
 * Run with: node scripts/setup-db.js
 */

const { PrismaClient } = require("@prisma/client");

async function main() {
  const prisma = new PrismaClient();

  try {
    console.log("🔌 Connecting to database...");
    await prisma.$connect();
    console.log("✅ Successfully connected to database!");

    // Test query
    const userCount = await prisma.user.count();
    console.log(`📊 Current users in database: ${userCount}`);

    console.log("\n✅ Database is ready!");
    console.log("\nNext steps:");
    console.log("1. Run migrations: npx prisma migrate dev");
    console.log("2. Generate Prisma Client: npx prisma generate");
    console.log("3. Start the app: npm run dev");
  } catch (error) {
    console.error("❌ Error connecting to database:");
    console.error(error.message);
    console.log("\n💡 Make sure:");
    console.log("   - DATABASE_URL is set in your .env file");
    console.log("   - PostgreSQL is running");
    console.log("   - Database exists and is accessible");
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

