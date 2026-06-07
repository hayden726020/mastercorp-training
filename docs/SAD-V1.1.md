# Holiday Resort Housekeeper Training System
# 系统架构设计文档（SAD）V1.1

---

## 文档信息

| 字段 | 内容 |
|------|------|
| 文档版本 | V1.1 (Simplified) |
| 创建日期 | 2026-06-02 |
| 前版本 | SAD V1.0 (2026-06-02) |
| 对应PRD | Housekeeper Training System PRD V1.0 |
| 对应决策 | ARCHITECTURE_DECISIONS.md (2026-06-02) |
| 适用范围 | V1.0 开发 |

### V1.1 核心变更

| 变更 | 说明 |
|------|------|
| 统一 Modal 展示 | 移除所有 Sheet/Panel 变体，仅保留 AreaDetailModal |
| 检查清单降级 | localStorage + Adapter 模式，延迟服务端同步到 V2 |
| 精简认证 | 单管理员环境变量认证，延迟 Auth.js + RBAC 到 V2 |
| 增强热点模型 | 支持 RECT / CIRCLE / POLYGON / POINT 四种形状 |
| 增强图片模型 | 区分 STANDARD / WRONG / DETAIL 三种图片类型 |
| 新增 PlacementStandard | 独立标准要求模型，替代 Markdown 字符串 |
| V1/V2 分层 | 明确标记 V1 必需 vs V2 增强 |

---

## 目录

