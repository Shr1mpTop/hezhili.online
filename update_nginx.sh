#!/bin/bash

# 更新nginx配置脚本

echo "🔧 更新nginx配置..."

# 备份当前配置
sudo cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.backup.$(date +%Y%m%d_%H%M%S)

# 复制新配置
sudo cp backend/config/nginx.conf /etc/nginx/nginx.conf

# 测试nginx配置
echo "测试nginx配置..."
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "✅ nginx配置测试通过"
    echo "重新加载nginx..."
    sudo nginx -s reload
    echo "✅ nginx配置更新完成"
    echo ""
    echo "新增的API路由："
    echo "  - /admin/login (管理员登录)"
    echo "  - /admin/* (其他管理功能)"
    echo ""
    echo "所有API现在都指向端口5001"
else
    echo "❌ nginx配置测试失败"
    echo "恢复备份配置..."
    sudo cp /etc/nginx/nginx.conf.backup.$(date +%Y%m%d_%H%M%S) /etc/nginx/nginx.conf
    exit 1
fi
