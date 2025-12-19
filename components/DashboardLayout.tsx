"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Hide header and footer for login routes
  const isLoginRoute = pathname?.startsWith("/login");

  return (
    <div className="flex flex-col min-h-screen bg-primary/10">
      {!isLoginRoute && <Header />}
      <main className={isLoginRoute ? "" : "p-4 sm:p-6 lg:p-8 mt-16 "}>
        {children}
      </main>
      {!isLoginRoute && <Footer />}
    </div>
  );
}
