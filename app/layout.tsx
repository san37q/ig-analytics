import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IG Tracker - Instagram Follower Analytics",
  description: "Track your Instagram followers, unfollows, and growth over time",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 dark:bg-gray-900">{children}</body>
    </html>
  );
}
