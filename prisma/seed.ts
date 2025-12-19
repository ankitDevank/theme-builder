import bcrypt from "bcrypt";
import { PrismaClient, UserRole } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  if (process.env.SHOULD_SEED !== "true") {
    console.log("Skipping seed");
    return;
  }

  const password = await bcrypt.hash("password@123", 10);

  await prisma.user.upsert({
    where: { email: "admin@test.com" },
    update: {},
    create: {
      email: "admin@test.com",
      name: "Admin",
      password,
      role: UserRole.ADMIN,
    },
  });

  await prisma.user.upsert({
    where: { email: "editor1@test.com" },
    update: {},
    create: {
      email: "editor1@test.com",
      name: "Editor 1",
      password,
      role: UserRole.EDITOR,
    },
  });

  await prisma.user.upsert({
    where: { email: "editor2@test.com" },
    update: {},
    create: {
      email: "editor2@test.com",
      name: "Editor 2",
      password,
      role: UserRole.EDITOR,
    },
  });

  await prisma.user.upsert({
    where: { email: "user1@test.com" },
    update: {},
    create: {
      email: "user1@test.com",
      name: "User 1",
      password,
      role: UserRole.VIEWER,
    },
  });

  await prisma.user.upsert({
    where: { email: "user2@test.com" },
    update: {},
    create: {
      email: "user2@test.com",
      name: "User 2",
      password,
      role: UserRole.VIEWER,
    },
  });
}

main();
