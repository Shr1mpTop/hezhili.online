#!/bin/bash

echo "🔧 强制修复 nginx 配置 (端口 5000 -> 5001)"
echo "============================================"

# 1. 查找所有可能的nginx配置文件
echo "1️⃣ 查找所有 nginx 配置文件..."
NGINX_CONFIGS=$(find /etc/nginx -name "*.conf" -type f 2>/dev/null)
echo "找到的配置文件:"
echo "$NGINX_CONFIGS"

# 2. 显示当前包含端口5000的配置
echo -e "\n2️⃣ 检查包含端口5000的配置..."
for config in $NGINX_CONFIGS; do
    if grep -q "5000" "$config" 2>/dev/null; then
        echo "📁 文件: $config"
        echo "内容:"
        grep -n "5000" "$config" 2>/dev/null
        echo "---"
    fi
done

# 3. 创建备份
echo -e "\n3️⃣ 创建配置备份..."
BACKUP_DIR="/root/nginx_backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
cp -r /etc/nginx/* "$BACKUP_DIR/"
echo "✅ 备份创建在: $BACKUP_DIR"

# 4. 强制替换所有5000为5001
echo -e "\n4️⃣ 强制替换所有端口配置..."
for config in $NGINX_CONFIGS; do
    if grep -q "5000" "$config" 2>/dev/null; then
        echo "🔄 修改文件: $config"
        # 创建临时文件进行替换
        sed 's/127\.0\.0\.1:5000/127.0.0.1:5001/g' "$config" > "${config}.tmp"
        mv "${config}.tmp" "$config"
        echo "✅ 已更新"
    fi
done

# 5. 显示修改后的配置
echo -e "\n5️⃣ 验证修改结果..."
for config in $NGINX_CONFIGS; do
    if grep -q "5001" "$config" 2>/dev/null; then
        echo "📁 文件: $config"
        echo "新配置:"
        grep -n "5001" "$config" 2>/dev/null
        echo "---"
    fi
done

# 6. 测试nginx配置
echo -e "\n6️⃣ 测试 nginx 配置语法..."
if nginx -t; then
    echo "✅ nginx 配置语法正确"
else
    echo "❌ nginx 配置有误，恢复备份..."
    cp -r "$BACKUP_DIR"/* /etc/nginx/
    echo "💡 备份已恢复，请检查配置文件"
    exit 1
fi

# 7. 重新加载nginx
echo -e "\n7️⃣ 重新加载 nginx..."
if systemctl reload nginx; then
    echo "✅ nginx 重新加载成功"
else
    echo "❌ nginx 重新加载失败"
fi

# 8. 验证修复
echo -e "\n8️⃣ 验证修复结果..."
echo "等待5秒让配置生效..."
sleep 5

echo "测试后端服务:"
if curl -s http://127.0.0.1:5001/stats > /dev/null; then
    echo "✅ 后端服务 (5001) 正常"
else
    echo "❌ 后端服务 (5001) 无响应"
fi

echo -e "\n测试通过nginx的API访问:"
if curl -s -H "Host: hezhili.online" http://127.0.0.1/stats > /dev/null; then
    echo "✅ nginx 代理正常"
else
    echo "❌ nginx 代理仍有问题"
fi

echo -e "\n🎉 强制修复完成！"
echo -e "\n📋 修复总结:"
echo "- 所有nginx配置文件已从端口5000更新为5001"
echo "- 原配置已备份到: $BACKUP_DIR"
echo "- nginx已重新加载"

echo -e "\n🔍 如果仍有问题，请运行以下命令检查:"
echo "1. 检查nginx进程: ps aux | grep nginx"
echo "2. 检查端口使用: netstat -tlnp | grep :5001"
echo "3. 重启nginx: sudo systemctl restart nginx"
echo "4. 查看实时日志: sudo tail -f /var/log/nginx/error.log"
