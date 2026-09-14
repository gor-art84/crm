import path from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaPg } from "@prisma/adapter-pg";
import * as argon2 from "argon2";
import { config as loadEnv } from "dotenv";
import { env } from "prisma/config";
import { PrismaClient } from "../src/generated/prisma/client.js";

const appDir = path.dirname(fileURLToPath(import.meta.url));
loadEnv({ path: path.join(appDir, "../../../.env") });

const adapter = new PrismaPg({
  connectionString: env("DATABASE_URL"),
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = env("ADMIN_EMAIL");
  const passwordHash = await argon2.hash(env("ADMIN_PASSWORD"));
  const admin = await prisma.user.upsert({
    where: { email: email },
    update: {},
    create: {
      email: email,
      passwordHash: passwordHash,
      role: "ADMINISTRATOR",
    },
  });
  console.log(`Admin user created: ${admin.email}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
