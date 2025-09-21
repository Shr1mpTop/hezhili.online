module.exports = {
  apps: [
    {
      name: 'hezhili.online-frontend',
      script: './serve.js',
      cwd: './frontend',
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 5173
      }
    },
    {
      name: 'hezhili.online-backend',
      script: './server.js',
      cwd: './backend',
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 3002
      }
    }
  ]
}
