module.exports = {
  apps: [{
    name: 'daily-news',
    script: 'pnpm',
    args: 'start',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
      PORT: 6688
    }
  }]
}
