import path from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaPg } from "@prisma/adapter-pg";
import * as argon2 from "argon2";
import { config as loadEnv } from "dotenv";
import { Pool } from "pg";
import { PrismaClient } from "../src/generated/prisma/client.js";

const appDir = path.dirname(fileURLToPath(import.meta.url));
loadEnv({ path: path.join(appDir, "../../../.env") });

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} must be set in root .env`);
  }
  return value;
}

const adminPassword = requireEnv("ADMIN_PASSWORD");
const adminEmail = requireEnv("ADMIN_EMAIL");
const databaseUrl = requireEnv("DATABASE_URL");

const hash = await argon2.hash(adminPassword);

const pool = new Pool({ connectionString: databaseUrl });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash: hash,
      role: "ADMINISTRATOR",
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
