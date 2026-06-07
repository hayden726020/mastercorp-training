import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, QrCode, Smartphone, Globe, Wifi } from "lucide-react";
import { BRAND_NAME, PROPERTY_NAME, ROUTES } from "@/lib/constants";
import { getRooms } from "@/data";

export const metadata: Metadata = {
  title: "培训访问",
  description: "如何通过二维码访问 Mastercorp 客房服务员培训网站",
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
          <span>返回首页</span>
        </Link>
      </nav>

      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-section-title font-bold text-primary tracking-tight">
          培训访问
        </h1>
        <p className="text-body text-muted-foreground">
          扫描下方二维码或在手机浏览器中输入网址，即可访问培训网站。
          建议将其添加到书签或主屏幕，以便快速访问。
        </p>
      </div>

      {/* QR Code Section */}
      <section className="flex flex-col items-center gap-4 p-6 bg-surface rounded-xl border">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground/70">
          <QrCode size={18} aria-hidden="true" />
          <span>扫码访问</span>
        </div>

        {/* QR Code placeholder — replace with actual QR image */}
        <div className="w-48 h-48 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-muted-foreground/30">
          <div className="text-center text-xs text-muted-foreground px-4">
            <QrCode size={48} className="mx-auto mb-2 text-muted-foreground/50" />
            <p>QR 码</p>
            <p className="mt-1 opacity-70">
              从以下网址生成：{siteUrl}
            </p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center max-w-xs">
          打开手机相机，对准二维码。点击弹出的通知即可打开培训网站。
        </p>
      </section>

      {/* Access Methods */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Smartphone size={20} aria-hidden="true" />
          如何访问
        </h2>

        <div className="grid gap-4">
          {/* Method 1 */}
          <div className="flex gap-3 p-4 rounded-lg border bg-background">
            <QrCode size={22} className="text-primary shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                方法一：扫码
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                打开手机相机应用，对准培训卡片或海报上的二维码。
                手机会显示链接 — 点击即可打开培训网站。
              </p>
            </div>
          </div>

          {/* Method 2 */}
          <div className="flex gap-3 p-4 rounded-lg border bg-background">
            <Globe size={22} className="text-primary shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                方法二：输入网址
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                打开手机浏览器，输入：{" "}
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
                方法三：添加到主屏幕
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                打开网站后，点击浏览器中的分享按钮，
                选择「添加到主屏幕」。这样会创建一个应用图标，
                下次一键即可打开。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Room Quick Links */}
      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Wifi size={20} aria-hidden="true" />
          房型直达链接
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
