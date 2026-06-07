# Holiday Resort Housekeeper Training System
# 开发路线图（ROADMAP）V1.0

---

## 文档信息

| 字段 | 内容 |
|------|------|
| 版本 | V1.1 (Aligned with SAD V1.1) |
| 创建日期 | 2026-06-02 |
| 依据文档 | PRD V1.0 / SAD V1.1 / PAGE-PROTOTYPES V1.1 / ARCHITECTURE_DECISIONS / SAD-V1.1-CHANGELOG |
| 开发策略 | Sprint 递进式，每 Sprint 独立可运行，Mock Data 先行，V1 够用即止 |

---

## 目录

1. [总览](#1-总览)
2. [Sprint 0：项目骨架搭建](#sprint-0项目骨架搭建)
3. [Sprint 1：首页 — 房型选择](#sprint-1首页--房型选择)
4. [Sprint 2：房型总览 — 全景图与热点地图](#sprint-2房型总览--全景图与热点地图)
5. [Sprint 3：Modal 区域详情](#sprint-3modal-区域详情)
6. [Sprint 4：区域详情独立页 + 图片画廊](#sprint-4区域详情独立页--图片画廊)
7. [Sprint 5：搜索系统](#sprint-5搜索系统)
8. [Sprint 6：A/B 对比系统](#sprint-6ab-对比系统)
9. [Sprint 7：检查清单系统](#sprint-7检查清单系统)
10. [Sprint 8：数据库接入 + Prisma 迁移](#sprint-8数据库接入--prisma-迁移)
11. [Sprint 9：认证与用户角色](#sprint-9认证与用户角色)
12. [Sprint 10：管理后台 — 房型 CRUD](#sprint-10管理后台--房型-crud)
13. [Sprint 11：管理后台 — 热点编辑器](#sprint-11管理后台--热点编辑器)
14. [Sprint 12：管理后台 — 内容与图片管理](#sprint-12管理后台--内容与图片管理)
15. [Sprint 13：图片上传 — Cloudinary 集成](#sprint-13图片上传--cloudinary-集成)
16. [Sprint 14：测试 + 响应式验证 + 性能优化](#sprint-14测试--响应式验证--性能优化)
17. [Sprint 15：Vercel 部署 + 生产配置](#sprint-15vercel-部署--生产配置)

---

## 1. 总览

### 1.1 Sprint 阶段图

```
Phase 1 ─── 基础骨架 + Mock Data ───┐
  Sprint 0: 项目骨架搭建              │
  Sprint 1: 首页                     │  可演示 ← MVP-1
  Sprint 2: 房型总览 + 热点          │  可演示 ← MVP-2
  Sprint 3: Modal 区域详情           │  可演示 ← MVP-3
  Sprint 4: 详情页 + 图片画廊        │
  Sprint 5: 搜索                     │
  Sprint 6: A/B 对比                 │
  Sprint 7: 检查清单                 │  可演示 ← MVP-4
                                     │
Phase 2 ─── 数据库 + 认证 ──────────┘
  Sprint 8: 数据库接入               │
  Sprint 9: 认证 + 角色              │  可演示 ← MVP-5
                                     │
Phase 3 ─── 管理后台 ────────────────┘
  Sprint 10: 房型 CRUD               │
  Sprint 11: 热点编辑器              │
  Sprint 12: 内容 + 图片管理         │
  Sprint 13: Cloudinary 上传         │  可演示 ← MVP-6
                                     │
Phase 4 ─── 质量 + 上线 ─────────────┘
  Sprint 14: 测试 + 性能             │
  Sprint 15: Vercel 部署             │  🚀 上线
```

### 1.2 Mock Data 策略

Sprint 0-7 所有数据来自静态 Mock 文件：

```
src/
├── mock/
│   ├── rooms.ts            # 房型列表（A Suite, B Suite）
│   ├── areas.ts            # 区域/热点数据（含 hotspotType + coordinates）
│   ├── content.ts          # 区域详情内容
│   ├── images.ts           # 占位图片URL（含 imageType）
│   ├── placement-standards.ts  # ★ 标准要求（V1.1 新增）
│   ├── search-index.ts     # 搜索索引
│   └── checklist.ts        # 检查清单初始数据（localStorage 用）
```

Sprint 8 起逐步替换为数据库查询，Mock 文件作为 Fallback。

---

## Sprint 0：项目骨架搭建

> **目标**: 搭建可运行的空项目骨架，配置所有基础设施，不包含任何业务代码。

### 开发目标

- 使用 `create-next-app` 初始化 Next.js 14 App Router 项目
- 安装并配置所有依赖
- 建立目录结构（按 SAD 4.1 节）
- 配置 Tailwind + shadcn/ui 基础组件
- 配置 TypeScript 严格模式
- 配置 ESLint + Prettier
- 建立全局 Layout（Header + Main + Footer 骨架）
- 配置设计 Token（CSS 变量：颜色、字体、间距、圆角、阴影）
- 创建 Mock Data 空壳文件

### 涉及文件

```
next.config.js                     # Next.js 配置
tsconfig.json                      # TS 严格模式
tailwind.config.ts                 # 自定义颜色/字体/断点
postcss.config.js                  # PostCSS
.eslintrc.json                     # ESLint
.prettierrc                        # Prettier
src/
├── app/
│   ├── layout.tsx                 # 根布局（Metadata + HTML结构）
│   ├── page.tsx                   # 占位首页
│   └── globals.css                # Tailwind + 设计Token
├── components/
│   └── ui/                        # shadcn/ui 初始化组件
│       ├── button.tsx
│       └── card.tsx
├── lib/
│   ├── utils.ts                   # cn() 合并className工具
│   └── constants.ts               # 项目常量
├── mock/
│   ├── rooms.ts                   # 空数据壳
│   ├── areas.ts
│   ├── content.ts
│   └── images.ts
├── types/
│   └── index.ts                   # 核心类型定义
└── styles/
    └── tokens.css                 # 设计Token（可选，或合并到globals.css）
```

### 验收标准

- [x] `pnpm dev` 启动成功，页面显示占位内容
- [x] `pnpm build` 无报错
- [x] `pnpm lint` 通过
- [x] Tailwind 自定义颜色生效（Holiday Resort Blue 等）
- [x] 目录结构与 SAD 4.1 一致
- [x] shadcn/ui Button 和 Card 组件可正常 import 使用
- [x] TypeScript 严格模式无类型错误

### 风险点

| 风险 | 等级 | 缓解 |
|------|------|------|
| shadcn/ui 初始化依赖版本冲突 | LOW | 使用官方 CLI `pnpm dlx shadcn-ui@latest init` |
| Tailwind v3 → v4 配置语法变化 | LOW | 锁定 Tailwind 3.x 版本 |
| Next.js 14 App Router 目录结构与文档不符 | LOW | 严格使用 `src/app/` 约定 |

---

## Sprint 1：首页 — 房型选择

> **目标**: 实现首页，显示房型大图卡片，点击可跳转。全部使用 Mock 数据。
>
> **依赖**: Sprint 0 完成

### 开发目标

- 首页完整 UI（参考原型图 Page 1）
- SearchBar 顶部搜索框（UI 占位，功能 Sprint 5 实现）
- RoomTypeCard 大图卡片组件（封面图 + 名称 + 简介 + 箭头）
- 快捷入口卡片（Checklist、Compare — 链接占位）
- 响应式：Mobile 单列 / Desktop 双列
- 点击卡片跳转到 `/rooms/[slug]`

### 涉及文件

```
新增:
src/app/page.tsx                   # 首页（更新占位内容为完整页面）
src/components/layout/
├── mobile-header.tsx              # 顶部Header + SearchBar占位
└── footer.tsx                     # 页脚
src/components/room/
├── room-type-card.tsx             # 大图卡片组件
└── quick-link-card.tsx            # 快捷入口卡片
src/mock/rooms.ts                  # 填充 Mock 数据

修改:
src/app/layout.tsx                 # 接入 Header
src/types/index.ts                 # 补充 RoomType 类型
```

### 验收标准

- [ ] 首页显示 Resort Logo + "Housekeeper Training" 标题
- [ ] 显示 A Suite 和 B Suite 两张封面大图卡片
- [ ] 卡片包含：封面图、房型名称、简介、"View →" 按钮
- [ ] 点击 A Suite 卡片 → 跳转到 `/rooms/a-suite`
- [ ] 点击 B Suite 卡片 → 跳转到 `/rooms/b-suite`
- [ ] 底部显示 Checklist 和 Compare 快捷入口（跳转占位）
- [ ] Mobile (375px): 单列全宽卡片
- [ ] Desktop (1440px): 双列并排卡片
- [ ] 页面加载无 JS 错误

### 风险点

| 风险 | 等级 | 缓解 |
|------|------|------|
| 封面图片缺失（无真实图片） | MEDIUM | 使用 `picsum.photos` 或 `placehold.co` 占位图 |
| 卡片hover效果在不同设备表现不一致 | LOW | 使用 `hover:` + `active:` Tailwind 伪类 |

---

## Sprint 2：房型总览 — 全景图与热点地图

> **目标**: 实现房型总览页，全景图上覆盖可点击热点标记。
>
> **依赖**: Sprint 1 完成

### 开发目标

- 动态路由 `/rooms/[slug]` 页面
- RoomPanorama 全景图展示组件
- HotspotOverlay 热点覆盖层（CSS absolute positioning）
- HotspotMarker 热点标记组件（脉冲动画 + 图标 + 标签）
- AreaQuickLinks 横向滚动区域快链
- 点击热点 → 控制台输出 areaId（Sprint 3 接 Modal）
- 响应式：桌面端全景图居中放大

### 涉及文件

```
新增:
src/app/rooms/[slug]/page.tsx      # 房型总览页
src/app/rooms/[slug]/layout.tsx    # 房型子导航布局
src/components/room/
├── room-panorama.tsx              # 全景图容器（relative定位基准）
├── hotspot-overlay.tsx            # 热点覆盖层
├── hotspot-marker.tsx             # 单个热点标记（absolute定位）
└── area-quick-links.tsx           # 横向滚动区域快链
src/mock/areas.ts                  # 填充 A/B Suite 热点坐标数据

修改:
src/types/index.ts                 # 补充 RoomArea 类型
src/mock/rooms.ts                  # 补充 panorama 全景图URL
```

### 验收标准

- [ ] 访问 `/rooms/a-suite` → 显示 A Suite 全景图
- [ ] 访问 `/rooms/b-suite` → 显示 B Suite 全景图
- [ ] 全景图上有多个 HotspotMarker，位置与 Mock 数据一致
- [ ] HotspotMarker 有脉冲动画效果（CSS animation）
- [ ] 每个 HotspotMarker 显示区域名称（Bed Area / TV Cabinet / ...）
- [ ] 全景图下方有横向滚动的 AreaQuickLinks chips
- [ ] 点击 HotspotMarker → `console.log(areaId)` 输出正确
- [ ] 点击 AreaQuickLink → `console.log(areaId)` 输出正确
- [ ] 页面顶部有 Breadcrumb（← Back to Home / A Suite）
- [ ] Mobile: 全景图全宽显示
- [ ] Desktop: 全景图居中、最大宽度限制

### 风险点

| 风险 | 等级 | 缓解 |
|------|------|------|
| 热点坐标在不同屏幕尺寸下偏移 | HIGH | 使用百分比定位（x%, y%），而非固定px；Sprint 2 先确定算法 |
| 全景图宽高比不一致导致热点错位 | MEDIUM | 使用固定的 aspect-ratio 容器，或限定图片尺寸 |
| 移动端热点太小难以点击 | MEDIUM | 设置最小 44x44px 触摸区域（Apple HIG） |

---

## Sprint 3：Modal 区域详情

> **目标**: 点击热点 → 弹出 Modal 显示区域详情（图片+要求+错误）。
>
> **依赖**: Sprint 2 完成
>
> **架构决策**: 基于 ARCHITECTURE_DECISIONS #1 — Modal 方案

### 开发目标

- AreaDetailModal 居中弹出组件（shadcn/ui Dialog 定制）
- Modal 内容：区域名称、缩略图列表、标准要求（✓）、常见错误（✗）
- "View Full Details" 按钮 → 占位跳转到详情页
- 背景半透明遮罩 + 点击遮罩关闭
- ✕ 关闭按钮
- 打开/关闭动画（fade + scale）
- 图片占位（Sprint 4 完善图片画廊）

### 涉及文件

```
新增:
src/components/room/
├── area-detail-modal.tsx          # Modal 容器 + 内容编排
├── area-requirements-list.tsx     # 标准要求列表（✓）
├── area-mistakes-list.tsx         # 常见错误列表（✗）
└── area-image-preview.tsx         # 图片预览（Sprint 3 为静态占位）

src/mock/content.ts                # 填充 A/B Suite 所有区域内容数据

修改:
src/app/rooms/[slug]/page.tsx      # 接入 Modal 状态管理
src/components/room/hotspot-marker.tsx  # 点击 → 触发 Modal
src/types/index.ts                 # 补充 AreaContent 类型
```

### 验收标准

- [ ] 点击 HotspotMarker → Modal 居中弹出，带打开动画
- [ ] Modal 显示区域名称（如 "Bed Area"）
- [ ] Modal 显示 3 张占位图片（灰色占位 + 图片编号）
- [ ] Modal 显示标准要求列表（绿色 ✓ 符号，至少 4 条）
- [ ] Modal 显示常见错误列表（红色 ✗ 符号，至少 3 条）
- [ ] 点击遮罩层 → Modal 关闭
- [ ] 点击 ✕ 按钮 → Modal 关闭
- [ ] 点击 "View Full Details" → 跳转到 `/rooms/[slug]/[areaId]`（Sprint 4 实现目标页）
- [ ] 不同热点弹出不同内容（Bed ≠ Bathroom ≠ Coffee Station）
- [ ] Mobile: Modal 宽度 90vw，内容可滚动
- [ ] Desktop: Modal 最大宽度 640px

### 风险点

| 风险 | 等级 | 缓解 |
|------|------|------|
| Modal 内部滚动与页面滚动冲突 | MEDIUM | 使用 `overflow-hidden` 锁定 body 滚动 |
| iOS Safari 上 Modal 居中问题 | MEDIUM | 使用 `fixed inset-0` + `flex items-center justify-center` |
| z-index 层级冲突（Header sticky > Modal 遮罩？） | LOW | Modal 遮罩使用 z-50，Header 使用 z-40 |

---

## Sprint 4：区域详情独立页 + 图片画廊

> **目标**: 实现完整的区域详情独立页和图片画廊功能。
>
> **依赖**: Sprint 3 完成

### 开发目标

- 动态路由 `/rooms/[slug]/[areaId]` 区域详情页
- ImageGallery 图片画廊组件（主图 + 左右切换 + 缩略图导航）
- ImageViewer 全屏查看器（深色背景 + 捏合缩放 + 左右滑动）
- 完整内容区：Description + Requirements + Notes + Common Mistakes
- RelatedAreasLinks 相关区域链接
- AreaBreadcrumb 面包屑导航

### 涉及文件

```
新增:
src/app/rooms/[slug]/[areaId]/
├── page.tsx                       # 区域详情独立页
├── layout.tsx                     # (可选) 详情页布局
src/components/image/
├── image-gallery.tsx              # 图片画廊（主图+缩略图）
├── image-viewer.tsx               # 全屏查看器
└── thumbnail-nav.tsx              # 缩略图导航条
src/mock/images.ts                 # 填充占位图片URL列表

修改:
src/components/room/area-detail-modal.tsx  # "View Full Details" 链接生效
src/types/index.ts                         # 补充 AreaImage 类型
```

### 验收标准

- [ ] 访问 `/rooms/a-suite/[areaId]` → 显示完整区域详情
- [ ] 顶部 Breadcrumb: Home > A Suite > Bed Area
- [ ] ImageGallery 显示主图（大图）
- [ ] 点击左/右箭头 → 切换到上/下一张图片
- [ ] 底部缩略图导航条，当前图片高亮
- [ ] 点击缩略图 → 主图切换到对应图片
- [ ] 点击主图 → 全屏查看器打开
- [ ] 全屏查看器中左右滑动切换图片
- [ ] 全屏查看器中可捏合缩放图片
- [ ] 全屏查看器显示 "3 / 8" 图片计数器
- [ ] 全屏查看器底部保留缩略图条
- [ ] Description / Requirements / Notes / Mistakes 四个区块内容完整
- [ ] 底部 Related Areas 链接可点击跳转
- [ ] Mobile: 图库全宽，内容区垂直排列
- [ ] Desktop: 图库在左，内容在右（侧边栏式）

### 风险点

| 风险 | 等级 | 缓解 |
|------|------|------|
| 捏合缩放（pinch zoom）在移动端实现复杂 | HIGH | 使用 `react-zoom-pan-pinch` 库或 CSS `touch-action` 处理 |
| [areaId] 路由不存在时的 404 处理 | MEDIUM | Next.js `notFound()` 处理无效 ID |
| 大量图片导致页面加载慢 | MEDIUM | 缩略图使用小尺寸URL，主图使用 `loading="lazy"` |

---

## Sprint 5：搜索系统

> **目标**: 全局搜索功能，输入关键词返回匹配区域结果。
>
> **依赖**: Sprint 4 完成

### 开发目标

- 顶部 SearchBar 展开/收起动画
- 搜索输入 → 客户端模糊匹配 Mock 数据索引
- SearchPage 搜索结果页
- SearchResultCard 结果卡片（缩略图 + 区域名 + 房型 + 高亮摘要）
- 高亮匹配关键词
- URL 参数同步（`/search?q=keyword`）
- 空状态 / 无结果状态

### 涉及文件

```
新增:
src/app/search/page.tsx            # 搜索结果页
src/components/search/
├── search-bar.tsx                 # 搜索栏（展开/收起 + 建议）
├── search-result-card.tsx         # 搜索结果卡片
└── search-highlight.tsx           # 关键词高亮组件
src/mock/search-index.ts           # 搜索索引 Mock 数据

修改:
src/components/layout/mobile-header.tsx  # 集成 SearchBar
src/app/layout.tsx                       # Header 状态管理
```

### 验收标准

- [ ] 点击 Header 搜索图标 → SearchBar 展开
- [ ] 输入 "Coffee" → 显示匹配建议下拉
- [ ] 搜索结果页面 URL 为 `/search?q=Coffee`
- [ ] 直接访问 `/search?q=Coffee` → 显示对应结果
- [ ] 结果卡片显示：缩略图、区域名称、所属房型、匹配摘要
- [ ] 摘要中 "Coffee" 关键词高亮（黄色背景 或 主色）
- [ ] 点击结果卡片 → 跳转到对应区域详情页
- [ ] 搜索 "xyz" 无匹配 → 显示 "No results found" 空状态
- [ ] 输入框右侧 ✕ 清除按钮可清空搜索
- [ ] Mobile: 搜索栏占满 Top Bar
- [ ] Desktop: 搜索栏居中，宽度约 480px

### 风险点

| 风险 | 等级 | 缓解 |
|------|------|------|
| 中文输入法 composition 事件导致过早触发搜索 | MEDIUM | 使用 `compositionstart` / `compositionend` 事件处理 |
| 大量 Mock 数据下模糊搜索性能 | LOW | Sprint 5 数据量小（<100条），后续 Sprint 8 切换到 DB FTS |
| 搜索建议下拉与键盘重叠（移动端） | LOW | 使用 `visualViewport` API 检测键盘高度 |

---

## Sprint 6：A/B 对比系统

> **目标**: 实现 A Suite 与 B Suite 的并列对比功能。
>
> **依赖**: Sprint 4 完成
>
> **架构决策**: 基于 ARCHITECTURE_DECISIONS #2 — 移动端上下堆叠 / 桌面端左右分栏

### 开发目标

- `/rooms/compare?left=a-suite&right=b-suite` 对比页
- RoomCompareView 双列对比视图
- CompareImageSlider 图片对比滑块（拖拽分界线）
- CompareTable 差异对比表格
- 差异高亮（DiffHighlight）
- 房型选择器（可切换对比 A vs C 等）

### 涉及文件

```
新增:
src/app/rooms/compare/page.tsx     # A/B 对比页
src/components/compare/
├── room-compare-view.tsx          # 对比主视图
├── compare-image-slider.tsx       # 图片对比滑块
├── compare-table.tsx              # 差异表格
└── compare-row.tsx                # 单行对比

修改:
src/app/page.tsx                   # "Compare Rooms" 快捷链接生效
```

### 验收标准

- [ ] 访问 `/rooms/compare?left=a-suite&right=b-suite` → 显示对比页
- [ ] 页面顶部显示 A Suite | B Suite 两个 Tab 标题
- [ ] Mobile: A Suite 内容先展示（全景图+区域图片），向下滚动后是 B Suite
- [ ] Mobile: 底部差异表格（Area | A Suite | B Suite 三列）
- [ ] Desktop: 左右分栏，各占 50%
- [ ] Desktop: 图片对比滑块可拖拽，露出左侧 A / 右侧 B
- [ ] 差异表格中用颜色标注不同之处
- [ ] 选择不同房型组合（如切换为 B vs C）可刷新对比
- [ ] 任一房型不存在 → 返回友好错误提示

### 风险点

| 风险 | 等级 | 缓解 |
|------|------|------|
| 图片对比滑块在移动端体验差 | MEDIUM | 移动端不启用滑块，改用上下堆叠 + 颜色表格 |
| 两房型区域数量不一致时表格如何处理 | MEDIUM | 取并集，缺失区域显示 "—" |
| 拖拽滑块在触摸设备上的事件冲突 | MEDIUM | 使用 `touch-action: none` 并阻止页面滚动 |

---

## Sprint 7：检查清单系统

> **目标**: 员工可勾选完成项，查看实时进度。
>
> **依赖**: Sprint 4 完成
>
> **架构决策**: 基于 ARCHITECTURE_DECISIONS #5 — localStorage 存储

### 开发目标

- `/checklist` 检查清单页
- RoomTypeTabs 房型切换
- ChecklistProgress 环形进度条（SVG）
- ChecklistList + ChecklistItem 可勾选列表
- localStorage 持久化勾选状态
- "Reset All" 重置功能
- 点击列表项 → 跳转区域详情

### 涉及文件

```
新增:
src/app/checklist/page.tsx         # 检查清单页
src/components/checklist/
├── checklist-list.tsx             # 清单列表容器
├── checklist-item.tsx             # 单项（□ / ☑ 动画）
├── checklist-progress.tsx         # SVG 环形进度条
└── checklist-store.ts             # localStorage 读/写钩子
src/mock/checklist.ts              # 清单项 Mock 数据

修改:
src/types/index.ts                 # 补充 ChecklistItem 类型
```

### 验收标准

- [ ] 访问 `/checklist` → 显示 A Suite 的检查清单
- [ ] 顶部 Tab 可切换 [A Suite] [B Suite]
- [ ] 环形进度条显示当前百分比（如 "85%"）
- [ ] 进度标签显示 "7 of 8 items checked"
- [ ] 列表每一项有 □ Checkbox + 区域名称 + 子项描述 + → 链接
- [ ] 点击 □ → 变为 ☑（绿色，带勾选动画）
- [ ] 再次点击 ☑ → 变回 □
- [ ] 进度条随勾选实时更新（动画过渡）
- [ ] 刷新页面 → 勾选状态保留（localStorage）
- [ ] 切换到 B Suite Tab → 显示 B Suite 清单，有独立进度
- [ ] "Reset All" 按钮 → 清除当前房型所有勾选
- [ ] 点击 → 链接 → 跳转到对应区域详情页

### 风险点

| 风险 | 等级 | 缓解 |
|------|------|------|
| localStorage 配额不足或被禁用 | LOW | try/catch 包裹 + 降级到内存状态 |
| 不同房型清单项 ID 冲突 | LOW | localStorage key 包含 roomType slug |
| SVG 圆环在 Safari 上渲染异常 | LOW | 使用标准 SVG stroke-dasharray 方案 |

---

## Sprint 8：数据库接入 + Prisma 迁移

> **目标**: 将 Mock Data 迁移到 PostgreSQL 数据库，建立 Prisma ORM 层。
>
> **依赖**: Sprint 7 完成（全功能 Mock 版可跑）

### 开发目标

- 配置 PostgreSQL 连接（本地 Docker 或 Supabase Free Tier）
- Prisma Schema 迁移（按 SAD 6.2 节）
- 创建 seed 脚本（将 Mock 数据导入数据库）
- 建立 Service 层（数据访问统一接口）
- 修改现有页面：从 Mock 读取 → 从 Service 读取
- Mock 数据保留作为 Fallback / 测试用

### 涉及文件

```
新增:
prisma/
├── schema.prisma                  # 数据库 Schema
├── migrations/                    # Prisma 迁移文件
└── seed.ts                        # 种子数据脚本
src/lib/
├── prisma.ts                      # Prisma Client 单例
├── db.ts                          # 数据库连接管理
src/services/
├── room-service.ts                # 房型数据访问
├── area-service.ts                # 区域数据访问
├── content-service.ts             # 内容数据访问
├── image-service.ts               # 图片数据访问
├── search-service.ts              # 搜索数据访问
└── checklist-service.ts           # 清单数据访问

修改:
src/app/page.tsx                   # 切换为 Service 数据源
src/app/rooms/[slug]/page.tsx      # 切换为 Service 数据源
src/app/rooms/[slug]/[areaId]/page.tsx
src/app/search/page.tsx
src/app/rooms/compare/page.tsx
src/app/checklist/page.tsx
.env                               # DATABASE_URL 配置
.env.example                       # 环境变量模板
package.json                       # 新增 prisma 相关脚本
```

### 验收标准

- [ ] `pnpm prisma migrate dev` → 数据库表创建成功
- [ ] `pnpm prisma db seed` → Mock 数据导入数据库
- [ ] `pnpm prisma studio` → 可视化查看数据
- [ ] 首页 / 房型总览 / 区域详情 / 搜索 → 均从数据库读取（行为与 Mock 版一致）
- [ ] 检查清单 localStorage 功能不受影响
- [ ] 所有现有页面无回归 Bug
- [ ] Service 层接口定义清晰（可替换实现）

### 风险点

| 风险 | 等级 | 缓解 |
|------|------|------|
| Prisma Schema 与实际需求不匹配 | MEDIUM | 先在 prisma studio 中验证关系后再写查询 |
| 数据库连接失败导致页面 500 | HIGH | Service 层捕获异常 + 友好错误页 |
| seed 数据与 Mock 数据不同步 | LOW | seed.ts 直接 import Mock 数据生成 |

---

## Sprint 9：管理后台认证（环境变量）

> **目标**: 实现单管理员简单登录，保护 `/admin/*` 路由。
>
> **依赖**: Sprint 8 完成
>
> **SAD V1.1 调整**: Auth.js + RBAC → 环境变量简单认证。V2 升级路径见 SAD V1.1 第 13 章。

### 开发目标

- 简单登录页 UI（参考原型图 Page 11）
- POST `/api/auth/admin` 验证环境变量
- httpOnly Cookie + 签名 token
- Middleware 检查 `/admin/*` 路由
- useAuth hook（客户端登录状态）
- Sign Out（清除 cookie）
- 环境变量：ADMIN_USERNAME / ADMIN_PASSWORD / AUTH_SECRET

### 涉及文件

```
新增:
src/app/auth/signin/page.tsx       # 简单登录页
src/lib/auth.ts                    # 环境变量认证 helper + cookie 管理
src/hooks/use-auth.ts              # 客户端认证状态 Hook
src/middleware.ts                   # Admin 路由守卫
src/app/api/auth/admin/route.ts    # POST 验证接口
src/app/api/auth/session/route.ts  # GET session 检查

修改:
.env                               # ADMIN_USERNAME / ADMIN_PASSWORD / AUTH_SECRET
.env.example                       # 环境变量模板
```

### 验收标准

- [ ] 访问 `/admin` → 未登录时重定向到 `/auth/signin`
- [ ] 输入正确 ADMIN_USERNAME + ADMIN_PASSWORD → 登录成功
- [ ] 输入错误凭据 → 显示 "Invalid credentials"
- [ ] 登录成功后访问所有 `/admin/*` 页面正常
- [ ] Sign Out 后清除 cookie，再次访问被拦截
- [ ] Cookie httpOnly + Secure（生产环境）
- [ ] 非管理员访问公开页面不受影响

### 风险点

| 风险 | 等级 | 缓解 |
|------|------|------|
| 环境变量密码泄露 | MEDIUM | httpOnly Cookie，不暴露到客户端 JS |
| 无多用户支持 | NOT A RISK | V1 仅需单管理员；V2 升级路径已规划 |
| Cookie 签名密钥泄露 | LOW | AUTH_SECRET 使用随机 32 字符 |

---

## Sprint 10：管理后台 — 房型 CRUD

> **目标**: 管理员可新增/编辑/删除房型。
>
> **依赖**: Sprint 9 完成

### 开发目标

- Admin Layout（Sidebar + Main Area）
- 管理仪表盘（统计卡片）
- 房型列表页（表格）
- 新增房型表单
- 编辑房型表单
- 删除确认对话框
- Server Actions 实现 CRUD
- 权限控制（仅 Supervisor+ 可编辑，仅 Admin 可删除）

### 涉及文件

```
新增:
src/app/(admin)/
├── layout.tsx                     # Admin 布局（Sidebar + Header）
├── admin/
│   ├── page.tsx                   # 仪表盘
│   ├── rooms/
│   │   ├── page.tsx               # 房型列表
│   │   ├── new/page.tsx           # 新增房型
│   │   └── [id]/edit/page.tsx     # 编辑房型
src/components/admin/
├── admin-sidebar.tsx              # 侧边栏导航
├── admin-mobile-nav.tsx           # 移动端底部Tab导航
├── room-form.tsx                  # 房型表单（新增/编辑共用）
├── room-table.tsx                 # 房型列表表格
└── delete-confirm-dialog.tsx      # 删除确认弹窗
src/services/room-service.ts       # 扩展：create/update/delete

修改:
src/lib/auth.ts                    # 角色验证 helper
src/middleware.ts                   # Admin 路由保护增强
```

### 验收标准

- [ ] 访问 `/admin` → 显示仪表盘（房型数、区域数、图片数统计卡片）
- [ ] 左侧 Sidebar 导航（Dashboard / Rooms / Content / Images / Users）
- [ ] `/admin/rooms` 显示房型表格（名称、Slug、区域数、状态、操作）
- [ ] 点击 "+ Add Room Type" → 跳转新增表单
- [ ] 新增表单：Name / Slug（自动生成）/ Description / Cover Image URL → 提交成功
- [ ] 编辑表单：预填现有数据，修改后提交
- [ ] 删除按钮 → 弹出确认对话框 → 确认后删除
- [ ] 删除后列表自动刷新
- [ ] 操作后显示 Toast 提示（成功/失败）
- [ ] Mobile: 汉堡菜单 + 底部 Tab 导航
- [ ] Desktop: 固定左侧 Sidebar 240px

### 风险点

| 风险 | 等级 | 缓解 |
|------|------|------|
| Server Actions 错误处理不完善 | MEDIUM | 统一 try/catch + Toast 提示 |
| 删除房型级联删除区域/内容/图片 | HIGH | Prisma `onDelete: Cascade` + 删除前二次确认 |
| 表单验证漏掉边界条件 | MEDIUM | 使用 Zod Schema 验证服务端 + 客户端 |

---

## Sprint 11：管理后台 — 热点编辑器

> **目标**: 在全景图上可视化拖拽编辑热点区域。
>
> **依赖**: Sprint 10 完成

### 开发目标

- 热点管理页面（在房型全景图上操作）
- 拖拽移动热点位置
- 拖拽调整热点大小（四角 Resize Handle）
- 新增热点按钮
- 删除热点按钮
- 热点属性面板（名称、坐标、尺寸、图标类型）
- 保存热点位置变更
- 拖拽库集成（如 `dnd-kit` 或 `react-draggable`）

### 涉及文件

```
新增:
src/app/(admin)/admin/rooms/[id]/areas/page.tsx  # 热点管理页
src/components/admin/
├── hotspot-editor.tsx             # 热点编辑器主组件
├── draggable-hotspot.tsx          # 可拖拽热点标记
└── hotspot-properties-panel.tsx   # 属性编辑面板

修改:
src/services/area-service.ts       # 扩展：create/update/delete/reorder
```

### 验收标准

- [ ] 访问管理后台房型列表 → 点击 "Manage Areas" → 进入热点编辑页
- [ ] 全景图显示所有现有热点（可拖拽状态）
- [ ] 拖拽热点标记 → 位置实时更新
- [ ] 拖拽热点四角 Handle → 大小实时调整
- [ ] 点击 "+ Add Hotspot" → 全景图中心新增一个默认热点
- [ ] 点击热点 → 右侧/底部显示属性面板
- [ ] 属性面板可编辑：名称、X%、Y%、Width、Height、图标
- [ ] "Save Positions" 按钮 → 提交所有热点变更
- [ ] 删除热点 → 确认后移除
- [ ] 编辑结果实时反映到前台页面（员工看到的全景图）

### 风险点

| 风险 | 等级 | 缓解 |
|------|------|------|
| 拖拽事件与触摸滚动冲突（移动端编辑） | HIGH | 管理后台热点编辑暂仅支持 Desktop；移动端用数字输入替代 |
| 保存后热点坐标与预览不一致 | MEDIUM | 坐标统一使用百分比（相对全景图容器），保存前进行归一化 |
| 同时编辑多个热点时的并发问题 | LOW | 使用批量更新接口，而非逐个保存 |

---

## Sprint 12：管理后台 — 内容 + 图片 + 标准管理

> **目标**: 编辑区域文字内容、标准要求（PlacementStandard）和图片排序。
>
> **依赖**: Sprint 11 完成
>
> **SAD V1.1 新增**: PlacementStandard 独立模型管理

### 开发目标

- 内容编辑器页（Title / Description / Notes / Common Mistakes）
- ★ PlacementStandard 标准列表管理（逐条增删改排序）
- 图片管理页（上传占位 / 拖拽排序 / Alt Text / 删除）
- 图片类型标识（STANDARD ✓ / WRONG ✗ / DETAIL 🔍）
- 从内容页快速跳转到图片管理

### 涉及文件

```
新增:
src/app/(admin)/admin/
├── areas/[areaId]/content/page.tsx   # 内容编辑器 + 标准管理
└── areas/[areaId]/images/page.tsx    # 图片管理

src/components/admin/
├── content-editor.tsx             # 文本编辑器 + 预览
├── standard-list.tsx              # ★ 标准要求可排序列表
├── standard-item.tsx              # ★ 单条标准（title + desc + 拖拽）
├── sortable-image-grid.tsx        # 可拖拽排序图片网格
└── sortable-image-item.tsx        # 单个图片卡片（含 ImageType badge）

src/services/placement-service.ts  # ★ 标准要求 CRUD

修改:
src/services/content-service.ts    # 扩展：update
src/services/image-service.ts      # 扩展：update/reorder/delete
```

### 验收标准

- [ ] 内容编辑器：Title / Description / Notes / Common Mistakes
- [ ] 支持 Markdown 输入 + 实时预览
- [ ] ★ 标准要求列表：逐条显示 title + description
- [ ] ★ 可拖拽排序标准项（或上移/下移按钮）
- [ ] ★ "+ Add Standard" → 新增一条空白标准 → 填写 title + description
- [ ] ★ 删除标准 → 确认后移除
- [ ] "Save All" → 内容 + 标准一起提交保存
- [ ] 图片管理页：网格显示所有图片缩略图
- [ ] 每张图片显示 ImageType badge（STANDARD / WRONG / DETAIL）
- [ ] 可编辑图片 Alt Text 和 ImageType
- [ ] 拖拽重新排序图片
- [ ] 删除图片确认
- [ ] 变更实时反映到前台
- [ ] 拖动图片可重新排序（拖拽手柄）
- [ ] 点击图片 → 编辑 Alt Text
- [ ] 删除按钮 → 移除图片
- [ ] 排序变更后保存
- [ ] 前台页面（员工端）立即反映更新

### 风险点

| 风险 | 等级 | 缓解 |
|------|------|------|
| Markdown 渲染 XSS 风险 | HIGH | 使用 DOMPurify 净化渲染输出 |
| 拖拽排序在移动端体验差 | MEDIUM | 移动端使用上移/下移按钮替代拖拽 |
| 保存内容后前台缓存不刷新 | MEDIUM | 使用 `revalidatePath()` 或 ISR on-demand revalidation |

---

## Sprint 13：图片上传 — Cloudinary 集成

> **目标**: 实现真实图片上传功能，替代占位图 URL 输入。
>
> **依赖**: Sprint 12 完成

### 开发目标

- Cloudinary SDK 服务端封装
- ImageUploadZone 拖拽上传组件
- 上传进度条
- 多文件同时上传
- 上传验证（类型：JPEG/PNG/WebP，大小：≤ 10MB）
- 自动生成缩略图（Cloudinary Transformation）
- 上传完成后自动关联到区域
- 管理后台图片管理页集成上传功能

### 涉及文件

```
新增:
src/components/admin/
├── image-uploader.tsx             # 图片上传组件
└── upload-progress-bar.tsx        # 上传进度条
src/lib/cloudinary.ts              # Cloudinary SDK 封装
src/app/api/admin/images/upload/route.ts  # 上传 API Route

修改:
src/app/(admin)/admin/areas/[areaId]/images/page.tsx  # 集成上传
.env                               # Cloudinary 环境变量
```

### 验收标准

- [ ] 图片管理页顶部有上传区域
- [ ] 拖拽图片文件到上传区域 → 开始上传
- [ ] 点击上传区域 → 打开文件选择对话框
- [ ] 上传中显示进度条（百分比）
- [ ] 支持一次选择多张图片同时上传
- [ ] 上传完成后自动出现在图片网格中
- [ ] 非图片文件被拒绝并提示
- [ ] 超过 10MB 文件被拒绝并提示
- [ ] 上传失败显示错误信息
- [ ] Cloudinary 自动生成缩略图版本
- [ ] 前台页面加载优化后的图片（`f_auto, q_auto`）

### 风险点

| 风险 | 等级 | 缓解 |
|------|------|------|
| Cloudinary API Key 泄露 | CRITICAL | 上传签名在服务端生成，API Secret 仅服务端使用 |
| 大文件上传超时 | MEDIUM | 使用 Cloudinary Upload Widget（客户端直传），不经过 Vercel Serverless |
| Vercel Serverless 函数超时限制 | MEDIUM | 图片上传走客户端直传 Cloudinary，不走 API Route |

---

## Sprint 14：质量验证 + 性能优化

> **目标**: 手动验证全流程，响应式检查，性能达标。V1 不强制自动化测试。
>
> **依赖**: Sprint 13 完成
>
> **SAD V1.1 调整**: Vitest/Playwright 延迟到 V2 或 Sprint 14 可选引入。

### 开发目标

- 手动测试 4 条核心用户流程
- 响应式断点手动验证（320 / 375 / 768 / 1024 / 1440）
- Lighthouse 性能审计（CWV 达标）
- 图片加载优化（next/image + Cloudinary `f_auto,q_auto`）
- Bundle 分析 + Tree-shaking 验证
- 无障碍基础检查（axe DevTools 手动扫描）
- Bug 修复（如有）

### 核心测试流程（手动）

```
流程 1: 首页 → 点击 A Suite → 全景图 → 点击热点 → Modal 弹出 → 查看要求
流程 2: Modal → "View Full Details" → 详情页 → 图片切换 → 全屏查看
流程 3: 搜索 "Coffee" → 结果列表 → 点击结果 → 对应详情页
流程 4: 检查清单 → 勾选 3 项 → 进度更新 → 刷新保留 → 切换房型
```

### 验收标准

- [ ] 4 条核心流程手动测试全部通过
- [ ] 320px / 375px / 768px / 1024px / 1440px 无横向溢出
- [ ] Mobile 端 Lighthouse Performance ≥ 80
- [ ] LCP < 2.5s, CLS < 0.1
- [ ] 图片全部使用 `next/image` 优化
- [ ] 无未使用的 JS 导入（Tree-shaking 有效）
- [ ] axe DevTools 无障碍扫描无 Critical 问题
- [ ] 管理后台 CRUD 操作验证通过

### 可选（如时间允许）

- [ ] Vitest 单元测试（Service 层）
- [ ] Playwright E2E 测试（1-2 条核心路径）

### 风险点

| 风险 | 等级 | 缓解 |
|------|------|------|
| 手动测试遗漏边缘场景 | MEDIUM | 制定测试 Checklist，逐项验证 |
| 移动端 Lighthouse 分数难以达标 | MEDIUM | 优先优化图片（Cloudinary + next/image）|
| 无自动化回归 | LOW | V1 功能冻结后不频繁变更 |

---

## Sprint 15：Vercel 部署 + 生产配置

> **目标**: 部署到 Vercel 生产环境，完成上线。
>
> **依赖**: Sprint 14 通过

### 开发目标

- Vercel 项目创建与配置
- 生产环境变量配置
- PostgreSQL 生产数据库（Supabase / Railway / Neon）
- Cloudinary 生产环境
- 自定义域名（如 training.holidayresort.com）
- CSP / 安全头配置
- 监控 + 错误追踪（可选：Sentry）
- 部署文档

### 涉及文件

```
新增:
docs/DEPLOYMENT.md                 # 部署文档
vercel.json                        # Vercel 配置（可选）

修改:
.env.production                    # 生产环境变量（不上传 Git）
next.config.js                     # CSP 头 + 图片域名白名单
```

### 验收标准

- [ ] `git push main` → Vercel 自动部署成功
- [ ] 生产环境所有页面可访问
- [ ] 数据库迁移在生产环境执行成功
- [ ] 图片上传到 Cloudinary 生产环境正常工作
- [ ] HTTPS 自动启用
- [ ] CSP 头生效（无 unsafe-inline）
- [ ] 自定义域名解析正常
- [ ] 部署文档清晰（可供运维人员参考）

### 风险点

| 风险 | 等级 | 缓解 |
|------|------|------|
| 生产数据库连接池耗尽 | MEDIUM | Prisma `connection_limit` 合理配置 |
| Cloudinary 免费额度不足 | LOW | 监控用量，设置告警 |
| Vercel Serverless 冷启动慢 | LOW | 培训内容页使用 SSG 预渲染 |

---

## 附录 A：Sprint 依赖关系图

```
Sprint 0 项目骨架
    │
    ▼
Sprint 1 首页
    │
    ▼
Sprint 2 房型总览 + 热点
    │
    ▼
Sprint 3 Modal 详情 ◄── 核心交互闭环 (MVP-3)
    │
    ├──────────────┬──────────────┐
    ▼              ▼              ▼
Sprint 4       Sprint 5       Sprint 6       Sprint 7
详情页+画廊     搜索           A/B 对比       检查清单
    │              │              │              │
    ├──────────────┴──────────────┴──────────────┘
    │                    │
    ▼                    ▼
Sprint 8 数据库 ←── 全部 Mock 功能完成 (MVP-4)
    │
    ▼
Sprint 9 认证
    │
    ▼
Sprint 10 管理后台 — 房型 CRUD
    │
    ▼
Sprint 11 热点编辑器
    │
    ▼
Sprint 12 内容 + 图片管理
    │
    ▼
Sprint 13 Cloudinary 上传
    │
    ▼
Sprint 14 测试 + 性能 (MVP-6)
    │
    ▼
Sprint 15 Vercel 部署 🚀
```

---

## 附录 B：MVP 里程碑

| MVP | 包含 Sprint | 可演示功能 | 预计可演示时间点 |
|-----|-------------|-----------|----------------|
| **MVP-1** | Sprint 0-1 | 首页展示房型卡片，可点击跳转 | Sprint 1 结束时 |
| **MVP-2** | Sprint 0-2 | 全景图 + 热点标记 + 点击输出 | Sprint 2 结束时 |
| **MVP-3** | Sprint 0-3 | 热点 → Modal 详情完整闭环 | Sprint 3 结束时 |
| **MVP-4** | Sprint 0-7 | 全部前台功能（Mock 数据） | Sprint 7 结束时 |
| **MVP-5** | Sprint 0-9 | 数据库 + 认证可用 | Sprint 9 结束时 |
| **MVP-6** | Sprint 0-14 | 全部功能 + 管理后台 + 上传 | Sprint 14 结束时 |
| **🚀 上线** | Sprint 0-15 | 生产环境部署 | Sprint 15 结束时 |

---

## 附录 C：技术债务跟踪 (V1.1)

| 债务项 | 引入 Sprint | 计划偿还 Sprint | 说明 |
|--------|-------------|-----------------|------|
| Mock 数据硬编码 | S1-7 | S8 | 切换为数据库后移除 |
| 占位图片 URL (picsum) | S1-4 | S13 | Cloudinary 集成后替换 |
| localStorage 检查清单 | S7 | V2 | V2 切换 DatabaseAdapter；V1 够用 |
| 搜索客户端模糊匹配 | S5 | S8 | 切换为 PostgreSQL LIKE/FTS |
| 无认证 | S1-7 | S9 | 环境变量单管理员登录 |
| 手动图片 URL 输入 | S10 | S13 | Cloudinary 上传组件替换 |
| 环境变量认证 → Auth.js | S9 | V2 | 多用户需求出现时按 SAD V1.1 第 13 章升级 |
| SWR → TanStack Query | S0 | V2 | 需要缓存策略/离线支持时 |
| 手动测试 → 自动化测试 | S14 | V2 | 需要 CI/CD 自动化回归时 |

---

> **ROADMAP 版本**: V1.1 (Aligned) | **创建日期**: 2026-06-02 | **更新**: 对齐 SAD V1.1
>
> **下一步**: Sprint 0 — 项目骨架搭建
