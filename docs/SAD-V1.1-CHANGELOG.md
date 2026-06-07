# SAD V1.0 → V1.1 架构变更报告
# CHANGELOG

---

## 文档信息

| 字段 | 内容 |
|------|------|
| 版本 | V1.0 |
| 日期 | 2026-06-02 |
| 基于 | SAD V1.0, ARCHITECTURE_DECISIONS.md, PRD V1.0 |
| 变更数量 | 8 项（7 架构调整 + 1 综合精简） |

---

## 变更 1：统一热点详情展示方案

### 修改内容

| 操作 | 项目 | 说明 |
|------|------|------|
| ✗ 删除 | AreaDetailPanel | 右侧面板组件 |
| ✗ 删除 | AreaDetailSheet | 全屏 Sheet 组件 |
| ✗ 删除 | BottomSheet | 底部抽屉组件 |
| ✗ 删除 | Sheet 相关状态 (closed/half/expanded) | 三档位拖拽逻辑 |
| ✓ 统一 | AreaDetailModal | 唯一详情展示方案 |

### 修改原因

架构决策 #1 已确认使用 Modal 居中弹出。SAD V1.0 中存在 4 种展示方案，造成：
- 组件冗余（开发多套方案）
- 代码复杂度（多个状态管理）
- 维护负担（修改需同步 4 处）

### 影响范围

| 文件/章节 | 影响 |
|-----------|------|
| SAD 4.1 目录结构 | 移除 area-detail-sheet.tsx / area-detail-panel.tsx |
| SAD 9.1 公共组件树 | 移除 BottomSheet / AreaDetailPanel / AreaDetailSheet |
| SAD 9.3 组件名映射 | 新增 V1.0 → V1.1 对照表 |
| PAGE-PROTOTYPES Page 2 | 已更新为 Modal 方案 |
| ROADMAP Sprint 3 | 目标统一为 AreaDetailModal |

### 风险评估

| 风险 | 等级 | 缓解 |
|------|------|------|
| Modal 在移动端可能太窄 | LOW | 移动端 Modal 宽度 90vw，内容可滚动 |
| 全屏图片查看仍需独立入口 | LOW | Modal 内 "View Full Details" → 跳独立详情页 |

### 开发周期影响

**↑ 加速** — 减少约 1 个 Sprint 的 UI 开发量（不再需要多套方案的适配）

---

## 变更 2：Checklist 架构降级

### 修改内容

| 操作 | 项目 | 说明 |
|------|------|------|
| ✗ 删除 | ChecklistItem Prisma Model | 数据库表 |
| ✗ 删除 | GET /api/checklist/[slug] | API 端点 |
| ✗ 删除 | ChecklistService (服务端) | 服务端 Service |
| ✓ 新增 | IChecklistStorage 接口 | 抽象适配器 |
| ✓ 新增 | LocalChecklistStorage | V1 实现 |
| ✓ 新增 | DatabaseChecklistStorage (预留) | V2 实现 |
| ✓ 新增 | createChecklistStorage() 工厂 | 切换函数 |

### 修改原因

- 架构决策 #5 确认 V1 用 localStorage
- 数据库表对"员工临时勾选"场景过度设计
- 存储方案切换不应影响业务逻辑

### 影响范围

| 文件/章节 | 影响 |
|-----------|------|
| SAD 6.1 ERD | 移除 ChecklistItem 实体 |
| SAD 6.2 Prisma Schema | 移除 model ChecklistItem |
| SAD 6.5 新增 | ChecklistStorageAdapter 模式 |
| SAD 7.1 API 端点 | 移除 checklist API |
| SAD 4.1 目录结构 | 新增 adapters/ 目录 |
| ROADMAP Sprint 7 | 调整为 localStorage + Adapter 实现 |

### 风险评估

