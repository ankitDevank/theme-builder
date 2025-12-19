"use client";

import { usePathname } from "next/navigation";
import Header from "./common/Header";
import Footer from "./common/Footer";
import { ReactNode } from "react";
import { PATH } from "@/lib/path";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const isLoginRoute = pathname?.startsWith(PATH.LOGIN);

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
