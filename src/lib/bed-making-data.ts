// ============================================================
// 8-Step Bed-Making Process — Bilingual (Chinese · English)
// ============================================================
// Used by the bedroom hotspot interface and bed-making dedicated page.

export interface BedMakingStep {
  step: number;
  zh: string;          // Chinese step name (e.g. "铺床笠")
  zhDetail: string;    // Chinese full description
  en: string;          // English step name (e.g. "King Fitted Sheet")
  enDetail: string;    // English full description
}

export const BED_MAKING_STEPS: BedMakingStep[] = [
  {
    step: 1,
    zh: "铺床笠",
    zhDetail: "将 King Fitted Sheet 套在床垫上，四个角全部拉紧，确保没有松脱。",
    en: "King Fitted Sheet",
    enDetail: "Fit the King Fitted Sheet over the mattress, pulling all four corners tight to ensure no looseness.",
  },
  {
    step: 2,
    zh: "铺第一层平床单",
    zhDetail: "将 King Flat Sheet 铺在床上，床头位置多留约两根手指宽（约2–3英寸）垂出床垫。",
    en: "First Flat Sheet",
    enDetail: "Lay the first King Flat Sheet on the bed, leaving about two finger widths (approx. 2–3 inches) hanging over the mattress at the head.",
  },
  {
    step: 3,
    zh: "铺被子",
    zhDetail: "将 Duvet 平铺在床中央，被子顶部与床头边缘齐平。",
    en: "Duvet",
    enDetail: "Spread the Duvet flat in the center of the bed, with the top edge aligned flush with the head of the bed.",
  },
  {
    step: 4,
    zh: "铺第二层平床单",
    zhDetail: "再铺一张 King Flat Sheet，床单顶部与 Duvet 顶部对齐。",
    en: "Second Flat Sheet",
    enDetail: "Lay another King Flat Sheet on top, with the top edge aligned with the Duvet top edge.",
  },
  {
    step: 5,
    zh: "做床头翻边",
    zhDetail: "将第2步多留出来的床单向上翻折回来，盖住 Duvet 顶部，翻折宽度约1英寸左右，看起来整齐平直。",
    en: "Head Fold",
    enDetail: "Fold the excess sheet from Step 2 back over the Duvet top edge, approximately 1 inch wide, ensuring it looks neat and straight.",
  },
  {
    step: 6,
    zh: "收床尾和两侧",
    zhDetail: "将床尾及两侧所有多余的床单和被子塞入床垫下，拉紧表面，确保没有明显褶皱。",
    en: "Tuck Foot & Sides",
    enDetail: "Tuck all excess sheets and duvet at the foot and sides under the mattress, pulling the surface taut to ensure no visible wrinkles.",
  },
  {
    step: 7,
    zh: "套枕头",
    zhDetail: "先套 Pillow Protector（枕芯保护套），再套 Pillow Case（枕套），整理平整，枕套开口朝内侧。",
    en: "Pillow Covers",
    enDetail: "First put on the Pillow Protector, then the Pillow Case, smoothing flat with the case opening facing inward.",
  },
  {
    step: 8,
    zh: "摆放枕头",
    zhDetail: "将枕头居中放在床头，左右对称，高度一致。",
    en: "Arrange Pillows",
    enDetail: "Place pillows centered at the head of the bed, symmetrically arranged at equal height.",
  },
];

/** Area IDs that should show the bed-making button */
export const BED_AREA_IDS: Set<string> = new Set(["area-a-bed", "area-b-bed"]);
