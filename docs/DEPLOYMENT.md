# Housekeeper Training System — Deployment Guide

> **版本**: V1.0 (Mock Data Phase — Sprint 4)
> **目标服务器**: Tencent Cloud 轻量应用服务器 / Ubuntu 22.04
> **更新时间**: 2026-06-02

---

## 目录

1. [服务器要求](#1-服务器要求)
2. [初次部署](#2-初次部署)
3. [更新部署](#3-更新部署)
4. [回滚步骤](#4-回滚步骤)
5. [Nginx 配置](#5-nginx-配置)
6. [SSL / HTTPS 配置](#6-ssl--https-配置)
7. [PM2 管理命令](#7-pm2-管理命令)
8. [日志查看](#8-日志查看)
9. [常见问题](#9-常见问题)
10. [数据库迁移 (Sprint 8+)](#10-数据库迁移-sprint-8)
11. [未来升级清单](#11-未来升级清单)

---

## 1. 服务器要求

| 项目 | 最低要求 | 推荐 |
|------|---------|------|
| OS | Ubuntu 22.04 LTS | Ubuntu 22.04 LTS |
| CPU | 1 Core | 2 Core |
| RAM | 1 GB | 2 GB |
| Disk | 20 GB SSD | 40 GB SSD |
| Node.js | 18.x LTS | 20.x LTS |
| npm | 9.x+ | 10.x+ |
| Nginx | 1.18+ | 1.24+ |
| PM2 | 5.x | 5.x |

### 安装 Node.js 20.x (如未安装)

```bash
# Option A: NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Option B: nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20
```

---

## 2. 初次部署

### 2.1 获取代码

```bash
# Option A: Git clone
git clone <your-repo-url> /opt/housekeeper-training
cd /opt/housekeeper-training

# Option B: SCP upload
# Upload the project directory to /opt/housekeeper-training
cd /opt/housekeeper-training
```

### 2.2 一键部署

```bash
sudo bash deploy/install.sh
```

此脚本自动完成:
1. Node.js 版本检查
2. PM2 全局安装
3. npm 依赖安装
4. `.env` 文件创建
5. `npm run build` 构建
6. PM2 进程启动
7. PM2 开机自启配置

### 2.3 手动部署 (如果自动脚本失败)

```bash
# 1. Install dependencies
npm ci

# 2. Create .env
cp .env.example .env

# 3. Build
npm run build

# 4. Install PM2
npm install -g pm2

# 5. Create log directory
mkdir -p logs

# 6. Start
pm2 start ecosystem.config.js
pm2 save
pm2 startup systemd
```

### 2.4 验证部署

```bash
# Check service is running
curl -I http://localhost:3000
# Expected: HTTP/1.1 200 OK

# Check PM2 status
pm2 status
# Expected: housekeeper-training | online | ...

# Check logs
pm2 logs housekeeper-training --lines 20
```

---

## 3. 更新部署

### 3.1 一键更新

```bash
cd /opt/housekeeper-training
bash deploy/update.sh
```

此脚本自动完成:
1. `git pull` 拉取最新代码
2. `npm ci` 安装新依赖
3. `npm run build` 重新构建
4. `pm2 reload` 零停机重启
5. 构建失败自动回滚到上一个构建

### 3.2 手动更新

```bash
cd /opt/housekeeper-training
git pull origin main
npm ci
npm run build
pm2 reload ecosystem.config.js --update-env
```

---

## 4. 回滚步骤

### 4.1 代码回滚

```bash
cd /opt/housekeeper-training

# 回滚到上一个版本
git log --oneline -5          # 查看最近提交
git revert <bad-commit-hash>  # 回滚指定提交
# 或
git reset --hard <good-commit-hash>  # 强制回滚

# 重新部署
bash deploy/update.sh
```

### 4.2 构建回滚 (update.sh 已自动备份)

```bash
cd /opt/housekeeper-training

# 如果上次构建失败，.next.bak 会自动保留
# 手动恢复:
rm -rf .next
mv .next.bak .next
pm2 reload ecosystem.config.js
```

### 4.3 依赖回滚

```bash
# 如果新的 npm 依赖导致问题:
git checkout package-lock.json  # 恢复锁文件
npm ci                          # 重装旧版本依赖
npm run build
pm2 reload ecosystem.config.js
```

---

## 5. Nginx 配置

### 5.1 安装 Nginx

```bash
sudo apt-get update
sudo apt-get install -y nginx
```

### 5.2 配置站点

```bash
# Copy config
sudo cp deploy/nginx.conf /etc/nginx/sites-available/housekeeper-training

# Edit the config to set your domain/server_name
sudo nano /etc/nginx/sites-available/housekeeper-training

# Enable site
sudo ln -sf /etc/nginx/sites-available/housekeeper-training /etc/nginx/sites-enabled/

# Remove default site (optional)
sudo rm -f /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Reload
sudo systemctl reload nginx
```

### 5.3 仅 HTTP 访问 (无域名 / 开发环境)

如果你只需要通过 IP 访问且不需要 HTTPS:
1. 编辑 `/etc/nginx/sites-available/housekeeper-training`
2. 注释掉整个 `server { listen 443 ... }` 块
3. 在 `server { listen 80 ... }` 块中，把 `return 301 https://...` 改为 `proxy_pass http://nextjs_backend;`
4. `sudo nginx -t && sudo systemctl reload nginx`

---

## 6. SSL / HTTPS 配置

### 6.1 使用 Let's Encrypt (免费)

```bash
# Install Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Obtain certificate (replace with your domain)
sudo certbot --nginx -d training.your-domain.com

# Auto-renewal (Certbot sets this up automatically)
sudo certbot renew --dry-run  # Test renewal
```

### 6.2 更新 Nginx 配置中的域名

```bash
sudo nano /etc/nginx/sites-available/housekeeper-training

# 修改:
#   server_name _;
# 为:
#   server_name training.your-domain.com;

sudo nginx -t && sudo systemctl reload nginx
```

---

## 7. PM2 管理命令

```bash
# Status overview
pm2 status

# Detailed info for the app
pm2 show housekeeper-training

# Restart (with downtime)
pm2 restart housekeeper-training

# Reload (zero-downtime)
pm2 reload housekeeper-training

# Stop
pm2 stop housekeeper-training

# Delete from PM2
pm2 delete housekeeper-training

# Save current process list for auto-start
pm2 save

# Monitor (real-time dashboard)
pm2 monit
```

---

## 8. 日志查看

```bash
# Real-time combined logs
pm2 logs housekeeper-training

# Last 50 lines
pm2 logs housekeeper-training --lines 50

# Error log only
pm2 logs housekeeper-training --err

# Saved log files
tail -f logs/out.log
tail -f logs/error.log
tail -f logs/combined.log

# Nginx logs
sudo tail -f /var/log/nginx/housekeeper-training-access.log
sudo tail -f /var/log/nginx/housekeeper-training-error.log
```

---

## 9. 常见问题

### Port 3000 already in use

```bash
# Find what's using the port
sudo lsof -i :3000
# Kill it
sudo kill -9 <PID>
```

### Build fails with memory error

```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=2048"
npm run build
```

### PM2 process keeps crashing

```bash
# Check error log
pm2 logs housekeeper-training --err --lines 50

# Common causes:
# - Missing .env file
# - Port conflict
# - Corrupted .next build → rm -rf .next && npm run build
```

### Nginx returns 502 Bad Gateway

```bash
# Next.js is not running
pm2 status
# If stopped: pm2 start ecosystem.config.js

# Check Nginx error log
sudo tail -f /var/log/nginx/housekeeper-training-error.log
```

### Images not loading

```bash
# Ensure public/images/ directory exists and contains images
ls -la public/images/

# Check next.config.mjs images.remotePatterns for external image domains
```

---

## 10. 数据库迁移 (Sprint 8+)

> ⚠️ **当前 Sprint 4 不需要数据库** — 项目使用 Mock 静态数据。
>
> Sprint 8 引入 Prisma + PostgreSQL 后，请执行以下额外步骤:

```bash
# After npm install, before npm run build:

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# Seed data (first time only)
npx prisma db seed
```

并在 `.env` 中配置:

```env
DATABASE_URL="postgresql://user:password@host:5432/housekeeper_training?schema=public"
```

完整数据库部署步骤将在 Sprint 8 时更新本文档。

---

## 11. 未来升级清单

| Sprint | 新增内容 | 部署变更 |
|--------|---------|---------|
| Sprint 8 | Prisma + PostgreSQL | 添加 `DATABASE_URL` 到 `.env`，运行 `prisma migrate deploy` |
| Sprint 9 | Admin 认证 | 添加 `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `AUTH_SECRET` 到 `.env` |
| Sprint 13 | Cloudinary 上传 | 添加 `CLOUDINARY_*` 到 `.env` |
| Sprint 15 | Vercel 部署 | 可选择迁移到 Vercel 平台（无需 PM2/Nginx） |

---

> **文档维护**: 每次 Sprint 完成后更新本文档的部署变更部分。
