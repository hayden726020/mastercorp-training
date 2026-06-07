# Holiday Resort Housekeeper Training System
# 系统架构设计文档（SAD）V1.0

---

## 文档信息

| 字段 | 内容 |
|------|------|
| 文档版本 | V1.0 |
| 创建日期 | 2026-06-02 |
| 对应PRD | Housekeeper Training System PRD V1.0 |
| 适用范围 | V1.0 全功能开发 |

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

---

## 1. 架构概述

### 1.1 架构风格

采用 **全栈Next.js单体应用** 架构，利用Next.js的App Router实现前后端一体化。

```
┌──────────────────────────────────────────────────────┐
│                   Vercel Platform                     │
│                                                       │
│  ┌─────────────────────────────────────────────┐     │
│  │               Next.js App                    │     │
│  │                                              │     │
│  │  ┌──────────┐  ┌──────────────────────┐     │     │
│  │  │  Client   │  │    Server (Edge)      │     │     │
│  │  │ Components│  │                       │     │     │
│  │  │  (RSC)    │  │  - API Routes         │     │     │
│  │  │           │  │  - Server Actions      │     │     │
│  │  │  ┌──────┐ │  │  - Database Queries    │     │     │
│  │  │  │Client│ │  │  - Image Processing   │     │     │
│  │  │  │ Hooks│ │  │                       │     │     │
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

### 1.2 设计原则

| 原则 | 说明 |
|------|------|
| **移动端优先** | 所有页面从320px宽度开始设计，逐级增强 |
| **模块化** | 按功能领域拆分模块，高内聚低耦合 |
| **类型安全** | 全栈TypeScript，Prisma自动生成类型 |
| **可扩展** | 数据模型支持无限新增房型，无需改代码 |
| **SSG优先** | 培训内容页面静态生成，秒级加载 |
| **实时编辑** | 管理后台使用Server Actions实现内容更新 |

---

## 2. 技术选型

### 2.1 核心技术栈

| 层级 | 技术 | 版本 | 选型理由 |
|------|------|------|----------|
| 框架 | Next.js | 14.x (App Router) | React Server Components + API Routes |
| 语言 | TypeScript | 5.x | 全栈类型安全 |
| 样式 | Tailwind CSS | 3.x | 移动端优先响应式 |
| 组件库 | shadcn/ui | latest | 无包依赖，Tree-shakable |
| ORM | Prisma | 5.x | 类型安全 + 迁移管理 |
| 数据库 | PostgreSQL | 15+ | 生产级关系型数据库 |
| 图片存储 | Cloudinary | - | 图片优化 + CDN分发 |
| 认证 | NextAuth.js | 5.x (Auth.js) | 多角色认证 |
| 部署 | Vercel | - | Next.js原生平台 |

### 2.2 开发依赖

| 工具 | 用途 |
|------|------|
| ESLint | 代码规范 |
| Prettier | 代码格式化 |
| Vitest | 单元测试 |
| Playwright | E2E测试 |
| Prisma Studio | 数据库可视化管理 |

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
                               │ Auth
  ┌──────────┐           ┌──────▼───────┐
  │  Desktop │           │  Auth.js      │
  │  Browser │           │  (JWT/Session)│
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
│  │  │Service │ │  Service │ │  Service    │     │    │
│  │  └───┬────┘ └────┬─────┘ └─────┬───────┘     │    │
│  └──────┼───────────┼─────────────┼──────────────┘    │
├─────────┼───────────┼─────────────┼───────────────────┤
│         │           │             │                    │
│  ┌──────▼───────────▼─────────────▼───────────────┐   │
│  │             数据访问层 (Data Access)             │   │
│  │              Prisma ORM + Repository            │   │
│  └────────────────────┬───────────────────────────┘   │
├───────────────────────┼───────────────────────────────┤
│                       │                                │
│  ┌────────────────────▼───────────────────────────┐   │
│  │              数据存储层 (Storage)                │   │
│  │  ┌────────────┐  ┌───────────────────┐         │   │
│  │  │ PostgreSQL │  │ Cloudinary / S3   │         │   │
│  │  └────────────┘  └───────────────────┘         │   │
│  └────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

---

## 4. 前端架构

### 4.1 目录结构

```
src/
├── app/                          # Next.js App Router 页面
│   ├── layout.tsx                # 根布局（Header/Footer/TanStack Query Provider）
│   ├── page.tsx                  # 首页 - 房型选择
│   ├── (public)/                 # 公共页面分组
│   │   ├── rooms/
│   │   │   ├── [roomType]/       # 动态路由 - 房型总览
│   │   │   │   ├── page.tsx      # 房间全景 + 热点地图
│   │   │   │   ├── layout.tsx    # 房型Header + 区域子导航
│   │   │   │   └── [areaId]/     # 动态路由 - 区域详情
│   │   │   │       └── page.tsx
│   │   │   └── compare/          # A/B对比页
│   │   │       └── page.tsx
│   │   ├── checklist/            # 检查清单
│   │   │   └── page.tsx
│   │   └── search/               # 搜索结果页
│   │       └── page.tsx
│   ├── (admin)/                  # 管理后台分组（独立布局）
│   │   ├── layout.tsx            # 管理后台布局（侧边栏+顶栏）
│   │   ├── admin/
│   │   │   ├── page.tsx          # 管理仪表盘
│   │   │   ├── rooms/            # 房型管理
│   │   │   │   ├── page.tsx
│   │   │   │   ├── [roomType]/edit/page.tsx
│   │   │   │   └── new/page.tsx
│   │   │   ├── areas/            # 热点管理
│   │   │   │   └── [roomType]/page.tsx
│   │   │   ├── content/          # 内容编辑
│   │   │   │   └── [areaId]/page.tsx
│   │   │   └── images/           # 图片管理
│   │   │       └── [areaId]/page.tsx
│   │   └── api/                  # Admin专用API
│   └── api/                      # 公共API Routes
│       ├── rooms/
│       ├── areas/
│       ├── search/
│       └── checklist/
├── components/
│   ├── ui/                       # shadcn/ui 基础组件
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   └── ...
│   ├── layout/                   # 布局组件
│   │   ├── mobile-header.tsx
│   │   ├── mobile-nav.tsx
│   │   ├── admin-sidebar.tsx
│   │   └── footer.tsx
│   ├── room/                     # 房型相关业务组件
│   │   ├── room-type-card.tsx        # 房型选择卡片
│   │   ├── room-panorama.tsx          # 全景图组件
│   │   ├── hotspot-marker.tsx         # 可点击热点标记
│   │   ├── hotspot-overlay.tsx        # 热点覆盖层管理器
│   │   ├── area-detail-panel.tsx      # 区域详情面板（底部抽屉）
│   │   └── area-detail-sheet.tsx      # 区域详情（全屏Sheet）
│   ├── image/                    # 图片展示组件
│   │   ├── image-gallery.tsx         # 图片画廊
│   │   ├── image-viewer.tsx          # 全屏图片查看器
│   │   ├── thumbnail-nav.tsx         # 缩略图导航
│   │   └── image-compare.tsx         # A/B对比组件
│   ├── search/                   # 搜索组件
│   │   ├── search-bar.tsx
│   │   └── search-result-card.tsx
│   ├── checklist/                # 检查清单组件
│   │   ├── checklist-list.tsx
│   │   ├── checklist-item.tsx
│   │   └── checklist-progress.tsx
│   ├── compare/                  # 对比组件
│   │   └── room-compare-view.tsx
│   └── admin/                    # 管理后台组件
│       ├── room-form.tsx
│       ├── hotspot-editor.tsx
│       ├── content-editor.tsx
│       ├── image-uploader.tsx
│       └── image-sortable-list.tsx
├── hooks/                        # 自定义Hooks
│   ├── use-media-query.ts
│   ├── use-hotspots.ts           # 热点交互逻辑
│   ├── use-image-viewer.ts      # 图片查看器状态
│   ├── use-checklist-progress.ts
│   └── use-search.ts
├── lib/                          # 工具函数 & 服务层
│   ├── prisma.ts                 # Prisma 客户端单例
│   ├── cloudinary.ts             # Cloudinary SDK 封装
│   ├── auth.ts                   # NextAuth 配置
│   ├── auth.config.ts            # Auth 路由配置
│   ├── utils.ts                  # 通用工具函数
│   └── constants.ts              # 常量定义
├── services/                     # 业务服务层（Server Actions + Data Access）
│   ├── room-service.ts
│   ├── area-service.ts
│   ├── content-service.ts
│   ├── image-service.ts
│   ├── search-service.ts
│   └── checklist-service.ts
├── types/                        # TypeScript 类型定义
│   ├── room.ts
│   ├── area.ts
│   ├── content.ts
│   └── common.ts
└── styles/
    └── globals.css               # 全局样式 + Tailwind
