"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { PageConfig } from "@/types/dashboard";
import { PATH } from "@/lib/path";
import { getAuthSession } from "@/lib/getSession";

export async function saveBuilderForUser(userId: string, builderJson: any) {
  const session = await getAuthSession();

  if (session?.user?.role === "VIEWER") {
    throw new Error("You have no right to perform this action");
  }

  if (!userId) {
    throw new Error("User is required");
  }

  await prisma.pageBuilder.upsert({
    where: { userId },
    update: {
      content: builderJson,
    },
    create: {
      userId,
      content: builderJson,
    },
  });

  revalidatePath(PATH.ROOT);
}

export async function getBuilderForUser(
  userId: string
): Promise<PageConfig | null> {
  if (!userId) {
    throw new Error("User is required");
  }

  const existing = await prisma.pageBuilder.findUnique({
    where: { userId },
  });

  if (!existing) return null;

  return existing.content as PageConfig;
}
