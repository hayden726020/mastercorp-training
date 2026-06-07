import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { cn } from "@/lib/utils";
import { APP_DESCRIPTION, APP_NAME, BRAND_NAME, PROPERTY_NAME } from "@/lib/constants";
import "./globals.css";

// ---- Fonts ----
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-mono",
  weight: "100 900",
});

// ---- Metadata ----
export const metadata: Metadata = {
  title: {
    default: `${APP_NAME} — ${BRAND_NAME}`,
    template: `%s — ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  keywords: [
    "housekeeping",
    "training",
    "hotel",
    "mastercorp",
    "wilderness club",
    "big cedar",
    "room standards",
  ],
  authors: [{ name: "Mastercorp Training Team" }],
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#1A5F7A",
};

// ---- Root Layout ----
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh"
      className={cn("font-sans", geistSans.variable, geistMono.variable)}
    >
      <body className="min-h-screen bg-surface text-foreground antialiased flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container-app flex h-14 items-center justify-between">
            {/* Left: Brand identity */}
            <div className="flex items-center gap-2.5">
              {/* Brand mark — small decorative diamond */}
              <div className="flex items-center shrink-0">
                <span
                  className="inline-block w-2 h-2 rounded-sm bg-primary"
                  aria-hidden="true"
                />
              </div>

              {/* App name */}
              <span className="font-semibold text-base tracking-tight text-primary">
                Housekeeper Training
              </span>
            </div>

            {/* Right: reserved for future navigation */}
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer className="border-t bg-background">
          <div className="container-app py-6 text-center text-sm text-muted-foreground">
            <span className="font-medium text-foreground/70">
              {BRAND_NAME}
            </span>
            <span className="mx-1.5 text-muted-foreground/30">—</span>
            <span>{PROPERTY_NAME}</span>
            <span className="mx-2 text-muted-foreground/30">·</span>
            <span>
              © {new Date().getFullYear()} {APP_NAME}
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