```

### 4.2 状态管理策略

```
┌─────────────────────────────────────────────────┐
│              状态管理分层                          │
├─────────────────────────────────────────────────┤
│                                                  │
│  URL State (searchParams / route)                │
│  ├── 当前房型 [roomType]                          │
│  ├── 当前区域 [areaId]                            │
│  ├── 搜索关键词 ?q=                               │
│  └── 管理页面状态                                 │
│                                                  │
│  Server State (TanStack Query / RSC)             │
│  ├── 房型列表 → useQuery(['rooms'])               │
│  ├── 区域详情 → useQuery(['area', areaId])         │
│  ├── 搜索结果 → useQuery(['search', query])        │
│  └── 检查清单 → useQuery(['checklist'])            │
│                                                  │
│  Client State (useState / useReducer)            │
│  ├── 热点hover/active状态                         │
│  ├── 图片查看器 open/close/currentIndex            │
│  ├── 图片对比滑块位置                               │
│  └── 表单输入值                                   │
│                                                  │
│  Form State (React Hook Form)                    │
│  ├── 管理后台表单                                  │
│  └── 图片上传表单                                  │
│                                                  │
└─────────────────────────────────────────────────┘
```

**关键原则：**
- 服务端数据一律走 TanStack Query，不复制到客户端Store
- URL是"单一真相来源"——可分享的页面状态全部进入URL
- Client State仅用于瞬时UI交互（动画、hover等）

---

## 5. 后端架构

### 5.1 API 层级

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
│  │ 直接查询DB    │  │  GET /api/rooms/:id │  │
│  │ 渲染服务端    │  │  POST /api/rooms    │  │
│  │ HTML         │  │  PATCH /api/rooms/  │  │
│  └──────────────┘  │  DELETE /api/rooms/ │  │
│                    │                     │  │
│  ┌──────────────┐  │  GET /api/search    │  │
│  │ Server        │  │  POST /api/upload   │  │
│  │ Actions       │  │  ...               │  │
│  │              │  └────────────────────┘  │
│  │ 管理后台的    │                          │
│  │ 表单提交      │                          │
│  │ 数据变更      │                          │
│  └──────────────┘                          │
└────────────────────────────────────────────┘
```

