#!/usr/bin/env bash
# ============================================================
# install.sh — Housekeeper Training System Deployment
# ============================================================
# Target: Tencent Cloud Ubuntu 22.04 LTS
# Usage:  sudo bash deploy/install.sh
#
# This script will:
#   1. Check Node.js installation (>= 18)
#   2. Install PM2 globally
#   3. Install project dependencies (npm ci)
#   4. Copy .env.example → .env (if not exists)
#   5. Build the Next.js application
#   6. Create log directory
#   7. Start / reload the PM2 process
#   8. Configure PM2 auto-start on boot
#   9. Print Nginx setup instructions
# ============================================================

set -euo pipefail

# ── Colors ───────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log()  { echo -e "${GREEN}[✓]${NC} $*"; }
warn() { echo -e "${YELLOW}[!]${NC} $*"; }
err()  { echo -e "${RED}[✗]${NC} $*"; }
info() { echo -e "${BLUE}[i]${NC} $*"; }

# ── Check root (or sudo) ─────────────────────────────────
if [[ $EUID -eq 0 ]]; then
    warn "Running as root. Consider running as a regular user with sudo."
fi

# ── Config ───────────────────────────────────────────────
PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
APP_NAME="housekeeper-training"
NODE_MIN_VERSION=18
REQUIRED_NODE=18

info "Project directory: ${PROJECT_DIR}"
cd "${PROJECT_DIR}"

# ═══════════════════════════════════════════════════════════
# Step 1: Check Node.js
# ═══════════════════════════════════════════════════════════
echo ""
info "Step 1/7: Checking Node.js installation..."

if ! command -v node &> /dev/null; then
    err "Node.js is not installed."
    echo ""
    echo "  Install Node.js 18+ via NodeSource:"
    echo "  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -"
    echo "  sudo apt-get install -y nodejs"
    echo ""
    echo "  Or use nvm:"
    echo "  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash"
    echo "  nvm install 20"
    echo ""
    exit 1
fi

NODE_VERSION=$(node -v | sed 's/v//' | cut -d. -f1)
if [[ "${NODE_VERSION}" -lt "${REQUIRED_NODE}" ]]; then
    err "Node.js version ${NODE_VERSION} detected. Version ${REQUIRED_NODE}+ is required."
    exit 1
fi
log "Node.js $(node -v) — OK"

# Check npm
if ! command -v npm &> /dev/null; then
    err "npm is not installed."
    exit 1
fi
log "npm $(npm -v) — OK"

# ═══════════════════════════════════════════════════════════
# Step 2: Install PM2
# ═══════════════════════════════════════════════════════════
echo ""
info "Step 2/7: Installing PM2..."

if command -v pm2 &> /dev/null; then
    log "PM2 $(pm2 -v) already installed."
else
    npm install -g pm2
    log "PM2 installed."
fi

# ═══════════════════════════════════════════════════════════
# Step 3: Install dependencies
# ═══════════════════════════════════════════════════════════
echo ""
info "Step 3/7: Installing npm dependencies..."

if [[ -f "package-lock.json" ]]; then
    npm ci --production=false
else
    npm install --production=false
fi
log "Dependencies installed."

# ═══════════════════════════════════════════════════════════
# Step 4: Environment variables
# ═══════════════════════════════════════════════════════════
echo ""
info "Step 4/7: Setting up environment..."

if [[ ! -f ".env" ]]; then
    if [[ -f ".env.example" ]]; then
        cp .env.example .env
        log ".env created from .env.example (no variables active for Mock phase)."
        warn "When database/auth/Cloudinary are added, update .env with real values."
    else
        warn "No .env.example found. Creating minimal .env..."
        cat > .env << 'EOF'
NODE_ENV=production
PORT=3000
EOF
        log "Minimal .env created."
    fi
else
    log ".env already exists — skipping."
fi

# ═══════════════════════════════════════════════════════════
# Step 5: Build
# ═══════════════════════════════════════════════════════════
echo ""
info "Step 5/7: Building Next.js application..."

# Clean previous build if exists
if [[ -d ".next" ]]; then
    info "Cleaning previous build..."
    rm -rf .next
fi

npm run build
log "Build completed."

# ═══════════════════════════════════════════════════════════
# Step 6: Create log directory & Start PM2
# ═══════════════════════════════════════════════════════════
echo ""
info "Step 6/7: Starting application with PM2..."

# Create log directory
mkdir -p "${PROJECT_DIR}/logs"

# Stop existing process if running
if pm2 list | grep -q "${APP_NAME}"; then
    info "Reloading existing PM2 process..."
    pm2 reload ecosystem.config.js --update-env
else
    info "Starting new PM2 process..."
    pm2 start ecosystem.config.js
fi

log "PM2 process started."

# ═══════════════════════════════════════════════════════════
# Step 7: Configure auto-start on boot
# ═══════════════════════════════════════════════════════════
echo ""
info "Step 7/7: Configuring PM2 auto-start on boot..."

pm2 save

# Generate startup script (detects init system: systemd on Ubuntu 22.04)
pm2 startup systemd -u "$(whoami)" --hp "$(echo ~)" 2>/dev/null || {
    warn "Could not auto-configure PM2 startup."
    info "Run manually: pm2 startup systemd"
    info "Then: pm2 save"
}

log "PM2 auto-start configured."

# ═══════════════════════════════════════════════════════════
# Done — Print summary
# ═══════════════════════════════════════════════════════════
echo ""
echo "============================================================"
echo -e "  ${GREEN}Deployment Complete!${NC}"
echo "============================================================"
echo ""
echo "  Next.js server:  http://localhost:3000"
echo "  PM2 status:      pm2 status"
echo "  PM2 logs:        pm2 logs ${APP_NAME}"
echo "  PM2 restart:     pm2 reload ${APP_NAME}"
echo ""
echo "  ── Next Steps ──"
echo "  1. Test locally:  curl http://localhost:3000"
echo "  2. Configure Nginx:"
echo "     sudo cp deploy/nginx.conf /etc/nginx/sites-available/${APP_NAME}"
echo "     sudo ln -sf /etc/nginx/sites-available/${APP_NAME} /etc/nginx/sites-enabled/"
echo "     sudo nginx -t && sudo systemctl reload nginx"
echo ""
echo "  3. (Optional) Set up SSL via Let's Encrypt:"
echo "     sudo apt-get install -y certbot python3-certbot-nginx"
echo "     sudo certbot --nginx -d your-domain.com"
echo ""
echo "  4. After configuring Nginx + SSL, review deploy/nginx.conf"
echo "     and update 'server_name' and SSL certificate paths."
echo ""
echo "  5. When updating the application:"
echo "     bash deploy/update.sh"
echo ""
echo "============================================================"
