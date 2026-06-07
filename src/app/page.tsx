import { BRAND_NAME, PROPERTY_NAME } from "@/lib/constants";
import { getRooms } from "@/data";
import RoomTypeCard from "@/components/room/room-type-card";

export default function HomePage() {
  const rooms = getRooms();

  // Only show active rooms, sorted by sortOrder
  const activeRooms = rooms
    .filter((r) => r.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="flex flex-col items-center px-4 py-10 md:py-16">
      {/* ============================================
           Hero Section
           ============================================ */}
      <div className="flex flex-col items-center gap-5 text-center max-w-2xl">
        {/* Main brand heading */}
        <h1 className="text-hero font-bold text-primary tracking-tight leading-[1.05]">
          {BRAND_NAME}
        </h1>

        {/* Property subtitle */}
        <h2 className="text-section-title font-medium text-foreground/80 tracking-tight">
          {PROPERTY_NAME}
        </h2>

        {/* Description */}
        <p className="text-body text-muted-foreground max-w-md leading-relaxed">
          Select a room type below to explore detailed placement standards and
          training materials.
        </p>
      </div>

      {/* ============================================
           Room Type Cards
           ============================================ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl mt-8 md:mt-10">
        {activeRooms.map((room) => (
          <RoomTypeCard key={room.id} room={room} />
        ))}
      </div>

    </div>
  );
}
