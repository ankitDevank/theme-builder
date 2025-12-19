import prisma from "@/lib/prisma";
import { getAuthSession } from "@/lib/getSession";
import Dashboard from "@/components/dashboard/Dashboard";
import { PageConfig } from "@/types/builder";

export default async function BuilderPage() {
  const session = await getAuthSession();

  const currentUserId = session?.user.id ?? null;
  const currentUserRole = session?.user.role ?? null;

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: { email: "asc" },
  });

  const safeUsers = users.map((u) => ({ id: u.id, name: u.name ?? "" }));

  let initialConfig: PageConfig | null = null;

  if (currentUserId) {
    const existing = await prisma.pageBuilder.findUnique({
      where: { userId: currentUserId },
    });

    if (existing) {
      initialConfig = existing.content as PageConfig;
    }
  }

  return (
    <Dashboard
      users={safeUsers}
      initialUserId={currentUserId}
      initialConfig={initialConfig}
      currentUserRole={currentUserRole}
    />
  );
}
