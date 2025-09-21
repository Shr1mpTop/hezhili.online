PM2 启动说明

- 构建前端（可选，若要使用 `vite preview` 预览构建结果）：

```bash
cd frontend
npm install
npm run build
```

- 启动后端（确保 MongoDB 运行）：

```bash
cd backend
npm install
```

- 使用 PM2 启动前后端（ecosystem 配置，前端默认端口 5173，后端端口 3001）：

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
pm2 logs hezhili.online-frontend
pm2 logs hezhili.online-backend
```

- 停止/删除进程：

```bash
pm2 stop hezhili.online-frontend
pm2 stop hezhili.online-backend
pm2 delete hezhili.online-frontend
pm2 delete hezhili.online-backend
```

- 一键部署脚本：

```bash
./deploy_pm2.sh
```
