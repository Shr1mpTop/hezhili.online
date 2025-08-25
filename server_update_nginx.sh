#!/bin/bash

echo "🔧 更新 nginx 配置以支持所有 API 路由"
echo "==========================================="

# 备份当前配置
echo "1️⃣ 备份当前 nginx 配置..."
sudo cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.backup.$(date +%Y%m%d_%H%M%S)

# 创建新的 nginx 配置
echo "2️⃣ 创建新的 nginx 配置..."
sudo tee /etc/nginx/sites-available/default > /dev/null << 'EOF'
# HTTP redirect to HTTPS
server {
    listen 80;
    server_name hezhili.online www.hezhili.online;
    return 301 https://$server_name$request_uri;
}

# HTTPS server
server {
    listen 443 ssl http2;
    server_name hezhili.online www.hezhili.online;

    # SSL configuration
    ssl_certificate /etc/letsencrypt/live/hezhili.online/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/hezhili.online/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # API routes - 所有后端 API 代理到 127.0.0.1:5000
    location /chat {
        proxy_pass http://127.0.0.1:5000/chat;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $server_name;
        
        # CORS 处理
        add_header Access-Control-Allow-Origin "https://hezhili.online, https://www.hezhili.online" always;
        add_header Access-Control-Allow-Methods "GET, POST, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With" always;
        
        # OPTIONS 预检请求处理
        if ($request_method = 'OPTIONS') {
            add_header Access-Control-Allow-Origin "https://hezhili.online, https://www.hezhili.online" always;
            add_header Access-Control-Allow-Methods "GET, POST, OPTIONS" always;
            add_header Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With" always;
            add_header Access-Control-Max-Age 86400;
            return 204;
        }
        
        # 超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    location /stats {
        proxy_pass http://127.0.0.1:5000/stats;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # CORS 处理
        add_header Access-Control-Allow-Origin "https://hezhili.online, https://www.hezhili.online" always;
        add_header Access-Control-Allow-Methods "GET, POST, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With" always;
    }

    location /sessions {
        proxy_pass http://127.0.0.1:5000/sessions;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # CORS 处理
        add_header Access-Control-Allow-Origin "https://hezhili.online, https://www.hezhili.online" always;
        add_header Access-Control-Allow-Methods "GET, POST, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With" always;
    }

    # 静态文件服务
    location / {
        root /root/hezhili-website/frontend/public;
        index index.html;
        try_files $uri $uri/ /index.html;
        
        # 缓存静态资源
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
        
        # HTML 文件不缓存
        location ~* \.html$ {
            expires -1;
            add_header Cache-Control "no-cache, no-store, must-revalidate";
        }
    }

    # 安全设置
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
}
EOF

echo "3️⃣ 测试 nginx 配置..."
sudo nginx -t
if [ $? -eq 0 ]; then
    echo "✅ nginx 配置测试通过"
else
    echo "❌ nginx 配置有错误，恢复备份..."
    sudo cp /etc/nginx/sites-available/default.backup.* /etc/nginx/sites-available/default
    exit 1
fi

echo "4️⃣ 重新加载 nginx..."
sudo systemctl reload nginx
if [ $? -eq 0 ]; then
    echo "✅ nginx 重新加载成功"
else
    echo "❌ nginx 重新加载失败"
    exit 1
fi

echo ""
echo "🎉 nginx 配置更新完成！"
echo "📋 现在所有 API 路由都代理到 127.0.0.1:5000"
echo "🔗 支持的路由: /chat, /stats, /sessions"
echo "📝 配置备份位置: /etc/nginx/sites-available/default.backup.*"
