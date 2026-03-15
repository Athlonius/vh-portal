import type { Metadata } from "next";
import "./globals.css";
import PortalLayout from "@/components/PortalLayout";
import { AuthProvider } from "@/components/AuthContext";

export const metadata: Metadata = {
  title: "VH Portal",
  description: "Vacation Hub Operations Portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <PortalLayout>{children}</PortalLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
