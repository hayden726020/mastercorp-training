// ============================================================
// PM2 Ecosystem Configuration — Housekeeper Training System
// ============================================================
// Usage:
//   pm2 start ecosystem.config.js          # Start
//   pm2 reload ecosystem.config.js         # Zero-downtime reload
//   pm2 stop housekeeper-training          # Stop
//   pm2 logs housekeeper-training          # View logs
//   pm2 save                               # Save for auto-start on reboot
//   pm2 startup                            # Enable auto-start on boot
// ============================================================

module.exports = {
  apps: [
    {
      // ── Process identity ──
      name: "housekeeper-training",
      script: "node_modules/.bin/next",
      args: "start",
      cwd: __dirname,

      // ── Production mode ──
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },

      // ── Process management ──
      instances: 1, // Single instance (2GB RAM server)
      exec_mode: "fork",
      autorestart: true,
      max_restarts: 10,
      restart_delay: 5000, // 5s between restarts
      max_memory_restart: "800M", // Restart if memory exceeds 800MB

      // ── Logging ──
      error_file: "./logs/error.log",
      out_file: "./logs/out.log",
      log_file: "./logs/combined.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
      time: true,

      // ── Graceful shutdown ──
      kill_timeout: 10000, // 10s grace period for connections to close
      listen_timeout: 15000,
      wait_ready: true,

      // ── Watch (disable in production) ──
      watch: false,

      // ── Node.js options ──
      node_args: "--max-old-space-size=1024", // 1GB heap limit for 2GB RAM server
    },
  ],
};
