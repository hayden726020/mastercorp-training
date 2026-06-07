---
name: architecture-decisions
description: Confirmed layout and interaction design decisions from 2026-06-02 review
metadata:
  type: project
---

# Architecture Decisions — Confirmed 2026-06-02

## Decision 1: Area Detail Display Method
**Choice: Option C — Modal overlay**
- Clicking a hotspot on the room panorama opens a centered modal (not bottom sheet, not page navigation)
- Modal contains: image gallery, requirements, notes, common mistakes
- Full-screen image viewer accessible from within the modal

## Decision 2: A/B Compare Page — Mobile Layout
**Choice: Option A — Top-bottom stacking**
- Mobile: vertical stack (A Suite content → B Suite content → differences table)
- Desktop: side-by-side layout with image compare slider
- Final product = mobile page + desktop page as distinctly optimized layouts

## Decision 3: Admin Mobile Navigation
**Choice: Option A — Hamburger + Bottom Tab Bar**
- App-style navigation: top hamburger menu + bottom tab navigation bar
- Bottom tabs: Dashboard | Rooms | Content | Images | Settings

## Decision 4: Home Page Room Cards
**Choice: Option B — Large image cards**
- Each room type card uses its cover image as a background
- Room name and description overlaid on the image
- Desktop: 2-column grid; Mobile: single column full-width cards

## Decision 5: Checklist Progress Storage
**Choice: Option A — localStorage (for now)**
- Phase 1: localStorage only, no login required
- Future: migrate to server-side storage when user accounts are implemented
- Design the ChecklistService interface to be swappable (localStorage → API) later

**Why:** Simple MVP, no auth dependency. Users can use checklist immediately.
**How to apply:** Implement a ChecklistStore interface with localStorage adapter first. Swap to API adapter when server auth is ready.
