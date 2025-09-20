module.exports = {
  apps: [
    {
      name: 'frontend-preview',
      // 使用 npm script: preview (vite preview)
      script: 'npm',
      args: 'run preview',
      cwd: './frontend',
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 5173
      }
    }
    // 如果有后端或需要使用静态服务，可以在这里添加更多进程
  ]
}