| 风险 | 等级 | 缓解 |
|------|------|------|
| localStorage 配额不足 | LOW | try/catch + 降级内存 |
| V2 迁移时需要数据迁移脚本 | MEDIUM | Adapter 接口一致，读取→写入即可 |
| 多设备不同步 | NOT A RISK | V1 不要求跨设备同步 |

### 开发周期影响

**↑ 加速** — 节省 1 个数据库表 + 1 个 API + 服务端同步逻辑的开发

---

## 变更 3：精简用户系统

### 修改内容

| 操作 | 项目 | 说明 |
|------|------|------|
| ✗ 删除 | User Prisma Model | 用户表 |
| ✗ 删除 | UserRole Enum | 角色枚举 |
| ✗ 删除 | AuditLog Prisma Model | 审计表 |
| ✗ 删除 | Auth.js 集成 | 完整认证框架 |
| ✗ 删除 | 三级角色权限矩阵 | Housekeeper/Supervisor/Admin |
| ✓ 新增 | 环境变量 ADMIN_USERNAME / ADMIN_PASSWORD | 单管理员认证 |
| ✓ 新增 | 简单 cookie token 检查 | Middleware |
| ✓ 新增 | useAuth hook | 客户端认证状态 |
| ✓ 新增 | 第 13 章 | 未来认证升级路径 |

### 修改原因

- V1 仅有 "管理员" 和 "普通访客" 两种身份
- 员工端无需登录即可浏览培训内容
- Auth.js + RBAC 对单一管理员场景属于过度设计
- 保留完整升级路径（第 13 章）

### 影响范围

| 文件/章节 | 影响 |
|-----------|------|
| SAD 6.1 ERD | 移除 User, AuditLog 实体 |
| SAD 6.2 Prisma Schema | 移除 User, AuditLog, UserRole |
| SAD 7.1 API 端点 | 移除 auth/signin, auth/signout → 替换为 auth/admin |
| SAD 10 安全架构 | 简化认证流程 |
| SAD 2.1 技术栈 | 移除 Auth.js |
| SAD 13 新增 | 未来认证升级路径 |
| SAD 14.1 新增 | V1 必需 vs V2 增强表 |
| ROADMAP Sprint 9 | 从 "Auth.js + 角色" 降低为 "环境变量登录" |

### 风险评估

| 风险 | 等级 | 缓解 |
|------|------|------|
| 环境变量密码泄露 | MEDIUM | 使用 httpOnly Cookie，密码不以明文存储在客户端 |
| 无多管理员支持 | NOT A RISK | V1 确认仅需单管理员 |
| V2 升级需要数据迁移 | LOW | 升级路径已文档化（第 13 章） |

### 开发周期影响

**↑ 显著加速** — Auth.js 集成通常需 1-2 个 Sprint，现在简化为 0.5 个 Sprint

---

## 变更 4：优化热点模型

### 修改内容

| 操作 | 项目 | 说明 |
|------|------|------|
| ✗ 移除 | positionX, positionY, width, height (固定字段) | 矩形专用坐标 |
| ✓ 新增 | HotspotType Enum | RECT / CIRCLE / POLYGON / POINT |
| ✓ 新增 | coordinates Json 字段 | 灵活坐标存储 |
| ✓ 新增 | coordinates 规范文档 | 每种类型的 JSON 结构 |

### 修改原因

- PRD 中提到 "Coffee Maker", "Remote Control", "Lamp" 等点位物品
- 矩形区域无法精确定位小型物体
- 未来可能出现不规则形状区域（L 形沙发区等）
- 使用 Json 字段比固定 4 字段更灵活

### 影响范围

| 文件/章节 | 影响 |
|-----------|------|
| SAD 6.2 Prisma Schema | RoomArea 新增 hotspotType + coordinates |
| SAD 6.4 新增 | HotspotType + Coordinates 规范 |
| ROADMAP Sprint 2 | HotspotMarker 需要考虑不同形状的渲染 |

### 风险评估

