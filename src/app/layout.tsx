import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import { Nav } from "@/components/Nav";
import { TimezoneSync } from "@/components/TimezoneSync";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

// Every page reads live data from the database.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { default: "Compass", template: "%s · Compass" },
  description: "Daily progress against the objectives you set.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={archivo.variable}>
      <body>
        <TimezoneSync />
        <Nav />
        <main className="mx-auto w-full max-w-[960px] px-4 pb-28 md:px-6 md:pb-16">{children}</main>
      </body>
    </html>
  );
}
