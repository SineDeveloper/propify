import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Propify - Find homes worth visiting",
  description:
    "A modern property marketplace MVP for browsing homes, comparing listings, and sending buyer inquiries.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