| 风险 | 等级 | 缓解 |
|------|------|------|
| Json 字段无类型安全 | MEDIUM | Service 层做 JSON 格式验证；TypeScript 类型守卫 |
| 旧矩形数据迁移 | LOW | RECT 为默认值，coordinates JSON 兼容旧 {x,y,w,h} 格式 |
| 前端渲染复杂度增加 | MEDIUM | 初期仅实现 RECT + POINT，CIRCLE/POLYGON 预留 |

### 开发周期影响

**→ 中性** — 初期仅 RECT 渲染与旧方案工作量相当；其他形状为预留，不影响 V1 速度

---

## 变更 5：优化图片模型

### 修改内容

| 操作 | 项目 | 说明 |
|------|------|------|
| ✓ 新增 | ImageType Enum | STANDARD / WRONG / DETAIL |
| ✓ 新增 | AreaImage.imageType 字段 | 图片分类 |

### 修改原因

- 培训场景需要展示"正确示范"和"错误示范"的对比
- 细节图帮助员工看清特定摆放点
- 三种分类在前端可用不同颜色标识区分

### 影响范围

| 文件/章节 | 影响 |
|-----------|------|
| SAD 6.2 Prisma Schema | AreaImage 新增 imageType |
| SAD 9.2 管理后台 | ImageSortableItem 增加 type badge |
| PAGE-PROTOTYPES Page 3 | 区域详情页增加图片分类标识 |

### 风险评估

| 风险 | 等级 | 缓解 |
|------|------|------|
| 无 | LOW | 新增可选字段，默认 STANDARD，完全向后兼容 |

### 开发周期影响

**→ 中性** — 一个枚举 + 一个字段，30 分钟内完成

---

## 变更 6：新增核心业务模型 — PlacementStandard

### 修改内容

| 操作 | 项目 | 说明 |
|------|------|------|
| ✓ 新增 | PlacementStandard Prisma Model | 独立标准要求表 |
| ✓ 新增 | PlacementStandard → RoomArea (N:1) | 关联关系 |
| ✓ 新增 | PlacementStandard → RoomType (N:1) | 冗余关联 |
| ✓ 新增 | placement-service.ts | 标准要求 Service |
| ✓ 新增 | 管理后台 StandardList 组件 | 可排序标准项列表 |

### 修改原因

- V1.0 使用 Markdown 字符串 `requirements` 存储所有标准要求
- 后期无法单独管理（编辑/排序/删除）每一条标准
- 独立模型让后台可逐条增删改排序
- 冗余 `roomTypeId` 方便按房型直接查询所有标准

### 影响范围

| 文件/章节 | 影响 |
|-----------|------|
| SAD 6.1 ERD | 新增 PlacementStandard 实体 |
| SAD 6.2 Prisma Schema | 新增 PlacementStandard + 关联 |
| SAD 7.1 API 端点 | 新增 standards CRUD |
| SAD 9.2 管理后台组件树 | ContentEditPage 增加 StandardList |
| ROADMAP Sprint 12 | 内容编辑器需要包含标准管理 |

### 风险评估

| 风险 | 等级 | 缓解 |
|------|------|------|
| 旧 requirements 文本字段与新模型并存 | MEDIUM | AreaContent.requirements 保留但不推荐使用。SEO + 兼容性 |
| 冗余 roomTypeId 可能导致数据不一致 | LOW | Prisma 关联保证一致性；Service 层校验 |

### 开发周期影响

**→ 略有增加** — 新增 1 个表 + 1 个 Service + 基础 UI，约增加 0.5 Sprint

---

## 变更 7：移除 V1 不必要复杂度

### 修改内容

| 类别 | V1.0 | V1.1 | 理由 |
|------|------|------|------|
| 数据获取 | TanStack Query | SWR | 体积小，API 简洁 |
| 状态管理 | TanStack Query + Zustand | SWR + URL | URL 即状态 |
| 测试框架 | Vitest + Playwright | 手动测试 | V1 先保功能正确 |
| 权限系统 | 三级角色矩阵 | 二元 admin check | V1 无多角色 |
| 审计日志 | AuditLog 模型 | 无 | V2 引入 |
| 高级搜索 | 全文索引方案 | LIKE 查询 | 数据量小 |

