// ============================================================
// Core Type Definitions — Holiday Resort Housekeeper Training System
// ============================================================
// Ref: SAD V1.1 §6.2 Prisma Schema, §6.4 Enum Specifications

// ---- Enums ----

export enum HotspotType {
  RECT = "RECT",
  CIRCLE = "CIRCLE",
  POLYGON = "POLYGON",
  POINT = "POINT",
}

export enum ImageType {
  STANDARD = "STANDARD",
  WRONG = "WRONG",
  DETAIL = "DETAIL",
}

// ---- Coordinates (SAD §6.4) ----

export interface RectCoordinates {
  x: number; // left percent (0–100)
  y: number; // top percent (0–100)
  width: number; // width percent (0–100)
  height: number; // height percent (0–100)
}

export interface CircleCoordinates {
  cx: number; // center x percent
  cy: number; // center y percent
  r: number; // radius percent
}

export interface PolygonCoordinates {
  points: Array<{ x: number; y: number }>; // vertex percent coordinates
}

export interface PointCoordinates {
  x: number; // x percent
  y: number; // y percent
}

export type AreaCoordinates =
  | RectCoordinates
  | CircleCoordinates
  | PolygonCoordinates
  | PointCoordinates;

// ---- Core Models ----

export interface RoomType {
  id: string;
  name: string; // e.g. "A Suite"
  nameZh?: string; // e.g. "A 套房"
  slug: string; // e.g. "a-suite"
  description: string;
  descriptionZh?: string; // Chinese translation
  coverImage: string; // URL — placeholder in V1
  panoramaImage: string; // URL — placeholder in V1
  sortOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface RoomArea {
  id: string;
  roomTypeId: string;
  name: string; // e.g. "Bed Area", "Coffee Station"
  nameZh?: string; // e.g. "床区"
  description: string;
  descriptionZh?: string; // Chinese translation
  hotspotType: HotspotType;
  coordinates: AreaCoordinates;
  sortOrder: number;
  iconType: string; // icon identifier for marker display
  createdAt?: string;
  updatedAt?: string;
}

export interface AreaContent {
  id: string;
  areaId: string;
  title: string;
  titleZh?: string; // Chinese translation
  description: string;
  descriptionZh?: string; // Chinese translation
  images: AreaImage[]; // training images (STANDARD / WRONG / DETAIL)
  createdAt?: string;
  updatedAt?: string;
}

export interface PlacementStandard {
  id: string;
  areaId: string;
  roomTypeId: string; // redundant — convenience for room-level queries
  title: string; // e.g. "Pillow Placement"
  description: string; // e.g. "Pillows placed at 45° angle, opening facing inward"
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AreaImage {
  id: string;
  areaId: string;
  imageUrl: string;
  thumbnailUrl: string; // Cloudinary transformation in V2
  altText: string;
  altTextZh?: string; // Chinese translation
  imageType: ImageType;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

// ---- Checklist (localStorage — Sprint 7) ----

export interface ChecklistItemData {
  id: string;
  areaId: string;
  roomTypeSlug: string;
  title: string;
  description: string;
  sortOrder: number;
}

export interface CheckedItems {
  [roomTypeSlug: string]: string[]; // array of checked areaIds
}

// ---- Search (Sprint 5) ----

export interface SearchResultItem {
  areaId: string;
  areaName: string;
  roomTypeSlug: string;
  roomTypeName: string;
  matchedText: string; // snippet with match
  matchedField: string; // field where match was found
}

// ---- API Response Envelope ----

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}
