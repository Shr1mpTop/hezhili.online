PM2 启动说明

- 构建前端（可选，若要使用 `vite preview` 预览构建结果）：

```bash
cd frontend
npm install
npm run build
```

- 使用 `vite preview` 启动（ecosystem 配置，默认端口 5173）：

```bash
# 在项目根目录
pm2 start ecosystem.config.cjs
pm2 list
pm2 save
```

- 如果没有安装 pm2：

```bash
npm install -g pm2
# 或使用 npx
npx pm2 start ecosystem.config.cjs
```

- 查看日志：

```bash
pm2 logs frontend-preview
```

- 停止/删除进程：

```bash
pm2 stop frontend-preview
pm2 delete frontend-preview
```
