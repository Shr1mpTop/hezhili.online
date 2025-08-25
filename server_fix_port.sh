#!/bin/bash

echo "🔧 快速修复 nginx 代理端口 (5000 -> 5001)"
echo "============================================"

# 查找 nginx 配置文件
nginx_configs=(
    "/etc/nginx/sites-available/default"
    "/etc/nginx/nginx.conf"
    "/etc/nginx/conf.d/default.conf"
    "/root/hezhili-website/backend/config/nginx.conf"
)

echo "1️⃣ 查找并备份 nginx 配置文件..."
for config in "${nginx_configs[@]}"; do
    if [ -f "$config" ] && sudo grep -q "proxy_pass.*127.0.0.1:5000" "$config" 2>/dev/null; then
        echo "找到配置文件: $config"
        
        # 备份
        backup_file="${config}.backup.$(date +%Y%m%d_%H%M%S)"
        sudo cp "$config" "$backup_file"
        echo "备份到: $backup_file"
        
        # 显示当前配置
        echo "当前 proxy_pass 配置:"
        sudo grep -n "proxy_pass.*127.0.0.1" "$config"
        
        # 执行替换
        echo "更新端口 5000 -> 5001..."
        sudo sed -i 's/proxy_pass http:\/\/127\.0\.0\.1:5000/proxy_pass http:\/\/127.0.0.1:5001/g' "$config"
        
        # 显示更新后的配置
        echo "更新后的 proxy_pass 配置:"
        sudo grep -n "proxy_pass.*127.0.0.1" "$config"
        echo ""
    fi
done

echo "2️⃣ 测试 nginx 配置..."
sudo nginx -t
if [ $? -eq 0 ]; then
    echo "✅ nginx 配置测试通过"
else
    echo "❌ nginx 配置有错误"
    exit 1
fi

echo ""
echo "3️⃣ 重新加载 nginx..."
sudo systemctl reload nginx
if [ $? -eq 0 ]; then
    echo "✅ nginx 重新加载成功"
else
    echo "❌ nginx 重新加载失败"
    exit 1
fi

echo ""
echo "4️⃣ 验证修复结果..."
echo "测试本地后端连接 (端口 5001):"
if curl -s http://127.0.0.1:5001/stats > /dev/null; then
    echo "✅ 后端服务 (5001) 可访问"
else
    echo "❌ 后端服务 (5001) 不可访问"
    echo "请确保后端服务正在运行在端口 5001"
fi

echo ""
echo "测试外部 API 访问:"
sleep 2
if curl -s https://hezhili.online/stats > /dev/null; then
    echo "✅ 外部 API 访问正常"
    echo "🎉 修复完成！现在 nginx 代理到端口 5001"
else
    echo "⚠️ 外部 API 访问仍有问题"
    echo "可能需要等待几秒钟让 nginx 完全加载新配置"
fi

echo ""
echo "📋 修复总结:"
echo "- nginx 配置已更新为代理到端口 5001"
echo "- 配置文件已备份"
echo "- nginx 已重新加载"
echo ""
echo "🔍 如果仍有问题，请检查:"
echo "1. 后端服务是否在端口 5001 运行: curl http://127.0.0.1:5001/stats"
echo "2. nginx 错误日志: sudo tail -f /var/log/nginx/error.log"
echo "3. 后端服务日志: tail -f /var/log/hezhili-backend.log"
