import type { RoomType, RoomArea, AreaContent } from "@/types";
import roomsData from "./rooms.json";
import areasData from "./areas.json";
import contentData from "./content.json";

// Cast JSON imports to proper types — runtime values match string enums
// (e.g. ImageType.STANDARD = "STANDARD", HotspotType.POINT = "POINT")
const rooms = roomsData as RoomType[];
const areas = areasData as RoomArea[];
const content = contentData as AreaContent[];

export const getRooms = () => rooms;
export const getAreas = () => areas;
export const getContent = () => content;

export const getRoomBySlug = (slug: string) =>
  rooms.find((r) => r.slug === slug) ?? null;

export const getAreasByRoom = (roomTypeId: string) =>
  areas
    .filter((a) => a.roomTypeId === roomTypeId)
    .sort((a, b) => a.sortOrder - b.sortOrder);

export const getContentByArea = (areaId: string) =>
  content.find((c) => c.areaId === areaId) ?? null;
