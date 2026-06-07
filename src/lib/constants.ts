// ============================================================
// Project Constants — Holiday Resort Housekeeper Training System
// ============================================================

// App metadata
export const APP_NAME = "Housekeeper Training";
export const APP_DESCRIPTION =
  "Professional housekeeping training system for Mastercorp staff at Wilderness Club at Big Cedar";

// Brand info
export const BRAND_NAME = "Mastercorp";
export const PROPERTY_NAME = "Wilderness Club at Big Cedar";
export const RESORT_LOGO_ALT = "Mastercorp Logo";

// Routes
export const ROUTES = {
  HOME: "/",
  ROOM_TYPE: (slug: string) => `/rooms/${slug}`,
  AREA_DETAIL: (roomSlug: string, areaId: string) =>
    `/rooms/${roomSlug}/${areaId}`,
  SEARCH: "/search",
  COMPARE: "/rooms/compare",
  CHECKLIST: "/checklist",
} as const;

// Design
export const DESIGN = {
  // Touch target minimum per Apple HIG
  TOUCH_TARGET_MIN: 44,
  // Max content width for desktop
  MAX_CONTENT_WIDTH: 1280,
  // Modal max width
  MODAL_MAX_WIDTH: 640,
  // Mobile modal width (viewport percentage)
  MODAL_MOBILE_WIDTH: "90vw",
} as const;

// Storage keys (localStorage)
export const STORAGE_KEYS = {
  CHECKLIST_PREFIX: "checklist",
  RECENT_SEARCHES: "recent-searches",
} as const;

// API (future — Sprint 8+)
export const API_BASE = "/api";