### 5.2 数据流

```
用户操作
    │
    ▼
┌──────────────┐
│  Client       │  ── 用户交互 → Server Action 或 fetch API
│  Component    │
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
│  Prisma       │  ── 类型安全查询
│  ORM          │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  PostgreSQL   │  ── 数据持久化
└──────────────┘
```

**Server Actions 用于：**
- 管理后台数据修改（新增/编辑/删除）
- 图片上传触发

**API Routes 用于：**
- 公开数据读取（可缓存）
- 搜索接口
- 检查清单状态同步

**React Server Components 用于：**
- 直接查询数据库渲染培训内容页面（零客户端JS）

---

## 6. 数据架构

### 6.1 实体关系图（ERD）

```
┌──────────────┐       ┌──────────────────┐
│   RoomType   │       │     RoomArea      │
├──────────────┤       ├──────────────────┤
│ ◆ id (PK)    │──1:N──│ ◆ id (PK)        │
│   name        │       │ ◆ room_type_id(FK)│
│   slug        │       │   name            │
│   description │       │   description     │
│   cover_image │       │   position_x      │
│   panorama    │       │   position_y      │
│   sort_order  │       │   width           │
│   is_active   │       │   height          │
│   created_at  │       │   sort_order      │
│   updated_at  │       │   icon_type       │
└──────────────┘       │   created_at      │
                       │   updated_at      │
                       └───────┬───────────┘
                               │ 1:1
                               ▼
                       ┌──────────────────┐
                       │   AreaContent    │
                       ├──────────────────┤
                       │ ◆ id (PK)        │
                       │ ◆ area_id (FK)    │
                       │   title           │
                       │   description     │
                       │   requirements    │
                       │   notes           │
                       │   common_mistakes │
                       │   updated_at      │
                       └──────────────────┘
                               
┌──────────────┐       ┌──────────────────┐
│ AreaImage    │       │    ChecklistItem  │
├──────────────┤       ├──────────────────┤
│ ◆ id (PK)    │       │ ◆ id (PK)        │
│ ◆ area_id(FK)│──N:1──│   room_type_id(FK)│
│   image_url   │       │   area_id (FK)    │
│   thumbnail   │       │   label           │
│   alt_text    │       │   sort_order      │
│   sort_order  │       │   is_checked      │
│   created_at  │       │   created_at      │
└──────────────┘       └──────────────────┘

┌──────────────────┐       ┌──────────────────┐
│      User        │       │    AuditLog      │
├──────────────────┤       ├──────────────────┤
│ ◆ id (PK)        │       │ ◆ id (PK)        │
│   name            │       │   user_id (FK)   │
│   email (UNIQUE)  │       │   action         │
│   role (ENUM)     │       │   entity_type    │
│   hashed_password │       │   entity_id      │
│   created_at      │       │   changes (JSON) │
└──────────────────┘       │   created_at      │
                           └──────────────────┘
```

