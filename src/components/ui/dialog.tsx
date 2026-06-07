"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { t } from "@/lib/locales/zh";

// ── Root ──────────────────────────────────────────────────────────
function Dialog({
  open,
  onOpenChange,
  children,
  ...props
}: DialogPrimitive.Root.Props) {
  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={onOpenChange}
      modal
      {...props}
    >
      {children}
    </DialogPrimitive.Root>
  );
}

// ── Content (Backdrop + custom content div) ───────────────────────
// We deliberately avoid DialogPrimitive.Popup because it injects
// floating-ui inline positioning styles (position: fixed, top/left/
// transform) that conflict with our own flex-based positioning.
// On mobile portrait, those inline styles can push the sheet off-screen
// and override our CSS classes, making the dialog invisible.
//
// Because we skip DialogPrimitive.Popup, Base UI's popupRef is never
// assigned a DOM element. This means useOpenChangeComplete never calls
// forceUnmount(), so store.state.mounted stays true forever, and
// DialogPrimitive.Portal (which checks mounted to decide shouldRender)
// never unmounts. Its InternalBackdrop + FloatingPortal persist in
// document.body permanently.
//
// Rather than fighting Base UI's internal state machine, we use React's
// createPortal directly and manage mount/unmount ourselves based on the
// `open` prop. When open → true we mount immediately. When open → false
// we wait for the exit animation (300ms) then unmount completely,
// removing ALL DOM nodes (backdrop, overlay, sheet) from the page.
type DialogContentProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Whether the dialog is open. Controls portal mount/unmount. */
  open?: boolean;
};

function DialogContent({
  className,
  children,
  open,
  ...props
}: DialogContentProps) {
  // ── Self-managed portal mount state ────────────────────────────
  // Base UI's mounted state is broken (stuck at true) because we skip
  // DialogPrimitive.Popup (see note above). We track our own mounted
  // flag so we can completely remove portal DOM nodes on close.
  //
  // Two-phase close to work around Safari's backdrop-filter compositor bug:
  //   Phase 1 (instant):  set closing=true  → backdrop transitions to opacity-0
  //   Phase 2 (300ms):    set mounted=false → portal removed from DOM entirely
  // Without the fade-out phase, Safari's GPU compositor retains the blurred
  // texture even after the DOM element is gone — the page stays blurry.
  const [mounted, setMounted] = React.useState(false);
  const [closing, setClosing] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setClosing(false);
      setMounted(true);
      return;
    }

    if (!open && mounted && !closing) {
      // Phase 1: start fade-out, keep DOM (backdrop stays but opacity→0)
      setClosing(true);
      return;
    }

    if (!open && closing) {
      // Phase 2: fade-out complete, remove DOM entirely
      const timer = setTimeout(() => {
        setClosing(false);
        setMounted(false);
      }, 300);
      return () => clearTimeout(timer);
    }

    return;
  }, [open, closing]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Render — self-managed portal ──────────────────────────────
  // Two-phase close (Safari backdrop-filter compositor bug workaround):
  //   closing=true  → backdrop opacity→0 via CSS transition (blur texture released)
  //   mounted=false → entire portal removed from DOM
  // This gives Safari 300ms to recomposite before we tear down the DOM.
  if (!open && !mounted) {
    return null;
  }

  return createPortal(
    <>
      {/* Backdrop — CSS fade-in on mount, CSS fade-out on close.
          Phase 1 (closing=true):  opacity→0 via CSS transition (300ms).
                                   Safari's compositor releases the blur texture
                                   during this phase.
          Phase 2 (mounted=false): DOM element removed entirely. */}
      <DialogPrimitive.Backdrop
        data-dialog-backdrop=""
        className={cn(
          "fixed inset-0 bg-black/40 backdrop-blur-sm",
          "animate-dialog-backdrop-in",
          "transition-opacity duration-300",
          closing ? "opacity-0" : "opacity-100",
          "motion-reduce:animate-none motion-reduce:transition-none"
        )}
      />

      {/* Positioning shell — flex-based, no floating-ui interference. */}
      <div
        className={cn(
          "fixed inset-0 z-50 flex items-end justify-center",
          "md:items-center md:p-4"
        )}
      >
        {/* Dialog sheet — plain div, our CSS has full control */}
        <div
          role="dialog"
          aria-modal="true"
          className={cn(
            // Layout
            "relative z-50 flex flex-col w-full md:max-w-[640px]",
            "max-h-[85vh] md:max-h-[70vh]",
            // Visual
            "bg-card border border-border shadow-modal",
            "rounded-t-card md:rounded-card overflow-hidden",
            // Always at final visible position
            "translate-y-0",
            // Mobile: slide up from below viewport
            "animate-dialog-slide-up motion-reduce:animate-none",
            // Desktop: gentle scale-in
            "md:scale-100 md:animate-dialog-scale-in md:motion-reduce:animate-none",
            // Consumer class
            className
          )}
          {...props}
        >
          {/* Gold accent bar */}
          <div className="shrink-0 h-1 bg-accent" aria-hidden="true" />

          {/* Close button */}
          <DialogPrimitive.Close
            className={cn(
              "absolute top-2 right-2 z-10 flex items-center justify-center",
              "w-10 h-10 rounded-full",
              "bg-muted/80 hover:bg-muted",
              "transition-colors duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            )}
          >
            <X size={18} />
            <span className="sr-only">{t("dialog.close")}</span>
          </DialogPrimitive.Close>

          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto min-h-0">{children}</div>
        </div>
      </div>
    </>,
    document.body
  );
}

// ── Sub-components ────────────────────────────────────────────────

function DialogHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="dialog-header"
      className={cn(
        "flex flex-col gap-1.5 text-center sm:text-left px-6 pt-5",
        className
      )}
      {...props}
    />
  );
}

function DialogTitle({
  className,
  ...props
}: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        "text-lg font-semibold tracking-tight leading-snug",
        className
      )}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

function DialogFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse sm:flex-row sm:justify-end gap-2 px-6 pb-5 pt-2",
        className
      )}
      {...props}
    />
  );
}

// ── Exports ───────────────────────────────────────────────────────
export {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
};
