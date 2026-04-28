module.exports = {
  apps: [
    {
      name: "hezhili.online-frontend",
      script: "npm run preview",
      cwd: "./frontend",
      watch: false,
      env: {
        NODE_ENV: "production",
        PORT: 5173,
      },
    },
    {
      name: "hezhili.online-backend",
      script: "uv run uvicorn backend.main:app --host 0.0.0.0 --port 8000",
      cwd: "./",
      watch: false,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
