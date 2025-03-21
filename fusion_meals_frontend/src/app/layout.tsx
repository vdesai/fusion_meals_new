import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast"; // ✅ For toast notifications
import Navbar from "@/components/Navbar";
import { PantryProvider } from "@/context/PantryContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fusion Meals - Create Unique Fusion Recipes",
  description: "Generate unique fusion recipes combining different cuisines. Create meal plans and discover new flavors.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Fusion Meals",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PantryProvider>
          <Navbar />
          <main className="min-h-screen bg-gray-50">{children}</main>
          <Toaster position="bottom-right" />
        </PantryProvider>
      </body>
    </html>
  );
}
