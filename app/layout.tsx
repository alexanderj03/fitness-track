import type { Metadata, Viewport } from "next";
import BottomNav from "@/components/BottomNav";
import RegisterSW from "@/components/RegisterSW";
import "./globals.css";

export const metadata: Metadata = {
  title: "Macro Tracker",
  description: "Personal calorie and protein tracker",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Macro Tracker",
  },
  icons: {
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#FAFAF7",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-paper text-ink antialiased">
        <div className="mx-auto max-w-md pb-24">{children}</div>
        <BottomNav />
        <RegisterSW />
      </body>
    </html>
  );
}
