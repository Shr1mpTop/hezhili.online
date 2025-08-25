# 服务器 502 错误修复指南

## 🚨 问题描述
在生产环境中，聊天功能报错 `502 Bad Gateway`，具体位置在 `main.js:282` 的 POST 请求到 `/chat` 端点。

**重要：你的后端服务配置为监听端口 5001，nginx 需要代理到正确的端口。**

## 🔍 快速诊断步骤

### 1. 上传并运行诊断脚本
```bash
# 在服务器上运行
cd /root/hezhili-website
chmod +x server_diagnose_502.sh
./server_diagnose_502.sh
```

### 2. 根据诊断结果选择修复方案

#### 方案 A: 快速端口修复 (推荐先试)
```bash
chmod +x server_fix_port.sh
./server_fix_port.sh
```

#### 方案 B: 完整服务重启
```bash
chmod +x server_fix_502.sh
./server_fix_502.sh
```

#### 方案 C: 完整 nginx 配置更新
```bash
chmod +x server_update_nginx.sh
./server_update_nginx.sh
```

## 🔧 手动排查步骤

### 1. 检查后端服务状态
```bash
# 查看后端进程
ps aux | grep -E '(app\.py|gunicorn)' | grep -v grep

# 查看端口监听
sudo ss -ltnp | grep -E ':(5000|5001)'
```

### 2. 测试本地后端连接
```bash
# 测试 GET 请求 (主要端口)
curl -v http://127.0.0.1:5001/stats

# 测试 POST 请求 (关键)
curl -v -H "Content-Type: application/json" \
  -d '{"text":"test","session_id":null}' \
  http://127.0.0.1:5001/chat
```

### 3. 检查 nginx 日志
```bash
# 查看错误日志
sudo tail -f /var/log/nginx/error.log

# 查看访问日志
sudo tail -f /var/log/nginx/access.log
```

### 4. 检查 nginx 配置
```bash
# 查看 proxy_pass 配置
sudo grep -r "proxy_pass" /etc/nginx/

# 测试配置
sudo nginx -t
```

## 🎯 常见问题及解决方案

### 问题 1: 后端服务未运行
**症状**: `curl: (7) Failed to connect`
**解决**: 
```bash
cd /root/hezhili-website/backend/api
export ARK_API_KEY="6b7a963f-0952-4338-8e3e-29460040f0bf"
nohup python3 app.py > /var/log/hezhili-backend.log 2>&1 &
```

### 问题 2: 端口不匹配 (最可能的原因)
**症状**: nginx 代理到 5000，但后端监听 5001
**解决**: 
```bash
# 快速修复端口配置
./server_fix_port.sh

# 或手动修改
sudo sed -i 's/127.0.0.1:5000/127.0.0.1:5001/g' /etc/nginx/sites-available/default
sudo nginx -t && sudo systemctl reload nginx
```

### 问题 3: CORS 问题
**症状**: OPTIONS 请求失败
**解决**: 确保 nginx 配置包含完整的 CORS 头部

### 问题 4: API 密钥未配置
**症状**: 后端返回错误响应
**解决**: 设置正确的环境变量

## 📋 完整修复检查清单

- [ ] 后端服务正在运行
- [ ] 后端监听正确端口 (5001)
- [ ] 本地 curl 测试返回 JSON
- [ ] nginx 配置 proxy_pass 指向正确端口 (127.0.0.1:5001)
- [ ] nginx 配置包含所有 API 路由 (/chat, /stats, /sessions)
- [ ] nginx 配置包含 CORS 头部
- [ ] nginx 配置测试通过 (`nginx -t`)
- [ ] nginx 已重新加载
- [ ] 外部测试返回正确响应

## 🚀 生产环境最佳实践

### 使用 systemd 管理后端服务
创建 `/etc/systemd/system/hezhili-backend.service`:
```ini
[Unit]
Description=Hezhili Backend API
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/root/hezhili-website/backend/api
Environment=ARK_API_KEY=6b7a963f-0952-4338-8e3e-29460040f0bf
Environment=FLASK_ENV=production
ExecStart=/usr/bin/python3 app.py
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
```

启用服务:
```bash
sudo systemctl daemon-reload
sudo systemctl enable hezhili-backend
sudo systemctl start hezhili-backend
```

### 使用 gunicorn (更稳定)
```bash
pip3 install gunicorn
cd /root/hezhili-website/backend/api
gunicorn -w 4 -b 127.0.0.1:5001 app:app \
  --access-logfile /var/log/hezhili-access.log \
  --error-logfile /var/log/hezhili-error.log \
  --daemon
```

## 📞 紧急联系信息
如果以上步骤都无法解决，请提供:
1. 诊断脚本的完整输出
2. nginx 错误日志的最后 50 行
3. 后端日志的最后 50 行
4. curl 测试的详细输出