### 6.2 Prisma Schema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum UserRole {
  HOUSEKEEPER
  SUPERVISOR
  ADMINISTRATOR
}

model User {
  id             String     @id @default(cuid())
  name           String
  email          String     @unique
  hashedPassword String
  role           UserRole   @default(HOUSEKEEPER)
  createdAt      DateTime   @default(now()) @map("created_at")
  updatedAt      DateTime   @updatedAt @map("updated_at")
}

model RoomType {
  id          String     @id @default(cuid())
  name        String
  slug        String     @unique
  description String?
  coverImage  String?    @map("cover_image")
  panoramaImage String?  @map("panorama_image")
  sortOrder   Int        @default(0) @map("sort_order")
  isActive    Boolean    @default(true) @map("is_active")
  createdAt   DateTime   @default(now()) @map("created_at")
  updatedAt   DateTime   @updatedAt @map("updated_at")

  areas       RoomArea[]
  checklistItems ChecklistItem[]

  @@map("room_types")
}

model RoomArea {
  id          String   @id @default(cuid())
  roomTypeId  String   @map("room_type_id")
  name        String
  description String?
  positionX   Float    @default(0) @map("position_x")
  positionY   Float    @default(0) @map("position_y")
  width       Float    @default(100)
  height      Float    @default(80)
  sortOrder   Int      @default(0) @map("sort_order")
  iconType    String   @default("default") @map("icon_type")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  roomType    RoomType      @relation(fields: [roomTypeId], references: [id], onDelete: Cascade)
  content     AreaContent?
  images      AreaImage[]

  @@map("room_areas")
}

model AreaContent {
  id            String   @id @default(cuid())
  areaId        String   @unique @map("area_id")
  title         String
  description   String?
  requirements  String?  // 摆放要求（Markdown）
  notes         String?  // 注意事项（Markdown）
  commonMistakes String? @map("common_mistakes") // 常见错误（Markdown）
  updatedAt     DateTime @updatedAt @map("updated_at")

  area          RoomArea @relation(fields: [areaId], references: [id], onDelete: Cascade)

  @@map("area_contents")
}

model AreaImage {
  id        String   @id @default(cuid())
  areaId    String   @map("area_id")
  imageUrl  String   @map("image_url")
  thumbnailUrl String? @map("thumbnail_url")
  altText   String?  @map("alt_text")
  sortOrder Int      @default(0) @map("sort_order")
  createdAt DateTime @default(now()) @map("created_at")

  area      RoomArea @relation(fields: [areaId], references: [id], onDelete: Cascade)

  @@map("area_images")
}

model ChecklistItem {
  id          String   @id @default(cuid())
  roomTypeId  String   @map("room_type_id")
  areaId      String?  @map("area_id")
  label       String
  sortOrder   Int      @default(0) @map("sort_order")
  createdAt   DateTime @default(now()) @map("created_at")

  roomType    RoomType @relation(fields: [roomTypeId], references: [id], onDelete: Cascade)

  @@map("checklist_items")
}
```

### 6.3 数据关系总结

| 关系 | 类型 | 说明 |
|------|------|------|
| RoomType → RoomArea | 1:N | 一个房型有多个区域 |
| RoomArea → AreaContent | 1:1 | 一个区域有一份内容 |
| RoomArea → AreaImage | 1:N | 一个区域有多张标准照片 |
| RoomType → ChecklistItem | 1:N | 房型的检查清单项 |
| User → AuditLog | 1:N | 用户操作审计 |

---

## 7. API 设计

### 7.1 API 端点总览

```
Public API (只读，无需认证)

GET    /api/rooms                    → 获取所有活跃房型列表
GET    /api/rooms/[slug]             → 获取指定房型详情（含区域列表）
GET    /api/rooms/[slug]/areas       → 获取房型下所有区域
GET    /api/areas/[id]               → 获取区域详情（含内容+图片）
GET    /api/search?q=keyword         → 全局搜索
GET    /api/checklist/[roomSlug]     → 获取检查清单

Admin API (需要 Supervisor+ 权限)

