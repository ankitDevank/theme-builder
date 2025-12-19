"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { LogOut, Users } from "lucide-react";
import Link from "next/link";

const Header = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  const handleUserList = () => {
    router.push("/users");
  };

  const getUserInitials = () => {
    if (session?.user?.name) {
      return session.user.name.charAt(0).toUpperCase();
    }
    return "U";
  };

  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <header className="fixed top-0 left-0 shadow right-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-primary/30">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Link href="/">
            <h1 className="text-xl font-semibold text-primary">
              Theme Builder
            </h1>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                <Avatar className="h-9 w-9 cursor-pointer transition-opacity hover:opacity-80">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuGroup>
                <div className="px-2 py-1.5 text-sm flex gap-2 items-center">
                  <Avatar className="h-9 w-9 cursor-pointer transition-opacity hover:opacity-80">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    {session?.user?.name && (
                      <p className="text-md capitalize font-bold">
                        {session.user.name.toLowerCase()}
                      </p>
                    )}
                    <p>{session?.user?.email || "User"}</p>
                  </div>
                </div>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {isAdmin && (
                  <DropdownMenuItem
                    onClick={handleUserList}
                    className="cursor-pointer"
                  >
                    <Users className="mr-2 h-4 w-4 text-black" />
                    <span className="font-medium">User List</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={handleLogout}
                  variant="destructive"
                  className="cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span className="font-medium">Logout</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