1. [架构概述](#1-架构概述)
2. [技术选型](#2-技术选型)
3. [系统架构图](#3-系统架构图)
4. [前端架构](#4-前端架构)
5. [后端架构](#5-后端架构)
6. [数据架构](#6-数据架构)
7. [API 设计](#7-api-设计)
8. [路由设计](#8-路由设计)
9. [组件树设计](#9-组件树设计)
10. [安全架构](#10-安全架构)
11. [部署架构](#11-部署架构)
12. [扩展性设计](#12-扩展性设计)
13. [未来认证升级路径](#13-未来认证升级路径)
14. [V1 必需 vs V2 增强](#14-v1-必需-vs-v2-增强)

---

## 1. 架构概述

### 1.1 架构风格

采用 **全栈 Next.js 单体应用** 架构，利用 Next.js App Router 实现前后端一体化。

V1.1 简化原则：**够用即可，预留扩展点，不提前实现。**

```
┌──────────────────────────────────────────────────────┐
│                   Vercel Platform                     │
│                                                       │
│  ┌─────────────────────────────────────────────┐     │
│  │               Next.js App                    │     │
│  │                                              │     │
│  │  ┌──────────┐  ┌──────────────────────┐     │     │
│  │  │  Client   │  │    Server             │     │     │
│  │  │ Components│  │                       │     │     │
│  │  │           │  │  - API Routes         │     │     │
│  │  │  ┌──────┐ │  │  - Server Actions      │     │     │
│  │  │  │State │ │  │  - Database Queries    │     │     │
│  │  │  │(SWR) │ │  │  - Image Upload       │     │     │
│  │  │  └──────┘ │  └───────────────────────┘     │     │
│  │  └──────────┘                                   │     │
│  └─────────────────────────────────────────────┘     │
│          │                                            │
│          ▼                                            │
│  ┌──────────────────┐  ┌──────────────────────┐      │
│  │   PostgreSQL      │  │   Cloudinary/S3       │      │
│  │   (Primary DB)    │  │   (Image Storage)      │      │
│  └──────────────────┘  └──────────────────────┘      │
└──────────────────────────────────────────────────────┘
```

### 1.2 V1.1 设计原则

| 原则 | 说明 |
|------|------|
| **移动端优先** | 所有页面从 320px 宽度开始设计，逐级增强 |
| **模块化** | 按功能领域拆分模块，高内聚低耦合 |
| **类型安全** | 全栈 TypeScript，Prisma 自动生成类型 |
| **可扩展** | 数据模型支持无限新增房型，无需改代码 |
| **Mock 先行** | Sprint 0-7 使用 Mock Data，Sprint 8 接入数据库 |
| **够用即可** | V1 只做必要功能，复杂能力标记为 V2 增强 |
| **单向数据流** | URL → SWR(数据) → Component(展示)，无多余 Store |
| **预留扩展点** | 接口抽象（Adapter），V2 可替换实现无需重写业务逻辑 |

---

## 2. 技术选型

### 2.1 V1 核心技术栈

| 层级 | 技术 | 版本 | 选型理由 |
|------|------|------|----------|
| 框架 | Next.js | 14.x (App Router) | Server Components + API Routes |
| 语言 | TypeScript | 5.x | 全栈类型安全 |
| 样式 | Tailwind CSS | 3.x | 移动端优先响应式 |
| 组件库 | shadcn/ui | latest | 无包依赖，Tree-shakable |
| ORM | Prisma | 5.x | 类型安全 + 迁移管理 |
| 数据库 | PostgreSQL | 15+ | 生产级关系型数据库（Sprint 8 接入） |
| 图片存储 | Cloudinary | - | 图片优化 + CDN 分发（Sprint 13 接入） |
| 认证 | Environment Variables | - | V1 单管理员后台，环境变量认证 |
| 数据获取 | SWR | 2.x | 轻量级客户端数据获取 |
| 部署 | Vercel | - | Next.js 原生平台 |

### 2.2 V2 升级路径（不在 V1 实现）

| V1 技术 | V2 替换 | 触发条件 |
|---------|---------|----------|
| SWR | TanStack Query | 需要服务端缓存策略时 |
| Env Auth | Auth.js + RBAC | 多用户/多角色需求时 |
| localStorage 检查清单 | Server Sync | 跨设备同步需求时 |
| Mock Data | PostgreSQL | Sprint 8 自动切换 |

### 2.3 开发依赖

| 工具 | 用途 |
|------|------|
| ESLint | 代码规范 |
| Prettier | 代码格式化 |

> **V1 暂不引入**: Vitest (测试), Playwright (E2E) — 手动测试 + 浏览器 DevTools 在 V1 足够。Sprint 14 再引入。

---

## 3. 系统架构图

### 3.1 物理架构图

```
                          ┌──────────────┐
                          │   CDN/Edge   │
                          │  (Cloudinary) │
                          └──────┬───────┘
                                 │ Images
                                 │
  ┌──────────┐           ┌──────▼───────┐          ┌─────────────┐
  │  Mobile  │──────────▶│              │          │             │
  │  Browser │           │   Vercel     │─────────▶│ PostgreSQL  │
  └──────────┘           │   (Next.js)  │  Prisma  │ (Supabase/  │
                         │              │          │  Railway)   │
  ┌──────────┐           │              │          └─────────────┘
  │  Tablet  │──────────▶│              │
  │  Browser │           └──────────────┘
  └──────────┘                 │
                               │ Admin Auth
  ┌──────────┐           ┌──────▼───────┐
  │  Desktop │           │  ENV Var     │
  │  Browser │           │  (USER/PASS) │
  └──────────┘           └──────────────┘
```

### 3.2 逻辑分层架构

```
┌─────────────────────────────────────────────────────┐
│                    表示层 (Presentation)               │
│  ┌─────────┐ ┌──────────┐ ┌────────┐ ┌────────┐    │
│  │  Home   │ │ Overview │ │ Detail │ │ Admin  │    │
│  │  Page   │ │   Page   │ │  Page  │ │ Pages  │    │
│  └────┬────┘ └────┬─────┘ └───┬────┘ └───┬────┘    │
├───────┼───────────┼───────────┼───────────┼─────────┤
│       │           │           │           │          │
│  ┌────▼───────────▼───────────▼───────────▼────┐    │
│  │           业务逻辑层 (Business)               │    │
│  │  ┌────────┐ ┌──────────┐ ┌────────────┐     │    │
│  │  │ Room   │ │  Search  │ │  Checklist  │     │    │
│  │  │Service │ │  Service │ │  Adapter    │     │    │
│  │  └───┬────┘ └────┬─────┘ └─────┬───────┘     │    │
│  └──────┼───────────┼─────────────┼──────────────┘    │
├─────────┼───────────┼─────────────┼───────────────────┤
│         │           │             │                    │
│  ┌──────▼───────────▼─────────────▼───────────────┐   │
│  │             数据访问层 (Data Access)             │   │
│  │    Prisma ORM / Mock Service / localStorage     │   │
│  └────────────────────┬───────────────────────────┘   │
├───────────────────────┼───────────────────────────────┤
│                       │                                │
│  ┌────────────────────▼───────────────────────────┐   │
│  │              数据存储层 (Storage)                │   │
│  │  ┌────────────┐ ┌───────────┐ ┌─────────────┐  │   │
│  │  │ PostgreSQL │ │localStorage│ │ Cloudinary  │  │   │
│  │  │ (S8接入)   │ │(检查清单)  │ │ (S13接入)   │  │   │
│  │  └────────────┘ └───────────┘ └─────────────┘  │   │
│  └────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

---

## 4. 前端架构

### 4.1 目录结构 (V1.1)

```
src/
├── app/                          # Next.js App Router 页面
│   ├── layout.tsx                # 根布局（Header / Footer）
│   ├── page.tsx                  # 首页 - 房型选择
│   ├── rooms/
│   │   ├── [slug]/               # 动态路由 - 房型总览
│   │   │   ├── page.tsx          # 全景图 + 热点地图 + AreaDetailModal
│   │   │   └── [areaId]/         # 动态路由 - 区域详情独立页
│   │   │       └── page.tsx      # 图片画廊 + 完整内容
│   │   └── compare/              # A/B 对比页
│   │       └── page.tsx
│   ├── checklist/                # 检查清单
│   │   └── page.tsx
│   ├── search/                   # 搜索结果
│   │   └── page.tsx
│   ├── admin/                    # 管理后台
│   │   ├── layout.tsx            # Admin 布局（Sidebar + TopBar）
│   │   ├── page.tsx              # 仪表盘
│   │   ├── rooms/
│   │   │   ├── page.tsx          # 房型列表
│   │   │   ├── new/page.tsx      # 新增房型
│   │   │   └── [id]/edit/page.tsx
│   │   ├── areas/
│   │   │   └── [roomId]/page.tsx # 热点编辑
│   │   ├── content/
│   │   │   └── [areaId]/page.tsx # 内容编辑
│   │   └── images/
│   │       └── [areaId]/page.tsx # 图片管理
│   └── auth/
│       └── signin/page.tsx       # 简单登录页
├── components/
│   ├── ui/                       # shadcn/ui 基础组件
│   │   ├── button.tsx
│   │   ├── dialog.tsx            # Modal 基础（用于 AreaDetailModal）
│   │   ├── input.tsx
│   │   └── ...
│   ├── layout/                   # 布局组件
│   │   ├── mobile-header.tsx
│   │   ├── admin-sidebar.tsx
│   │   └── footer.tsx
│   ├── room/                     # 房型业务组件
│   │   ├── room-type-card.tsx
│   │   ├── room-panorama.tsx
│   │   ├── hotspot-marker.tsx
│   │   ├── hotspot-overlay.tsx
│   │   ├── area-detail-modal.tsx        # ★ 唯一详情展示组件
│   │   └── area-quick-links.tsx
│   ├── image/                    # 图片展示组件
│   │   ├── image-gallery.tsx
│   │   ├── image-viewer.tsx
│   │   ├── thumbnail-nav.tsx
│   │   └── image-compare.tsx
│   ├── search/                   # 搜索组件
│   │   ├── search-bar.tsx
│   │   └── search-result-card.tsx
│   ├── checklist/                # 检查清单组件
│   │   ├── checklist-list.tsx
│   │   ├── checklist-item.tsx
│   │   ├── checklist-progress.tsx
│   │   └── checklist-storage.ts     # ★ Adapter 接口 + LocalStorage 实现
│   ├── compare/                  # 对比组件
│   │   └── room-compare-view.tsx
│   └── admin/                    # 管理后台组件
│       ├── room-form.tsx
│       ├── hotspot-editor.tsx
│       ├── content-editor.tsx
│       ├── image-uploader.tsx
│       └── image-sortable-list.tsx
├── hooks/                        # 自定义 Hooks
│   ├── use-media-query.ts
│   ├── use-hotspots.ts
│   ├── use-image-viewer.ts
│   ├── use-checklist-progress.ts
│   ├── use-search.ts
│   └── use-auth.ts              # 简单登录状态 Hook
├── lib/                          # 工具函数 & 基础设施
│   ├── prisma.ts                 # Prisma 客户端单例 (Sprint 8)
│   ├── cloudinary.ts             # Cloudinary SDK 封装 (Sprint 13)
│   ├── auth.ts                   # 环境变量认证 helper
│   ├── utils.ts                  # cn() 等通用工具
│   └── constants.ts              # 常量定义
├── adapters/                     # ★ 抽象适配器层
│   ├── checklist-storage.ts      # IChecklistStorage 接口
│   ├── checklist-local.ts        # LocalStorageAdapter (V1)
│   └── checklist-database.ts     # DatabaseAdapter (V2 预留)
├── services/                     # 业务服务层
│   ├── room-service.ts
│   ├── area-service.ts
│   ├── content-service.ts
│   ├── image-service.ts
│   ├── search-service.ts
│   └── placement-service.ts      # ★ 新增：标准要求服务
├── mock/                         # Mock Data (Sprint 0-7)
│   ├── rooms.ts
│   ├── areas.ts
│   ├── content.ts
│   ├── images.ts
│   ├── placement-standards.ts    # ★ 新增
│   ├── search-index.ts
│   └── checklist.ts
├── types/                        # TypeScript 类型定义
│   ├── room.ts
│   ├── area.ts
│   ├── content.ts
│   ├── placement.ts              # ★ 新增
│   └── common.ts
└── styles/
    └── globals.css
```

### 4.2 状态管理策略 (V1.1 简化版)

```
┌─────────────────────────────────────────────────┐
│              状态管理分层 (V1.1)                  │
├─────────────────────────────────────────────────┤
│                                                  │
│  URL State (searchParams / route)                │
│  ├── 当前房型 [slug]                              │
│  ├── 当前区域 [areaId]                            │
│  ├── 搜索关键词 ?q=                               │
│  └── 对比房型 ?left=&right=                       │
│                                                  │
│  Server State (SWR)                              │
│  ├── 房型列表 → useSWR('/api/rooms')              │
│  ├── 区域详情 → useSWR('/api/areas/' + id)        │
│  ├── 搜索结果 → useSWR('/api/search?q=' + q)      │
│  └── 检查清单 → localStorage (非 SWR)              │
│                                                  │
│  Client State (useState)                         │
│  ├── Modal open/close                             │
│  ├── 图片查看器 currentIndex                       │
│  ├── 热点 hover/active                            │
│  ├── 对比滑块 position                             │
│  └── 表单输入值                                   │
│                                                  │
│  Persistent Client State (localStorage)          │
│  └── 检查清单勾选状态 (ChecklistStorageAdapter)     │
│                                                  │
└─────────────────────────────────────────────────┘
```

**关键原则：**
- 服务端数据用 SWR（比 TanStack Query 更轻量，V1 够用）
- URL 是"单一真相来源"——可分享的页面状态全部进入 URL
- Client State 仅用于瞬时 UI 交互（Modal / 动画 / 表单）
- 检查清单进度用 localStorage + Adapter 模式，V2 可切换数据库

---

## 5. 后端架构

### 5.1 API 层级 (V1.1)

```
┌────────────────────────────────────────────┐
│          Next.js App Router                 │
├────────────────────────────────────────────┤
│                                             │
│  ┌──────────────┐  ┌────────────────────┐  │
│  │ Server        │  │  API Routes        │  │
│  │ Components    │  │  (src/app/api/)     │  │
│  │ (RSC)         │  │                    │  │
│  │              │  │  GET /api/rooms     │  │
│  │ Sprint 8:    │  │  GET /api/areas/:id │  │
│  │ 直接查询DB    │  │  GET /api/search    │  │
│  │ Sprint 0-7:  │  │  ...               │  │
│  │ 读取Mock     │  └────────────────────┘  │
│  └──────────────┘                          │
│                                             │
│  ┌──────────────┐  ┌────────────────────┐  │
│  │ Server        │  │  Admin Auth        │  │
│  │ Actions       │  │  (Middleware)      │  │
│  │              │  │                    │  │
│  │ 管理后台 CRUD │  │ 检查 ADMIN_USER     │  │
│  │ (Sprint 10)  │  │ 检查 ADMIN_PASS     │  │
│  └──────────────┘  └────────────────────┘  │
└────────────────────────────────────────────┘
```

### 5.2 数据流

```
用户操作
    │
    ▼
┌──────────────┐
│  Client       │  ── SWR fetch → API Route
│  Component    │  ── 表单提交 → Server Action
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Service      │  ── 业务逻辑验证、权限检查
│  Layer        │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Prisma /     │  ── 类型安全查询 / Mock 数据
│  Mock         │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  PostgreSQL / │  ── 数据持久化 / 内存
│  localStorage │
└──────────────┘
```

---

## 6. 数据架构

### 6.1 实体关系图（ERD V1.1）

```
┌──────────────┐       ┌──────────────────┐       ┌──────────────────┐
│   RoomType   │       │     RoomArea      │       │ PlacementStandard│
├──────────────┤       ├──────────────────┤       ├──────────────────┤
│ ◆ id (PK)    │──1:N──│ ◆ id (PK)        │──1:N──│ ◆ id (PK)        │
│   name        │       │ ◆ room_type_id(FK)│       │ ◆ area_id (FK)    │
│   slug        │       │   name            │       │   title           │
│   description │       │   description     │       │   description     │
│   cover_image │       │   hotspot_type    │ ★NEW  │   sort_order      │
│   panorama    │       │   coordinates     │ ★NEW  │   created_at      │
│   sort_order  │       │   sort_order      │       └──────────────────┘
│   is_active   │       │   icon_type       │
│   created_at  │       │   created_at      │
│   updated_at  │       │   updated_at      │
└──────────────┘       └───────┬───────────┘
                               │ 1:1
                               ▼
                       ┌──────────────────┐
                       │   AreaContent    │
                       ├──────────────────┤
                       │ ◆ id (PK)        │
                       │ ◆ area_id (FK)    │
                       │   title           │
                       │   description     │
                       │   notes           │   ← Markdown 文本
                       │   common_mistakes │   ← 独立条目见 PlacementStandard
                       │   updated_at      │
                       └──────────────────┘
                               
┌──────────────┐       ┌──────────────────┐
│ AreaImage    │       │  (无 User 表)     │
├──────────────┤       │  (无 AuditLog)   │
│ ◆ id (PK)    │       │  (无 Checklist)  │
│ ◆ area_id(FK)│──N:1──│                  │  ← V1 移除
│   image_url   │       └──────────────────┘
│   thumbnail   │
│   alt_text    │
│   image_type  │  ★NEW: STANDARD | WRONG | DETAIL
│   sort_order  │
│   created_at  │
└──────────────┘
```

### 6.2 Prisma Schema (V1.1)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ==========================================
// 核心业务模型
// ==========================================

model RoomType {
  id             String     @id @default(cuid())
  name           String
  slug           String     @unique
  description    String?
  coverImage     String?    @map("cover_image")
  panoramaImage  String?    @map("panorama_image")
  sortOrder      Int        @default(0) @map("sort_order")
  isActive       Boolean    @default(true) @map("is_active")
  createdAt      DateTime   @default(now()) @map("created_at")
  updatedAt      DateTime   @updatedAt @map("updated_at")

  areas          RoomArea[]
  placementStandards PlacementStandard[]

  @@map("room_types")
}

// ★ 热点类型枚举 — V1.1 新增
enum HotspotType {
  RECT      // 矩形区域（默认，兼容旧数据）
  CIRCLE    // 圆形区域
  POLYGON   // 多边形区域（不规则形状）
  POINT     // 点位（精确到具体物品）
}

model RoomArea {
  id          String      @id @default(cuid())
  roomTypeId  String      @map("room_type_id")
  name        String
  description String?
  hotspotType HotspotType @default(RECT) @map("hotspot_type")  // ★ NEW
  coordinates Json        @default("{}") @map("coordinates")    // ★ NEW — 存储形状坐标
  sortOrder   Int         @default(0) @map("sort_order")
  iconType    String      @default("default") @map("icon_type")
  createdAt   DateTime    @default(now()) @map("created_at")
  updatedAt   DateTime    @updatedAt @map("updated_at")

  roomType    RoomType           @relation(fields: [roomTypeId], references: [id], onDelete: Cascade)
  content     AreaContent?
  images      AreaImage[]
  placementStandards PlacementStandard[]

  @@map("room_areas")
}

model AreaContent {
  id             String   @id @default(cuid())
  areaId         String   @unique @map("area_id")
  title          String
  description    String?
  notes          String?  // 注意事项（Markdown）
  commonMistakes String?  @map("common_mistakes") // ★ 保留文本格式，结构化条目用 PlacementStandard
  updatedAt      DateTime @updatedAt @map("updated_at")

  area           RoomArea @relation(fields: [areaId], references: [id], onDelete: Cascade)

  @@map("area_contents")
}

// ★★★ V1.1 新增：独立标准要求模型 ★★★
model PlacementStandard {
  id          String   @id @default(cuid())
  areaId      String   @map("area_id")
  roomTypeId  String   @map("room_type_id")  // 冗余，方便按房型查询
  title       String                         // 如 "枕头数量"
  description String?                        // 如 "4个枕头，两两并排"
  sortOrder   Int      @default(0) @map("sort_order")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  area        RoomArea @relation(fields: [areaId], references: [id], onDelete: Cascade)
  roomType    RoomType @relation(fields: [roomTypeId], references: [id], onDelete: Cascade)

  @@map("placement_standards")
}

// ★ 图片类型枚举 — V1.1 新增
enum ImageType {
  STANDARD  // 正确示范图
  WRONG     // 错误示范图
  DETAIL    // 细节展示图
}

model AreaImage {
  id           String    @id @default(cuid())
  areaId       String    @map("area_id")
  imageUrl     String    @map("image_url")
  thumbnailUrl String?   @map("thumbnail_url")
  altText      String?   @map("alt_text")
  imageType    ImageType @default(STANDARD) @map("image_type")  // ★ NEW
  sortOrder    Int       @default(0) @map("sort_order")
  createdAt    DateTime  @default(now()) @map("created_at")

  area         RoomArea  @relation(fields: [areaId], references: [id], onDelete: Cascade)

  @@map("area_images")
}

// ==========================================
// V1 移除的模型（对比 V1.0）
// ==========================================
// ✗ User         → V2 引入 Auth.js 时创建
// ✗ UserRole     → V2 引入 RBAC 时创建
// ✗ AuditLog     → V2 需要操作审计时创建
// ✗ ChecklistItem → V1 用 localStorage，V2 再建表
```

### 6.3 数据关系总结 (V1.1)

| 关系 | 类型 | 说明 |
|------|------|------|
| RoomType → RoomArea | 1:N | 一个房型有多个区域 |
| RoomType → PlacementStandard | 1:N | 冗余关系，方便按房型查标准 |
| RoomArea → AreaContent | 1:1 | 一个区域有一份内容 |
| RoomArea → AreaImage | 1:N | 一个区域有多张图片 |
| RoomArea → PlacementStandard | 1:N | ★ 一个区域有多条标准要求 |

### 6.4 HotspotType + Coordinates 规范

```typescript
// HotspotType 决定 coordinates 的 JSON 结构

// RECT (默认，兼容旧数据)
{
  "x": 25.0,      // 左边界百分比 (0-100)
  "y": 15.0,      // 上边界百分比 (0-100)
  "width": 18.0,  // 宽度百分比 (0-100)
  "height": 12.0  // 高度百分比 (0-100)
}

// CIRCLE
{
  "cx": 50.0,     // 圆心 X 百分比
  "cy": 30.0,     // 圆心 Y 百分比
  "r": 5.0        // 半径百分比
}

// POLYGON
{
  "points": [     // 多边形顶点数组
    { "x": 20.0, "y": 10.0 },
    { "x": 30.0, "y": 10.0 },
    { "x": 28.0, "y": 20.0 },
    { "x": 22.0, "y": 22.0 }
  ]
}

// POINT
{
  "x": 45.0,      // 点位 X 百分比
  "y": 65.0       // 点位 Y 百分比
}
```

### 6.5 ChecklistStorageAdapter 模式

```typescript
// adapters/checklist-storage.ts — 接口定义

interface CheckedItems {
  [roomTypeSlug: string]: Set<string>;  // areaId → checked
}

interface IChecklistStorage {
  getChecked(roomTypeSlug: string): Promise<Set<string>>;
  setChecked(roomTypeSlug: string, areaId: string, checked: boolean): Promise<void>;
  reset(roomTypeSlug: string): Promise<void>;
  getAll(): Promise<CheckedItems>;
}

// V1 实现 — adapters/checklist-local.ts
class LocalChecklistStorage implements IChecklistStorage {
  private key = 'holiday_resort_checklist';
  // 读写 localStorage，try/catch 降级到内存
}

// V2 预留 — adapters/checklist-database.ts
class DatabaseChecklistStorage implements IChecklistStorage {
  // 读写数据库 ChecklistItem 表
  // V1 业务代码无需修改，只需替换 Adapter 实例
}

// 工厂函数
export function createChecklistStorage(): IChecklistStorage {
  // V1: return new LocalChecklistStorage()
  // V2: return new DatabaseChecklistStorage()
}
```

---

## 7. API 设计

### 7.1 API 端点总览 (V1.1 精简版)

```
Public API (只读，无需认证)

GET    /api/rooms                    → 所有活跃房型
GET    /api/rooms/[slug]             → 房型详情 + 区域列表 + 标准要求
GET    /api/areas/[id]               → 区域详情 + 内容 + 图片 + 标准
GET    /api/search?q=keyword         → 全局搜索

Admin API (需要 admin 认证)

POST   /api/admin/rooms              → 新增房型
PATCH  /api/admin/rooms/[id]         → 编辑房型
DELETE /api/admin/rooms/[id]         → 删除房型
POST   /api/admin/rooms/[id]/areas   → 新增区域
PATCH  /api/admin/areas/[id]         → 编辑区域（含热点坐标）
DELETE /api/admin/areas/[id]         → 删除区域
PATCH  /api/admin/content/[id]       → 编辑内容
POST   /api/admin/standards          → ★ 新增标准要求
PATCH  /api/admin/standards/[id]     → ★ 编辑标准要求
DELETE /api/admin/standards/[id]     → ★ 删除标准要求
POST   /api/admin/images/upload      → 上传图片
POST   /api/admin/images             → 关联图片到区域
DELETE /api/admin/images/[id]        → 删除图片
PATCH  /api/admin/images/reorder     → 重排图片顺序

Auth API (简单环境变量认证)

POST   /api/auth/admin               → 验证 ADMIN_USERNAME / ADMIN_PASSWORD
GET    /api/auth/session             → 检查当前 admin session

V1 移除的 API:
  ✗ POST   /api/auth/signin          → 用 /api/auth/admin 替代
  ✗ POST   /api/auth/signout         → 客户端清除 cookie
  ✗ GET    /api/checklist/[slug]     → localStorage 替代
```

### 7.2 响应格式（统一信封 — 保持不变）

```typescript
// 成功响应
{ success: true, data: T }

// 错误响应
{ success: false, error: { code: string, message: string } }
```

---

## 8. 路由设计

### 8.1 完整路由表 (V1.1)

| 路由 | 页面名称 | 认证 | 渲染策略 |
|------|----------|:----:|----------|
| `/` | 首页 | 否 | SSG |
| `/rooms/[slug]` | 房型总览 + Modal | 否 | SSG |
| `/rooms/[slug]/[areaId]` | 区域详情页 | 否 | SSG |
| `/rooms/compare?left=a&right=b` | A/B 对比 | 否 | ISR |
| `/checklist` | 检查清单 | 否 | CSR |
| `/search?q=keyword` | 搜索结果 | 否 | SSR |
| `/auth/signin` | 管理登录 | 否 | SSR |
| `/admin` | 仪表盘 | 是* | SSR |
| `/admin/rooms` | 房型管理 | 是* | SSR |
| `/admin/rooms/new` | 新增房型 | 是* | SSR |
| `/admin/rooms/[id]/edit` | 编辑房型 | 是* | SSR |
| `/admin/areas/[roomId]` | 热点管理 | 是* | SSR |
| `/admin/content/[areaId]` | 内容编辑 | 是* | SSR |
| `/admin/images/[areaId]` | 图片管理 | 是* | SSR |

> \* Admin 认证: Middleware 检查 cookie token，无效则重定向 `/auth/signin`

---

## 9. 组件树设计 (V1.1 — 统一 Modal)

### 9.1 公共页面组件树

```
RootLayout
├── Providers (SWRConfig)
│   ├── MobileHeader
│   │   ├── Logo
│   │   └── SearchBar (collapsible)
│   ├── Main (flex-1)
│   │   ├── [HomePage]
│   │   │   ├── HeroSection (Logo + Title)
│   │   │   ├── RoomTypeSelector
│   │   │   │   └── RoomTypeCard[] (cover image background)
│   │   │   ├── QuickLinkCard (Checklist)
│   │   │   └── QuickLinkCard (Compare)
│   │   │
│   │   ├── [RoomOverviewPage]
│   │   │   ├── Breadcrumb
│   │   │   ├── RoomPanorama (relative container)
│   │   │   │   ├── PanoramaImage
│   │   │   │   └── HotspotOverlay
│   │   │   │       └── HotspotMarker[] (absolute % position)
│   │   │   │           ├── PulseRing
│   │   │   │           └── Icon + Label
│   │   │   ├── AreaQuickLinks (horizontal scroll chips)
│   │   │   └── ★ AreaDetailModal (shadcn/ui Dialog)
│   │   │       ├── ModalHeader (area name + ✕ close)
│   │   │       ├── ImagePreviewRow (thumbnails)
│   │   │       ├── RequirementsSection
│   │   │       │   └── StandardItem[] (✓ green)
│   │   │       ├── MistakesSection
│   │   │       │   └── MistakeItem[] (✗ red)
│   │   │       └── FullDetailLink ("View Full Details" → 详情页)
│   │   │
│   │   ├── [AreaDetailPage]
│   │   │   ├── Breadcrumb
│   │   │   ├── ImageGallery (full-width, swipeable)
│   │   │   │   ├── MainImage
│   │   │   │   ├── NavArrows
│   │   │   │   └── ThumbnailNav
│   │   │   ├── ContentSection
│   │   │   │   ├── Description
│   │   │   │   ├── Requirements (PlacementStandard[])
│   │   │   │   ├── Notes
│   │   │   │   └── CommonMistakes
│   │   │   └── RelatedAreasLinks
│   │   │
│   │   ├── [ComparePage]
│   │   │   ├── RoomSelector (left / right dropdown)
│   │   │   └── RoomCompareView
│   │   │       ├── CompareImageSlider (desktop only)
│   │   │       └── CompareTable
│   │   │
│   │   ├── [SearchPage]
│   │   │   ├── SearchBar (sticky)
│   │   │   ├── ResultsCount
│   │   │   └── SearchResultCard[]
│   │   │
│   │   └── [ChecklistPage]
│   │       ├── RoomTypeTabs
│   │       ├── ChecklistProgress (SVG ring)
│   │       └── ChecklistList
│   │           └── ChecklistItem[] (□ ↔ ☑)
│   │
│   └── Footer
│
└── ImageViewerModal (Portal, full-screen overlay)
    ├── ImageViewer (pinch-zoom, swipe)
    ├── CloseButton
    ├── ImageCounter ("3 / 8")
    └── ThumbnailStrip
```

### 9.2 管理后台组件树

```
AdminLayout
├── AdminSidebar (desktop: fixed left 240px)
│   ├── Logo
│   ├── NavItem: Dashboard
│   ├── NavItem: Room Types
│   ├── NavItem: Content
│   ├── NavItem: Images
│   └── SignOutButton
├── AdminMobileNav (mobile: bottom tab bar)
│   ├── Tab: Dashboard
│   ├── Tab: Rooms
│   ├── Tab: Content
│   └── Tab: More
└── AdminMain
    ├── [AdminDashboard]
    │   ├── StatCards (Room/Area/Image counts)
    │   └── QuickActions
    │
    ├── [RoomManagePage]
    │   ├── RoomTable
    │   │   └── RoomRow[] (thumbnail, name, area count, actions)
    │   └── DeleteConfirmDialog
    │
    ├── [RoomFormPage]
    │   └── RoomForm (name, slug, description, image URLs)
    │
    ├── [HotspotManagePage]
    │   ├── PanoramaViewer
    │   │   └── DraggableHotspotMarker[] (drag, resize, delete)
    │   ├── AddHotspotButton
    │   └── HotspotPropertiesPanel (type selector + coordinates)
    │
    ├── [ContentEditPage]
    │   ├── StandardList (可排序)
    │   │   └── StandardItem[] (title + description + 拖拽排序)
    │   ├── AddStandardButton
    │   └── ContentEditorForm (description, notes, mistakes)
    │
    └── [ImageManagePage]
        ├── ImageUploadZone (drag & drop → Cloudinary)
        └── SortableImageGrid
            └── SortableImageItem[] (thumbnail, type badge, alt text, delete)
```

### 9.3 ★ 关键变更：V1.0 → V1.1 组件名映射

| V1.0 (已删除) | V1.1 (替换为) | 原因 |
|---------------|---------------|------|
| AreaDetailPanel | AreaDetailModal | 架构决策 #1 — 统一 Modal |
| AreaDetailSheet | AreaDetailModal | 同上 |
| BottomSheet (drag handle) | 不使用 | 同上 |
| AreaDetailPanel (右侧面板) | 不使用 | 同上 |
| AuthProvider | useAuth hook | 简化认证 |
| ChecklistService | ChecklistStorageAdapter | localStorage 方案 |
| UserMenu (avatar) | SignOutButton | 无用户系统 |

---

## 10. 安全架构

### 10.1 认证流程 (V1.1 简化版)

```
┌─────────────────────────────────────────┐
│             Admin 认证 (V1.1)            │
├─────────────────────────────────────────┤
│                                          │
│  ┌──────────┐                            │
│  │  Login    │  POST /api/auth/admin     │
│  │  Form     │──{user,pass}─────────────▶│ 验证环境变量
│  └──────────┘                            │
│       │                                   │  ADMIN_USERNAME
│       ▼                                   │  ADMIN_PASSWORD
│  ┌──────────┐                            │
│  │  Cookie  │◀─── Set httpOnly cookie ──│ (比较)
│  │  (token) │                            │
│  └────┬─────┘                            │
│       │                                   │
│       ▼                                   │
│  ┌──────────┐                            │
│  │  Admin    │──middleware.ts────────────▶│ 检查 cookie
│  │  Pages   │   redirect if invalid      │
│  └──────────┘                            │
│                                          │
└─────────────────────────────────────────┘
```

### 10.2 安全措施

| 措施 | 实现 |
|------|------|
| **CSRF** | Next.js Server Actions 内置保护 |
| **XSS** | React 默认转义 + DOMPurify 处理 Markdown |
| **SQL 注入** | Prisma 参数化查询 |
| **文件上传验证** | 服务端验证：类型(JPEG/PNG/WebP) + 大小限制(10MB) |
| **Admin 认证** | 环境变量 + httpOnly Cookie + Middleware 检查 |
| **HTTPS** | Vercel 自动强制 HTTPS |
| **Secrets** | 所有密钥通过环境变量注入，无硬编码 |

### 10.3 V1.0 → V1.1 安全简化

| V1.0 | V1.1 | 原因 |
|------|------|------|
| Auth.js + JWT | 简单 cookie + env var 比对 | 单一管理员，无需完整认证框架 |
| 三级角色矩阵 | 无（仅 admin / public） | V1 无多用户需求 |
| 权限中间件（多角色） | binary admin check | 仅需判断 "是/否管理员" |
| AuditLog 审计 | 无 | V2 再引入 |

---

## 11. 部署架构

### 11.1 部署拓扑 (V1.1 — 不变)

```
                          Internet
                             │
                             ▼
                  ┌─────────────────────┐
                  │  Vercel Edge Network │
                  │  ├── CDN (SSG pages) │
                  │  └── Serverless (SSR)│
                  └──────────┬──────────┘
                             │
                  ┌──────────┴──────────┐
                  │                     │
                  ▼                     ▼
          ┌──────────────┐   ┌──────────────┐
          │  PostgreSQL   │   │  Cloudinary   │
          └──────────────┘   └──────────────┘
```

### 11.2 环境变量 (V1.1)

```bash
# Database (Sprint 8+)
DATABASE_URL=postgresql://...

# Admin Auth
ADMIN_USERNAME=admin
ADMIN_PASSWORD=xxx_change_me
AUTH_SECRET=xxx_random_32_chars       # Cookie 签名密钥

# Cloudinary (Sprint 13+)
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx

# App
NEXT_PUBLIC_APP_NAME=Holiday Resort Training
```

---

## 12. 扩展性设计

### 12.1 新增房型（零代码）

管理员在后台添加新记录即可，无需任何代码修改。

### 12.2 新增区域类型

不限制区域名称，可自由创建。

### 12.3 新增热点形状

HotspotType 枚举 + coordinates JSON 组合保证灵活性：

| 场景 | HotspotType | coordinates 结构 |
|------|-------------|-----------------|
| 床区域（矩形） | RECT | `{x, y, width, height}` |
| 圆形茶几 | CIRCLE | `{cx, cy, r}` |
| L 形沙发区 | POLYGON | `{points: [...]}` |
| 咖啡机按钮 | POINT | `{x, y}` |

### 12.4 V2.0 预留扩展点

| 扩展功能 | 预留设计 |
|----------|----------|
| **AI 照片检查** | `AreaImage` 表可加 `ai_analysis_result (JSON)` |
| **员工考试** | V2 新增 `User` + `ExamResult` 表 |
| **培训进度** | `ChecklistStorageAdapter` → DatabaseAdapter |
| **多语言** | 核心字段可扩展为 i18n JSON 列 |
| **二维码访问** | 每个房型 slug 生成静态 URL |
| **Supervisor 审核** | V2 新增 `Review` 表 |
| **多用户权限** | V2 引入 Auth.js + Role 枚举 + RBAC |

---

## 13. 未来认证升级路径

> V1.1 使用环境变量简单认证。以下为 V2 升级至 Auth.js + RBAC 的完整路径。

### 13.1 升级触发条件

- [ ] 需要多名管理员各自操作
- [ ] 需要 Supervisor 角色（比 Admin 权限低）
- [ ] 需要 Housekeeper 个人账户（考试、培训记录）
- [ ] 需要操作审计追踪

### 13.2 升级步骤

```
Step 1: 安装 Auth.js
  pnpm add next-auth@beta @auth/prisma-adapter

Step 2: 新增 User + Account + Session 表
  执行 Prisma 迁移（参考下方 Schema 片段）

Step 3: 创建 src/lib/auth.ts
  配置 Credentials Provider + JWT strategy

Step 4: 创建 src/middleware.ts 升级版
  替换当前简单 cookie 检查为 Auth.js middleware

Step 5: 迁移 Admin 页面
  wrap AdminLayout 为 SessionProvider
  替换 useAuth() 为 useSession()

Step 6: 数据迁移
  将 ADMIN_USERNAME 创建为初始 Admin 用户
```

### 13.3 V2 目标 Schema（参考，不在 V1 实现）

```prisma
// V2 新增（V1 不实现）
enum UserRole {
  HOUSEKEEPER
  SUPERVISOR
  ADMINISTRATOR
}

model User {
  id             String    @id @default(cuid())
  name           String
  email          String    @unique
  hashedPassword String
  role           UserRole  @default(HOUSEKEEPER)
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
}

model AuditLog {
  id         String   @id @default(cuid())
  userId     String
  action     String
  entityType String
  entityId   String
  changes    Json
  createdAt  DateTime @default(now())
}
```

---

## 14. V1 必需 vs V2 增强

### 14.1 功能分层

#### V1 必需 (Sprint 0-15 实现)

| 类别 | 项目 | 说明 |
|------|------|------|
| 框架 | Next.js App Router | 全栈基础 |
| 样式 | Tailwind CSS + shadcn/ui | UI 组件 |
| 数据 (前期) | Mock Data (S0-7) | 静态 JSON |
| 数据 (后期) | Prisma + PostgreSQL (S8+) | 持久化 |
| 前台 | 首页 / 房型总览 / 热点 / Modal / 详情 / 搜索 / 对比 / 清单 | 全部员工端功能 |
| 后台 | 房型 CRUD / 热点编辑 / 内容编辑 / 图片管理 | 管理功能 |
| 上传 | Cloudinary (S13) | 生产图片 |
| 认证 | 环境变量单管理员 | 最小可行 |
| 部署 | Vercel | 生产上线 |
| 数据获取 | SWR | 轻量 fetch 封装 |
| 清单存储 | localStorage + Adapter | 本地持久化 |

#### V2 增强 (未来实现，不在 V1 范围)

| 类别 | 项目 | V1 替代方案 | 升级时机 |
|------|------|------------|----------|
| 数据获取 | TanStack Query | SWR | 需要缓存策略/离线支持时 |
| 单元测试 | Vitest | 手动测试 + Chrome DevTools | Sprint 14 可选引入 |
| E2E 测试 | Playwright | 同上 | 核心流程需要自动化回归时 |
| 认证框架 | Auth.js + RBAC | 环境变量 | 多用户需求出现时 |
| 审计日志 | AuditLog 表 | 无 | Supervisor 角色上线时 |
| 高级搜索 | PostgreSQL FTS / Meilisearch | LIKE 查询 | 数据量 > 500 条时 |
| 多语言 | next-intl | 硬编码英文 | 国际化需求时 |
| 离线支持 | PWA / Service Worker | 无 | 弱网环境需求时 |
| 分析 | Vercel Analytics | 无 | 需要用户行为数据时 |

### 14.2 技术选型对比

| 技术点 | V1.0 (原设计) | V1.1 (调整后) | 调整理由 |
|--------|---------------|---------------|----------|
| 数据获取 | TanStack Query | SWR | SWR 更小更简单，V1 场景足够 |
| 状态管理 | TanStack Query + Zustand | SWR + URL state | 减少依赖，URL 即状态 |
| 认证 | Auth.js | 环境变量 | 单管理员不需要完整框架 |
| 清单存储 | PostgreSQL 表 | localStorage | V1 不需要跨设备同步 |
| 测试框架 | Vitest + Playwright | 手动测试 | V1 先保证功能正确 |
| 权限体系 | 三级角色 + 权限矩阵 | 二元 admin check | V1 无多用户 |

---

## 附录 A：关键技术决策记录 (V1.1 更新)

| # | 决策 | V1.0 | V1.1 | 理由 |
|---|------|------|------|------|
| 1 | 热点详情展示 | 多方案并存 | **仅 AreaDetailModal** | 架构决策 #1 |
| 2 | 检查清单存储 | 数据库表 | **localStorage + Adapter** | 架构决策 #5 |
| 3 | 认证方案 | Auth.js + RBAC | **环境变量** | V1 单管理员够用 |
| 4 | 数据获取 | TanStack Query | **SWR** | 更轻量，V1 够用 |
| 5 | 热点形状 | 仅矩形 | **RECT/CIRCLE/POLYGON/POINT** | PRD 未来需求 |
| 6 | 图片分类 | 无 | **STANDARD/WRONG/DETAIL** | 培训场景需要 |
| 7 | 标准要求 | Markdown 字符串 | **PlacementStandard 独立模型** | 可维护性 |
| 8 | 测试策略 | Vitest + Playwright | **手动测试 + 后期引入** | 加快 V1 交付 |

---

## 附录 B：V1.0 → V1.1 Prisma Schema Diff

```diff
- enum UserRole { HOUSEKEEPER SUPERVISOR ADMINISTRATOR }
+ // V1.1 移除 UserRole，V2 重新引入

- model User { ... }
+ // V1.1 移除 User，V2 引入 Auth.js 时创建

- model AuditLog { ... }
+ // V1.1 移除 AuditLog，V2 重新引入

- model ChecklistItem { ... }
+ // V1.1 移除 ChecklistItem，改用 localStorage + Adapter

+ enum HotspotType { RECT CIRCLE POLYGON POINT }
+ // RoomArea 新增字段:
+ //   hotspotType  HotspotType @default(RECT)
+ //   coordinates  Json        @default("{}")

+ enum ImageType { STANDARD WRONG DETAIL }
+ // AreaImage 新增字段:
+ //   imageType    ImageType @default(STANDARD)

+ model PlacementStandard { ... }
+ // 新增独立标准要求模型
```

---

## 附录 C：V1.1 的开发影响

| 方面 | 影响 |
|------|------|
| 开发速度 | **↑ 显著加快** — 移除 Auth.js、RBAC、ChecklistItem、AuditLog 减少约 30% 工作量 |
| 代码复杂度 | **↓ 降低** — 认证从 OAuth 框架降为简单 cookie 检查 |
| 可维护性 | **↑ 提升** — PlacementStandard 独立模型 > Markdown 字符串 |
| 扩展性 | **→ 不变** — Adapter 模式保留所有 V2 升级路径 |
| 测试负担 | **↓ 显著降低** — V1 手动测试即可，V2 再引入自动化 |
| Sprint 0-7 | **↑ 加速** — 无数据库依赖，纯 Mock 开发 |
| Sprint 8-9 | **↓ 减负** — Sprint 8 仅数据库接入，Sprint 9 仅简单登录 |
| Sprint 10-13 | **→ 不变** — 管理后台功能不变 |

---

> **SAD 版本**: V1.1 (Simplified) | **基于**: V1.0 → Architecture Decisions → PRD V1.0
>
> **下一步**: 生成 SAD-V1.1-CHANGELOG.md，然后进入 Sprint 0 — 项目骨架搭建