POST   /api/admin/rooms              → 新增房型
PATCH  /api/admin/rooms/[id]         → 编辑房型
DELETE /api/admin/rooms/[id]         → 删除房型
POST   /api/admin/rooms/[id]/areas   → 新增区域/热点
PATCH  /api/admin/areas/[id]         → 编辑区域（含热点位置）
DELETE /api/admin/areas/[id]         → 删除区域
PATCH  /api/admin/content/[id]       → 编辑区域内容
POST   /api/admin/images/upload      → 上传图片到Cloudinary
POST   /api/admin/images             → 关联图片到区域
DELETE /api/admin/images/[id]        → 删除图片
PATCH  /api/admin/images/reorder     → 重排图片顺序

Auth API

POST   /api/auth/signin              → 登录
POST   /api/auth/signout             → 登出
GET    /api/auth/session             → 获取当前会话
```

### 7.2 响应格式（统一信封）

```typescript
// 成功响应
{
  success: true,
  data: T,                    // 数据负载
  meta?: {                    // 分页元数据（列表接口）
    total: number,
    page: number,
    limit: number
  }
}

// 错误响应
{
  success: false,
  error: {
    code: string,             // 错误码
    message: string,          // 用户可读错误信息
    details?: unknown         // 开发调试信息（仅开发环境）
  }
}
```

### 7.3 搜索API详细设计

```
GET /api/search?q=Coffee+Maker

