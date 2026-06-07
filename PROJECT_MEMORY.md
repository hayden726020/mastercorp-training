# PROJECT_MEMORY.md — Mastercorp Housekeeper Training Website

## 服务器信息

| 项目 | 值 |
|------|-----|
| **服务器IP** | 43.173.99.254 |
| **SSH用户** | root |
| **部署路径** | /opt/housekeeper-training |
| **端口** | 3000 |
| **进程管理** | PM2 (进程名: housekeeper-training) |
| **PM2配置** | ecosystem.config.js |

## 网站技术栈

| 层级 | 技术 | 版本 |
|------|------|------|
| 框架 | Next.js (App Router) | 14.2.35 |
| 语言 | TypeScript | 5.x |
| 样式 | Tailwind CSS | 3.4.1 |
| 组件库 | shadcn/ui + @base-ui/react | latest |
| 图标 | lucide-react | 1.17.0 |
| 包管理 | pnpm | - |
| 渲染策略 | SSG (Static Site Generation) | - |

## 项目结构

```
src/
├── app/
│   ├── layout.tsx              # 根布局
│   ├── page.tsx                # 首页 - 房型选择
│   ├── globals.css             # 全局样式
│   └── rooms/[slug]/
│       ├── page.tsx            # 房型总览（全景图+热点）
│       └── [areaId]/page.tsx   # 区域详情独立页
├── components/
│   ├── ui/                     # 基础UI组件 (button, card, dialog)
│   ├── room/                   # 房型业务组件
│   │   ├── room-type-card.tsx
│   │   ├── room-panorama.tsx
│   │   ├── room-overview.tsx
│   │   ├── hotspot-marker.tsx
│   │   ├── hotspot-overlay.tsx
│   │   ├── area-detail-sheet.tsx   # Modal弹窗展示区域内容
│   │   ├── area-page-header.tsx
│   │   ├── area-breadcrumb.tsx
│   │   ├── area-quick-links.tsx
│   │   ├── related-areas-links.tsx
│   │   ├── step-summary.tsx        # 7步清洁流程侧边栏
│   │   └── custom-icons.tsx
│   └── image/
│       ├── image-gallery.tsx       # 交互式图片画廊（缩略图+前后翻页）
│       └── image-viewer.tsx        # 全屏图片查看器
├── lib/
│   ├── utils.ts
│   ├── constants.ts
│   ├── image-type-config.ts
│   └── locales/zh.ts               # 中文本地化
├── mock/
│   ├── rooms.ts                    # 房型数据 (A Suite, B Suite)
│   ├── areas.ts                    # 区域定义 + 热点坐标
│   ├── content.ts                  # 区域内容（8步铺床流程等）+ 训练图片
│   ├── images.ts
│   ├── placement-standards.ts
│   ├── search-index.ts
│   └── checklist.ts
├── types/
│   └── index.ts                    # 全部类型定义
└── services/                       # 业务服务层（预留）
```

## 数据架构 (Mock先行)

- **RoomType** → 1:N → **RoomArea** → 1:1 → **AreaContent** (含 images[])
- 当前使用 Mock 数据 (src/mock/)，未来 Sprint 8 接 PostgreSQL + Prisma
- 内容优先链: `content.descriptionZh` → `content.description` → `area.descriptionZh` → `area.description`

## 当前功能完成状态

### ✅ 已完成
- [x] 首页房型选择 (A Suite / B Suite)
- [x] 房型总览页（全景图 + 热点标记）
- [x] 热点点击 → Modal 弹窗 (area-detail-sheet.tsx)
- [x] 区域详情独立页 (/rooms/[slug]/[areaId])
- [x] 交互式图片画廊 (前后翻页、缩略图导航)
- [x] 全屏图片查看器 (ESC关闭、键盘导航、滑动)
- [x] 面包屑导航
- [x] 7步清洁流程展示 (step-summary)
- [x] 相关区域链接
- [x] 8步铺床流程（中英文，A/B Suite统一）
- [x] 内容描述正确显示（priority chain修复）
- [x] 服务器部署 (PM2)

### ⏳ 计划中 (Sprint Plan)
- [ ] Checklist 检查清单页面
- [ ] 搜索功能
- [ ] A/B对比页面
- [ ] Admin 管理后台
- [ ] 数据库接入 (PostgreSQL + Prisma)

## 已知Bug / 注意事项

1. **部署端口冲突**: 如果PM2重启失败报 EADDRINUSE，需要 `fuser -k 3000/tcp` 释放端口再重启
2. **PM2重复实例**: killall node 后可能出现多个PM2实例，需手动删除旧实例
3. **内容显示问题**: area-detail-sheet.tsx 必须使用 `content?.descriptionZh` 而非 `area.descriptionZh`，否则只显示区域摘要而非详细步骤
4. **SSG 页面**: 所有页面在构建时预渲染，修改 mock 数据后必须重新 build + 部署

## 部署命令

```bash
# 1. 本地构建
cd "e:\Mastercorp Project"
npm run build

# 2. 打包
tar -czf deploy.tar.gz .next public package.json

# 3. 上传到服务器
scp deploy.tar.gz root@43.173.99.254:/opt/housekeeper-training/

# 4. 服务器端解压 + 重启
ssh root@43.173.99.254 "cd /opt/housekeeper-training && tar -xzf deploy.tar.gz && fuser -k 3000/tcp 2>/dev/null; pm2 restart housekeeper-training --update-env || pm2 start ecosystem.config.js"

# 5. 验证
curl -s -o /dev/null -w "%{http_code}" http://43.173.99.254:3000/
```

## 关键页面URL

- 首页: http://43.173.99.254:3000/
- A Suite 总览: http://43.173.99.254:3000/rooms/a-suite
- B Suite 总览: http://43.173.99.254:3000/rooms/b-suite
- A Suite 卧室: http://43.173.99.254:3000/rooms/a-suite/area-a-bed
- B Suite 床区: http://43.173.99.254:3000/rooms/b-suite/area-b-bed
