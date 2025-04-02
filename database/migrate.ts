// src/db/migrate.ts
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const main = async () => {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is not defined in environment variables");
  }

  // For migrations, use a separate connection with force close enabled
  const migrationClient = postgres(connectionString, { max: 1 });

  // Create a Drizzle instance
  const db = drizzle(migrationClient);

  console.log("Running migrations...");

  // Run the migrations
  await migrate(db, { migrationsFolder: "drizzle" });

  console.log("Migrations completed successfully!");

  // Close the connection
  await migrationClient.end();
  process.exit(0);
};

main().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