Response:
{
  success: true,
  data: {
    results: [
      {
        id: "area_xxx",
        areaName: "Coffee Station",
        roomType: {
          id: "room_a",
          name: "A Suite",
          slug: "a-suite"
        },
        matchedFields: ["description", "requirements"],
        previewImage: "https://...",
        excerpt: "...placeholder..."
      },
      ...
    ],
    totalResults: 3
  }
}
```

---

## 8. 路由设计

### 8.1 完整路由表

| 路由 | 页面名称 | 组件 | 认证 | 渲染策略 |
|------|----------|------|------|----------|
| `/` | 首页 - 房型选择 | `HomePage` | 否 | SSG |
| `/rooms/[slug]` | 房型总览 | `RoomOverviewPage` | 否 | SSG |
| `/rooms/[slug]/[areaId]` | 区域详情 | `AreaDetailPage` | 否 | SSG |
| `/rooms/compare?left=a&right=b` | A/B对比 | `ComparePage` | 否 | ISR |
| `/checklist` | 检查清单 | `ChecklistPage` | 否 | SSR |
| `/search?q=keyword` | 搜索结果 | `SearchPage` | 否 | SSR |
| `/admin` | 管理仪表盘 | `AdminDashboard` | 是 | SSR |
| `/admin/rooms` | 房型管理 | `RoomManagePage` | 是 | SSR |
| `/admin/rooms/new` | 新增房型 | `RoomCreatePage` | 是 | SSR |
| `/admin/rooms/[id]/edit` | 编辑房型 | `RoomEditPage` | 是 | SSR |
| `/admin/rooms/[id]/areas` | 热点管理 | `HotspotManagePage` | 是 | SSR |
| `/admin/areas/[id]/content` | 内容编辑 | `ContentEditPage` | 是 | SSR |
| `/admin/areas/[id]/images` | 图片管理 | `ImageManagePage` | 是 | SSR |
| `/auth/signin` | 登录 | `SignInPage` | 否 | SSR |

### 8.2 动态路由参数

```
[slug]        → a-suite | b-suite | c-suite | villa | presidential-suite
[areaId]      → cuid (自动生成)
[id]          → cuid (自动生成)
```

---

## 9. 组件树设计

### 9.1 公共页面组件树

```
RootLayout
├── Providers (TanStackQuery, Auth, Theme)
│   ├── MobileHeader
│   │   ├── Logo
│   │   └── SearchBar (collapsible)
│   │       ├── SearchInput
│   │       └── SearchSuggestions (dropdown)
│   ├── Main (flex-1)
│   │   ├── [HomePage]
│   │   │   ├── HeroSection
│   │   │   │   ├── PageTitle
│   │   │   │   └── SubTitle
│   │   │   └── RoomTypeSelector
│   │   │       └── RoomTypeCard[] (map over rooms)
│   │   │           ├── CoverImage
│   │   │           ├── RoomName
│   │   │           └── ArrowIcon
│   │   │
│   │   ├── [RoomOverviewPage]
│   │   │   ├── RoomBreadcrumb
│   │   │   ├── RoomPanorama (relative container)
│   │   │   │   ├── PanoramaImage (next/image, priority)
│   │   │   │   └── HotspotOverlay
│   │   │   │       └── HotspotMarker[] (absolutely positioned)
│   │   │   │           ├── PulseRing (active animation)
│   │   │   │           └── Icon + Label
│   │   │   ├── AreaQuickLinks (horizontal scroll chips)
│   │   │   └── AreaDetailSheet (bottom drawer / full-screen)
│   │   │       ├── SheetHeader (drag handle + area name)
│   │   │       ├── ImageGallery
│   │   │       │   ├── MainImage (swipeable)
│   │   │       │   ├── NavArrow (prev / next)
│   │   │       │   └── ThumbnailNav
│   │   │       ├── ContentSection
│   │   │       │   ├── RequirementsList
│   │   │       │   │   └── RequirementItem[] (✓ bullet)
│   │   │       │   └── CommonMistakesList
│   │   │       │       └── MistakeItem[] (✗ bullet)
│   │   │       └── NotesSection
│   │   │
│   │   ├── [AreaDetailPage]
│   │   │   ├── AreaBreadcrumb
│   │   │   ├── ImageGallery (full-width)
│   │   │   │   ├── ImageViewer (lightbox, pinch-zoom)
│   │   │   │   └── ThumbnailNav
│   │   │   ├── ContentSection
│   │   │   │   ├── Title + Description
│   │   │   │   ├── Requirements (styled checklist)
│   │   │   │   ├── Notes (info cards)
│   │   │   │   └── CommonMistakes (warning cards)
│   │   │   └── RelatedAreasLinks
│   │   │
│   │   ├── [ComparePage]
│   │   │   ├── CompareHeader (A vs B selector)
│   │   │   └── RoomCompareView
│   │   │       ├── CompareImageSlider (left/right split)
│   │   │       │   ├── ImageLeft (A Suite)
│   │   │       │   ├── ImageRight (B Suite)
│   │   │       │   └── SliderHandle (draggable divider)
│   │   │       └── CompareTable
│   │   │           └── CompareRow[] (per area)
│   │   │               ├── AreaName
│   │   │               ├── DiffHighlight
│   │   │               └── Notes
│   │   │
│   │   ├── [SearchPage]
│   │   │   ├── SearchBar (sticky top)
│   │   │   ├── ResultsCount
│   │   │   └── SearchResultCard[]
│   │   │       ├── Thumbnail
│   │   │       ├── AreaName + RoomType
│   │   │       ├── Excerpt (highlighted match)
│   │   │       └── "View" Link
│   │   │
│   │   └── [ChecklistPage]
│   │       ├── RoomTypeTabs (切换房型)
│   │       ├── ChecklistProgress (环形进度条)
│   │       │   ├── ProgressRing (SVG)
│   │       │   └── ProgressLabel ("85%")
│   │       └── ChecklistList
│   │           └── ChecklistItem[] (□)
│   │               ├── Checkbox (animated check)
│   │               ├── AreaLabel
│   │               └── AreaLink
│   │
│   └── Footer (minimal, only on desktop)
│       ├── Copyright
│       └── ResortName
│
└── ImageViewerModal (Portal, full-screen overlay)
    ├── ImageViewer (swipeable, pinch-zoom)
    ├── CloseButton
    ├── ImageCounter ("3 / 8")
    └── ThumbnailStrip (bottom)
