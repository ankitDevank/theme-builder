import bcrypt from "bcrypt";
import { PrismaClient, UserRole } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const password = await bcrypt.hash("password123", 10);

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
    where: { email: "editor@test.com" },
    update: {},
    create: {
      email: "editor@test.com",
      name: "Editor",
      password,
      role: UserRole.EDITOR,
    },
  });

  await prisma.user.upsert({
    where: { email: "editor1@test.com" },
    update: {},
    create: {
      email: "editor@test.com",
      name: "Editor",
      password,
      role: UserRole.EDITOR,
    },
  });

  await prisma.user.upsert({
    where: { email: "user@test.com" },
    update: {},
    create: {
      email: "user@test.com",
      name: "User",
      password,
      role: UserRole.VIEWER,
    },
  });
}

main();
