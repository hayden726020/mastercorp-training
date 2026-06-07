import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, QrCode, Smartphone, Globe, Wifi } from "lucide-react";
import { BRAND_NAME, PROPERTY_NAME, ROUTES } from "@/lib/constants";
import { getRooms } from "@/data";

export const metadata: Metadata = {
  title: "Access Guide",
  description: "How to access the Mastercorp housekeeper training website via QR code",
};

export default function HelpAccessPage() {
  const rooms = getRooms();
  const siteUrl = "https://training.mastercorp.example.com";

  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto px-4 py-8">
      {/* Back link */}
      <nav aria-label="Breadcrumb">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          <span>Back to Home · 返回首页</span>
        </Link>
      </nav>

      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-section-title font-bold text-primary tracking-tight">
          Training Access · 培训访问
        </h1>
        <p className="text-body text-muted-foreground">
          Scan the QR code below or type the URL into your phone browser to access the
          training site. Bookmark it or add it to your home screen for quick access.
        </p>
      </div>

      {/* QR Code Section */}
      <section className="flex flex-col items-center gap-4 p-6 bg-surface rounded-xl border">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground/70">
          <QrCode size={18} aria-hidden="true" />
          <span>Scan to Access · 扫码访问</span>
        </div>

        {/* QR Code placeholder — replace with actual QR image */}
        <div className="w-48 h-48 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-muted-foreground/30">
          <div className="text-center text-xs text-muted-foreground px-4">
            <QrCode size={48} className="mx-auto mb-2 text-muted-foreground/50" />
            <p>QR Code</p>
            <p className="mt-1 opacity-70">
              Generate from: {siteUrl}
            </p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center max-w-xs">
          Open your phone camera and point it at the QR code. Tap the notification
          to open the training site.
        </p>
      </section>

      {/* Access Methods */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Smartphone size={20} aria-hidden="true" />
          How to Access · 如何访问
        </h2>

        <div className="grid gap-4">
          {/* Method 1 */}
          <div className="flex gap-3 p-4 rounded-lg border bg-background">
            <QrCode size={22} className="text-primary shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Method 1: Scan QR Code · 方法一：扫码
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Open your phone camera app, point it at the QR code on the training
                card or poster. Your phone will show a link — tap it to open the
                training site.
              </p>
            </div>
          </div>

          {/* Method 2 */}
          <div className="flex gap-3 p-4 rounded-lg border bg-background">
            <Globe size={22} className="text-primary shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Method 2: Type the URL · 方法二：输入网址
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Open your phone browser and type:{" "}
                <code className="px-1 py-0.5 bg-muted rounded text-xs font-mono break-all">
                  {siteUrl}
                </code>
              </p>
            </div>
          </div>

          {/* Method 3 */}
          <div className="flex gap-3 p-4 rounded-lg border bg-background">
            <Smartphone size={22} className="text-primary shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Method 3: Add to Home Screen · 方法三：添加到主屏幕
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                After opening the site, tap the Share button in your browser and
                select &ldquo;Add to Home Screen&rdquo;. This creates an app icon so
                you can open it with one tap next time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Room Quick Links */}
      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Wifi size={20} aria-hidden="true" />
          Direct Room Links · 房型直达链接
        </h2>

        <div className="grid gap-2">
          {rooms.map((room) => (
            <Link
              key={room.id}
              href={ROUTES.ROOM_TYPE(room.slug)}
              className="flex items-center justify-between p-3 rounded-lg border bg-background hover:bg-surface transition-colors"
            >
              <span className="text-sm font-medium text-foreground">
                {room.nameZh ?? room.name}
              </span>
              <span className="text-xs text-muted-foreground font-mono">
                {ROUTES.ROOM_TYPE(room.slug)}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-xs text-muted-foreground pt-4 border-t">
        <span className="font-medium text-foreground/70">{BRAND_NAME}</span>
        <span className="mx-1">—</span>
        <span>{PROPERTY_NAME}</span>
      </footer>
    </div>
  );
}