```

### 9.2 管理后台组件树

```
AdminLayout
├── AdminSidebar (desktop: fixed left)
│   ├── Logo
│   ├── NavItem: Dashboard
│   ├── NavItem: Room Types
│   ├── NavItem: Content
│   ├── NavItem: Images
│   └── UserMenu (avatar + signout)
├── AdminMobileHeader (mobile only)
│   ├── HamburgerMenu (trigger Sheet)
│   └── PageTitle
└── AdminMain
    ├── [AdminDashboard]
    │   ├── StatCard[] (房型数、区域数、图片数)
    │   ├── RecentActivityList
    │   └── QuickActionButtons
    │
    ├── [RoomManagePage]
    │   ├── PageHeader ("+ Add Room Type")
    │   ├── RoomTypeTable
    │   │   └── RoomTypeRow[]
    │   │       ├── CoverThumbnail
    │   │       ├── Name + Slug
    │   │       ├── AreaCount
    │   │       ├── StatusBadge (Active/Inactive)
    │   │       └── ActionButtons (Edit, Delete, Manage Areas)
    │   └── DeleteConfirmDialog
    │
    ├── [RoomFormPage]
    │   ├── FormHeader
    │   ├── RoomForm (React Hook Form + Zod)
    │   │   ├── NameInput
    │   │   ├── SlugInput (auto-generated)
    │   │   ├── DescriptionTextarea
    │   │   ├── CoverImageUpload (drag & drop)
    │   │   ├── PanoramaImageUpload
    │   │   └── SubmitButtons
    │   └── DeleteWarning
    │
    ├── [HotspotManagePage]
    │   ├── PanoramaViewer
    │   │   ├── PanoramaImage
    │   │   └── EditableHotspotOverlay
    │   │       └── DraggableHotspotMarker[] (drag, resize, delete)
    │   │           ├── DragHandle
    │   │           ├── ResizeHandle
    │   │           └── DeleteButton
    │   ├── AddHotspotButton
    │   └── HotspotPropertiesPanel (右侧面板 / 底部抽屉)
    │       ├── NameInput
    │       ├── PositionInputs (X, Y, W, H)
    │       ├── SortOrderInput
    │       └── SaveButton
    │
    ├── [ContentEditPage]
    │   ├── Breadcrumb (RoomType > Area > Content)
    │   └── ContentEditorForm
    │       ├── TitleInput
    │       ├── DescriptionEditor (Markdown)
    │       ├── RequirementsEditor (Markdown, bullet list)
    │       ├── NotesEditor (Markdown)
    │       ├── CommonMistakesEditor (Markdown, bullet list)
    │       └── SaveButton + PreviewButton
    │
    └── [ImageManagePage]
        ├── Breadcrumb
        ├── ImageUploadZone (drag & drop, multi-file)
        │   ├── UploadProgressBar[]
        │   └── DropArea
        └── SortableImageGrid
            └── SortableImageItem[] (drag to reorder)
                ├── Thumbnail
                ├── AltTextInput (inline edit)
                ├── DeleteButton
                └── DragHandle
