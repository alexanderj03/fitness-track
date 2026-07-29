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
    // "default", not "black-translucent": this app is light, and translucent
    // forces white status-bar glyphs that vanish against paper.
    statusBarStyle: "default",
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
        {/* viewport-fit=cover puts the canvas under the Dynamic Island and the
            landscape corners, so every edge is padded here rather than in each
            page. Bottom clearance is the nav's height, not the raw inset —
            BottomNav pads for the home indicator itself. */}
        <div
          className="mx-auto max-w-md pb-20"
          style={{
            paddingTop: "env(safe-area-inset-top)",
            paddingLeft: "env(safe-area-inset-left)",
            paddingRight: "env(safe-area-inset-right)",
          }}
        >
          {children}
        </div>
        <BottomNav />
        <RegisterSW />
      </body>
    </html>
  );
}
