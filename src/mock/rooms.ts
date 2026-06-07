// Mock data for Room Types (Sprint 1)
import { RoomType } from "@/types";

export const mockRooms: RoomType[] = [
  {
    id: "room-a-suite",
    name: "A Suite",
    nameZh: "A 套房",
    slug: "a-suite",
    description:
      "Premium room with separate living area, king bed, and luxury bathroom. Highest standard placement requirements.",
    descriptionZh:
      "高级套房，配有独立起居区、特大床和豪华浴室。最高标准的摆放要求。",
    coverImage: "/images/rooms/a.png",
    panoramaImage: "/images/rooms/a-suite.jpg",
    sortOrder: 0,
    isActive: true,
  },
  {
    id: "room-b-suite",
    name: "B Suite",
    nameZh: "B 套房",
    slug: "b-suite",
    description:
      "Standard room with queen bed, espresso station, and mountain-view balcony. Comfortable yet efficient layout.",
    descriptionZh:
      "标准套房，配有大床、咖啡机和山景阳台。舒适而高效的布局。",
    coverImage: "/images/rooms/b-cover.png",
    panoramaImage: "/images/rooms/b-suite.png",
    sortOrder: 1,
    isActive: true,
  },
];
