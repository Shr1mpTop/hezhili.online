module.exports = {
  apps: [
    {
      name: 'hezhili.online',

        script: 'npm',
        args: 'serve -s dist -l 5173',
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
