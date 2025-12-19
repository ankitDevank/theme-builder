import DashboardLayout from "@/components/DashboardLayout";
import { Providers } from "@/components/providers";
import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Page Builder",
  description: "Page builder for your website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body>
        <Providers>
          <DashboardLayout>{children}</DashboardLayout>
          <Toaster richColors position="bottom-left" />
        </Providers>
      </body>
    </html>
  );
}
