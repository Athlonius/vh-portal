import type { Metadata } from "next";
import "./globals.css";
import PortalLayout from "@/components/PortalLayout";

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
        <PortalLayout>{children}</PortalLayout>
      </body>
    </html>
  );
}
