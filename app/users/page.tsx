import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/formatDate";
import { getRoleBadgeColor } from "@/lib/getRoleBadgeColor";
import prisma from "@/lib/prisma";
import { Users } from "lucide-react";

const UsersPage = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="container mx-auto">
      <Card className="shadow-xl">
        <CardHeader className="gap-0 pb-0">
          <CardTitle className="font-semibold text-xl flex items-center gap-2">
            <Users />
            User List
          </CardTitle>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No users found
            </div>
          ) : (
            <div className="overflow-x-auto border rounded-md">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold text-sm">
                      Name
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">
                      Email
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">
                      Role
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">
                      Created At
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => {
                    return (
                      <tr
                        key={user.id}
                        className="border-b hover:bg-muted/50 transition-colors"
                      >
                        <td className="py-3 px-4 flex items-center gap-2">
                          <Avatar className="size-7 cursor-pointer transition-opacity hover:opacity-80">
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              {user.name?.charAt(0).toUpperCase() || "U"}
                            </AvatarFallback>
                          </Avatar>
                          {user.name || (
                            <span className="text-muted-foreground italic">
                              No name
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">{user.email}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getRoleBadgeColor(
                              user.role
                            )}`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {formatDate(user.createdAt)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersPage;
