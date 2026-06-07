#!/usr/bin/env bash
# ============================================================
# update.sh — Housekeeper Training System Update
# ============================================================
# Usage:  bash deploy/update.sh
#
# This script will:
#   1. Pull latest changes (git pull)
#   2. Install any new dependencies (npm ci)
#   3. Rebuild the application (npm run build)
#   4. Zero-downtime reload with PM2
#   5. Show recent logs
# ============================================================

set -euo pipefail

# ── Colors ───────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log()  { echo -e "${GREEN}[✓]${NC} $*"; }
warn() { echo -e "${YELLOW}[!]${NC} $*"; }
err()  { echo -e "${RED}[✗]${NC} $*"; }
info() { echo -e "${BLUE}[i]${NC} $*"; }

# ── Config ───────────────────────────────────────────────
PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
APP_NAME="housekeeper-training"

info "Project directory: ${PROJECT_DIR}"
cd "${PROJECT_DIR}"

# ═══════════════════════════════════════════════════════════
# Step 1: Pull latest code
# ═══════════════════════════════════════════════════════════
echo ""
info "Step 1/5: Pulling latest changes..."

if git rev-parse --git-dir > /dev/null 2>&1; then
    # Stash local changes if any
    if ! git diff --quiet || ! git diff --cached --quiet; then
        warn "Local changes detected. Stashing..."
        git stash push -m "auto-stash before update $(date +%Y-%m-%d_%H:%M:%S)"
    fi

    # Pull
    CURRENT_BRANCH=$(git branch --show-current)
    info "Pulling origin/${CURRENT_BRANCH}..."
    git pull origin "${CURRENT_BRANCH}"

    # Pop stash if we stashed
    if git stash list | grep -q "auto-stash before update"; then
        info "Restoring stashed changes..."
        git stash pop || warn "Could not pop stash — possible conflicts."
    fi

    log "Code updated."
else
    warn "Not a git repository. Skipping git pull."
    info "Manually copy updated files to ${PROJECT_DIR} and re-run this script."
fi

# ═══════════════════════════════════════════════════════════
# Step 2: Install dependencies
# ═══════════════════════════════════════════════════════════
echo ""
info "Step 2/5: Installing dependencies..."

if [[ -f "package-lock.json" ]]; then
    npm ci --production=false
else
    npm install --production=false
fi
log "Dependencies up to date."

# ═══════════════════════════════════════════════════════════
# Step 3: Check .env
# ═══════════════════════════════════════════════════════════
echo ""
info "Step 3/5: Verifying environment..."

if [[ ! -f ".env" ]]; then
    warn ".env not found."
    if [[ -f ".env.example" ]]; then
        info "Creating .env from .env.example..."
        cp .env.example .env
        warn "Please edit .env with real values if this is Sprint 8+."
    else
        err "No .env or .env.example found. Create one before continuing."
        exit 1
    fi
fi
log "Environment OK."

# ═══════════════════════════════════════════════════════════
# Step 4: Build
# ═══════════════════════════════════════════════════════════
echo ""
info "Step 4/5: Building application..."

# Backup previous build in case of rollback
if [[ -d ".next" ]]; then
    info "Backing up previous build to .next.bak..."
    rm -rf .next.bak
    cp -r .next .next.bak
fi

# Build
if npm run build; then
    log "Build succeeded."
    rm -rf .next.bak  # Clean up backup
else
    err "Build failed!"

    # Restore previous build
    if [[ -d ".next.bak" ]]; then
        warn "Restoring previous build..."
        rm -rf .next
        mv .next.bak .next
        log "Previous build restored. Application is still running."
    fi

    exit 1
fi

# ═══════════════════════════════════════════════════════════
# Step 5: Zero-downtime reload
# ═══════════════════════════════════════════════════════════
echo ""
info "Step 5/5: Reloading application..."

if pm2 list | grep -q "${APP_NAME}"; then
    pm2 reload ecosystem.config.js --update-env
    log "Application reloaded with zero downtime."
else
    warn "PM2 process '${APP_NAME}' not found. Starting fresh..."
    pm2 start ecosystem.config.js
    pm2 save
fi

# ═══════════════════════════════════════════════════════════
# Done
# ═══════════════════════════════════════════════════════════
echo ""
echo "============================================================"
echo -e "  ${GREEN}Update Complete!${NC}"
echo "============================================================"
echo ""
echo "  Check status:  pm2 status"
echo "  Recent logs:   pm2 logs ${APP_NAME} --lines 30"
echo ""

# Show last few log lines
pm2 logs "${APP_NAME}" --lines 10 --nostream
