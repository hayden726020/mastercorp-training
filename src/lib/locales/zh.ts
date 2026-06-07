// ============================================================
// Chinese (Simplified) — UI Translations Dictionary
// ============================================================

/**
 * All Chinese UI strings used across non-Home interfaces.
 *
 * **Page / component** keys use Chinese only (中文).
 * **Hotspot interface** keys (hotspot.*, content.*, area.view_full_details) keep
 *   bilingual format (中文 · English) — they render inside the hotspot modal.
 * **aria-label / metadata** keys use Chinese only (not shown visually).
 */
const zh: Record<string, string> = {
  // ── App metadata (visible) ──
  "app.name": "客房服务员培训",
  "app.tagline": "Mastercorp 专业客房服务培训系统",
  "brand.name": "Mastercorp",
  "property.name": "Big Cedar 荒野俱乐部",

  // ── Navigation / Breadcrumb ──
  "nav.home": "首页",
  "nav.back_to_home": "返回首页",
  "nav.breadcrumb": "面包屑导航",

  // ── Room page ──
  "room.not_found": "房间未找到",
  "room.area_count": "{count} 个区域含摆放标准",

  // ── Area detail page ──
  "area.not_found": "区域未找到",
  "area.cleaning_process": "清洁流程",
  "area.tap_to_expand": "点击展开",
  "area.related_areas": "相关区域",
  "area.related_areas_label": "相关区域",
  "area.view_full_details": "查看完整详情 · View Full Details",

  // ── Cards / CTAs ──
  "card.view_standards": "查看标准",
  "card.checklist": "检查清单",
  "card.checklist_desc": "追踪你的培训进度",
  "card.compare_rooms": "对比房间",
  "card.compare_desc": "A Suite 与 B Suite 并列对比",

  // ── Hotspot markers ──
  "hotspot.draggable": "（可拖动 — 拖动以重新定位）",
  "hotspot.go_to_area": "前往 {name}",
  "hotspot.no_areas": "此房间暂无热点区域 · No hotspot areas in this room",
  "hotspot.room_hotspots": "房间热点 · Room Hotspots",

  // ── Image gallery / viewer (aria-labels: Chinese only) ──
  "gallery.empty": "该区域的培训图片正在准备中",
  "gallery.label": "{name} — 图片画廊",
  "gallery.open_viewer": "在全屏查看器中打开 {alt}",
  "gallery.previous": "上一张图片",
  "gallery.next": "下一张图片",
  "gallery.thumbnails": "图片缩略图",
  "gallery.image_n_of_m": "图片 {n} / {m}",
  "gallery.image_n": "图片 {n}：{alt}",

  "viewer.close": "关闭查看器",
  "viewer.label": "{name} — 全屏图片查看器",
  "viewer.previous": "上一张图片",
  "viewer.next": "下一张图片",

  // ── Image type badges (visible) ──
  "imagetype.correct": "正确",
  "imagetype.wrong": "错误",
  "imagetype.detail": "细节",

  // ── Dialog ──
  "dialog.close": "关闭",

  // ── Content empty states (hotspot modal — stays bilingual) ──
  "content.preparing_images": "该区域的培训图片正在准备中 · Training images are being prepared",
  "content.preparing_content": "该区域的详细培训内容正在准备中 · Detailed training content is being prepared",

  // ── Step summary ──
  "steps.aria_label": "七步清洁流程",
  "step_summary.bilingual_header": "清洁流程 · Cleaning Process",

  // ── Custom icons ──
  "icon.toilet": "马桶",
  "icon.washbasin": "洗手盆",
};

/** Simple translation accessor with variable interpolation */
export function t(key: string, vars?: Record<string, string | number>): string {
  let text = zh[key];
  if (text === undefined) {
    console.warn(`[i18n] Missing translation key: "${key}"`);
    return key;
  }
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      text = text.replace(`{${k}}`, String(v));
    }
  }
  return text;
}

export default zh;