```

---

## 10. 安全架构

### 10.1 认证流程

```
┌─────────────────────────────────────────┐
│              认证流程                     │
├─────────────────────────────────────────┤
│                                          │
│  ┌──────────┐                            │
│  │  Sign In  │                           │
│  │  Form     │──POST /api/auth/signin───▶│ Auth.js
│  └──────────┘                            │ Credentials
│       │                                   │ Provider
│       ▼                                   │
│  ┌──────────┐                            │
│  │  JWT     │◀────────Session───────────│ (bcrypt verify)
│  │  Cookie  │                            │
│  └────┬─────┘                            │
│       │                                   │
│       ▼                                   │
│  ┌──────────┐                            │
│  │  Protected│──checks role─────────────▶│ middleware.ts
│  │  Page    │   enum UserRole            │ (route guard)
│  └──────────┘                            │
│                                          │
└─────────────────────────────────────────┘
```

### 10.2 权限矩阵

| 操作 | Housekeeper | Supervisor | Admin |
|------|:-----------:|:----------:|:-----:|
| 查看培训内容 | ✓ | ✓ | ✓ |
| 使用搜索 | ✓ | ✓ | ✓ |
| 使用检查清单 | ✓ | ✓ | ✓ |
| 上传图片 | ✗ | ✓ | ✓ |
| 编辑内容 | ✗ | ✓ | ✓ |
| 新增/编辑房型 | ✗ | ✗ | ✓ |
| 删除房型 | ✗ | ✗ | ✓ |
| 管理用户 | ✗ | ✗ | ✓ |

### 10.3 安全措施

| 措施 | 实现 |
|------|------|
| **CSRF** | NextAuth.js 内置 CSRF Token |
| **XSS** | React 默认转义 + DOMPurify 处理 Markdown |
| **SQL注入** | Prisma 参数化查询 |
| **文件上传验证** | 服务端验证：类型(JPEG/PNG/WebP) + 大小限制(10MB) |
| **速率限制** | Vercel Edge 速率限制 + 登录失败限制 |
| **CSP** | 配置在 next.config.js 中 |
| **HTTPS** | Vercel 自动强制 HTTPS |
| **Secrets** | 所有密钥通过环境变量注入，无硬编码 |

---

## 11. 部署架构

### 11.1 部署拓扑

```
┌─────────────────────────────────────────────────────┐
│                      Internet                        │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│                 Vercel Edge Network                  │
│  ┌─────────────────────────────────────────────┐    │
│  │  CDN (Static Assets, SSG Pages)              │    │
│  │   - / (首页)                                  │    │
│  │   - /rooms/* (房型总览)                       │    │
│  │   - JS/CSS bundles                            │    │
│  └─────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────┐    │
│  │  Serverless Functions (SSR + API)            │    │
│  │   - /search?q=...                            │    │
│  │   - /checklist                               │    │
│  │   - /api/*                                   │    │
│  │   - /admin/*                                 │    │
│  └─────────────────────────────────────────────┘    │
└──────────────────────┬──────────────────────────────┘
                       │
            ┌──────────┴──────────┐
            │                     │
            ▼                     ▼
┌──────────────────┐   ┌──────────────────┐
│    PostgreSQL     │   │   Cloudinary     │
│  (Supabase/Railway)│   │   (Image CDN)    │
└──────────────────┘   └──────────────────┘
```

### 11.2 环境变量

```bash
# Database
DATABASE_URL=postgresql://...

# Auth
AUTH_SECRET=xxx
AUTH_URL=https://xxx.vercel.app

# Cloudinary
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
CLOUDINARY_UPLOAD_FOLDER=housekeeper-training

# App
NEXT_PUBLIC_APP_NAME=Holiday Resort Training
NEXT_PUBLIC_APP_URL=https://xxx.vercel.app
```

---

## 12. 扩展性设计

### 12.1 新增房型（零代码）

管理员只需在后台添加新记录：
1. 输入房型名称（如 "C Suite"）
2. 上传全景图
3. 在全景图上点击添加热点区域
4. 编辑每个区域的内容和图片

**无需任何代码修改。**

### 12.2 新增区域类型

系统不限制区域名称，管理员可自由创建如：
- "Mini Bar"
- "Wardrobe"
- "Desk Area"
- "Window Seat"

### 12.3 V2.0 预留扩展点

| 扩展功能 | 预留设计 |
|----------|----------|
| **AI照片检查** | `AreaImage` 表可加入 `ai_analysis_result (JSON)` 字段 |
| **员工考试** | `User` 表可关联 `ExamResult` 表 |
| **培训进度** | `User` 表关联 `TrainingProgress` 表 |
| **多语言** | 核心字段可扩展为 `Translations (JSON)` 或 i18n 路由 |
| **二维码访问** | 每个房型有唯一 slug，生成静态URL即可 |
| **Supervisor审核** | `AuditLog` 表已预留，可扩展 `Review` 表 |

### 12.4 性能扩展

| 场景 | 方案 |
|------|------|
| 图片量增大 | Cloudinary自动CDN分发 + 响应式图片(f_auto, q_auto) |
| 搜索量增大 | 引入 PostgreSQL Full-Text Search 或 Meilisearch |
| 流量增大 | Vercel Edge Functions 自动扩缩容 |
| 多区域部署 | Vercel + Cloudinary CDN 已全球覆盖 |

---

## 附录 A：关键技术决策记录

| # | 决策 | 选项 | 选择 | 理由 |
|---|------|------|------|------|
| 1 | 前台渲染方式 | SSR / SSG / ISR | SSG + ISR | 培训内容相对静态，SSG秒级加载；搜索页SSR |
| 2 | 管理后台渲染 | SSG / SSR / CSR | SSR | 数据实时性要求，Admin默认SSR |
| 3 | 图片存储 | S3 / Cloudinary | Cloudinary | 内置优化、CDN、Transformation API |
| 4 | 热点交互 | Canvas / DOM | DOM (CSS absolute) | 移动端触摸友好，响应式缩放简单 |
| 5 | 管理后台热点编辑 | Canvas / DOM | DOM + 拖拽库 | 简单直观，开发效率高 |
| 6 | 状态管理 | Redux / Zustand / TanStack Query | TanStack Query | 服务端数据为主，避免客户端Store冗余 |

---

## 附录 B：开发里程碑

| 阶段 | 内容 | 预估 |
|------|------|------|
| Phase 1 | 项目搭建 + 数据库 + Auth | 基础框架 |
| Phase 2 | 公共页面：首页 + 房型总览 + 热点 | 核心体验 |
| Phase 3 | 区域详情 + 图片画廊 | 内容展示 |
| Phase 4 | 搜索 + A/B对比 + 检查清单 | 辅助功能 |
| Phase 5 | 管理后台完整CRUD | 内容管理 |
| Phase 6 | E2E测试 + 响应式验证 + 性能优化 | 质量保证 |
| Phase 7 | 部署Vercel + 生产环境配置 | 上线 |

---

> **文档版本**: V1.0 | **最后更新**: 2026-06-02 | **作者**: Architecture Team