### 修改原因

V1.0 中存在多个"为未来准备但 V1 用不上"的设计：
- TanStack Query 功能强大但 V1 用不到缓存策略
- 完整测试框架在 Mock 阶段价值有限
- 审计日志在没有多用户时无意义

### 影响范围

全部章节 — 已在 V1.0 → V1.1 各处更新。

### 风险评估

| 风险 | 等级 | 缓解 |
|------|------|------|
| SWR 未来可能不够用 | LOW | SWR 和 TanStack Query API 相似，迁移成本低 |
| 缺少自动化测试的回归风险 | MEDIUM | Sprint 14 可选引入 Playwright 覆盖核心流程 |
| 后期新增多用户需重构认证 | LOW | 第 13 章已规划升级路径，Adapter 模式保证平滑过渡 |

### 开发周期影响

见下方综合评估。

---

## 综合开发周期影响评估

| Sprint | V1.0 预估 | V1.1 预估 | 变化 | 原因 |
|--------|----------|----------|------|------|
| S0 项目骨架 | 1x | 0.8x | ↓ | 减少依赖安装（无 Auth.js, TanStack Query） |
| S1-S4 前台核心 | 4x | 3.5x | ↓ | 统一 Modal 减少开发量 |
| S5 搜索 | 1x | 1x | → | 不变 |
| S6 A/B 对比 | 1x | 1x | → | 不变 |
| S7 检查清单 | 1.5x | 0.8x | ↓↓ | localStorage 替代数据库 |
| S8 数据库 | 1.5x | 1.3x | ↓ | 少 4 个表（User, AuditLog, ChecklistItem, UserRole）|
| S9 认证 | 2x | 0.5x | ↓↓↓ | Auth.js → 环境变量 |
| S10-S13 管理后台 | 4x | 4.5x | ↑ | PlacementStandard 增加 0.5x |
| S14 测试 | 2x | 0x | ↓↓ | V1 手动测试 |
| S15 部署 | 1x | 1x | → | 不变 |
| **总计** | **18x** | **14.4x** | **↓ ~20%** | |

> **结论**: V1.1 相比 V1.0 开发工作量减少约 **20%**，且代码更简洁、维护更轻松。

---

## 变更影响文件总览

| 文件 | 操作 | 状态 |
|------|------|:----:|
| docs/SAD.md (V1.0) | 保留作为参考 | 📄 |
| docs/SAD-V1.1.md | 新建 | ✅ |
| docs/SAD-V1.1-CHANGELOG.md | 新建（本文件） | ✅ |
| docs/PAGE-PROTOTYPES.md | 已更新到 V1.1 | ✅ |
| docs/ROADMAP.md | 待更新对齐 V1.1 | ⏳ |
| memory/ARCHITECTURE_DECISIONS.md | 无需修改 | 📄 |

---

## 确认检查清单

- [x] 变更 1：统一 Modal — SAD 9.1 组件树已更新
- [x] 变更 2：Checklist 降级 — SAD 6.5 + 7.1 已更新
- [x] 变更 3：精简认证 — SAD 10.1 + 13 已更新
- [x] 变更 4：热点模型 — SAD 6.2 + 6.4 已更新
- [x] 变更 5：图片模型 — SAD 6.2 + 7.1 已更新
- [x] 变更 6：PlacementStandard — SAD 6.1 + 6.2 + 6.3 已更新
- [x] 变更 7：V1/V2 分层 — SAD 14 已更新
- [x] 综合影响评估 — 本文件

---

> **CHANGELOG 版本**: V1.0 | **基于**: SAD V1.1
>
> **下一步**: 更新 ROADMAP.md 对齐 SAD V1.1，然后进入 Sprint 0
