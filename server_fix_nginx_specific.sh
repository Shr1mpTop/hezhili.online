#!/bin/bash

echo "🔧 修复 /etc/nginx/ 目录下的端口配置"
echo "============================================"

NGINX_DIR="/etc/nginx"
BACKUP_DIR="/root/nginx_backup_$(date +%Y%m%d_%H%M%S)"

echo "1️⃣ 检查 nginx 目录结构..."
ls -la $NGINX_DIR/

echo -e "\n2️⃣ 查找包含端口5000的配置文件..."
echo "检查主要配置文件:"
for file in nginx.conf nginx.conf.bak nginx.conf.default; do
    filepath="$NGINX_DIR/$file"
    if [ -f "$filepath" ]; then
        echo "📁 检查文件: $file"
        if grep -n "5000" "$filepath" 2>/dev/null; then
            echo "  ❗ 找到端口5000配置"
        else
            echo "  ✅ 没有端口5000配置"
        fi
    else
        echo "📁 文件不存在: $file"
    fi
done

echo -e "\n3️⃣ 检查所有.conf文件..."
find $NGINX_DIR -name "*.conf" -type f | while read conffile; do
    echo "📁 检查: $conffile"
    if grep -n "5000" "$conffile" 2>/dev/null; then
        echo "  ❗ 包含端口5000:"
        grep -n "5000" "$conffile"
    fi
done

echo -e "\n4️⃣ 创建完整备份..."
mkdir -p "$BACKUP_DIR"
cp -r $NGINX_DIR/* "$BACKUP_DIR/"
echo "✅ 备份创建在: $BACKUP_DIR"

echo -e "\n5️⃣ 显示当前活动的nginx.conf内容..."
echo "当前 nginx.conf 的关键配置:"
grep -n -A5 -B5 "proxy_pass\|upstream\|server\|location" $NGINX_DIR/nginx.conf | head -50

echo -e "\n6️⃣ 开始修复端口配置..."
# 修复主配置文件
if [ -f "$NGINX_DIR/nginx.conf" ]; then
    echo "🔄 修复 nginx.conf..."
    sed -i.backup 's/127\.0\.0\.1:5000/127.0.0.1:5001/g' "$NGINX_DIR/nginx.conf"
    sed -i 's/localhost:5000/localhost:5001/g' "$NGINX_DIR/nginx.conf"
    echo "✅ nginx.conf 已修复"
fi

# 修复所有其他.conf文件
find $NGINX_DIR -name "*.conf" -type f | while read conffile; do
    if grep -q "5000" "$conffile" 2>/dev/null; then
        echo "🔄 修复 $conffile..."
        sed -i.backup 's/127\.0\.0\.1:5000/127.0.0.1:5001/g' "$conffile"
        sed -i 's/localhost:5000/localhost:5001/g' "$conffile"
        echo "✅ $conffile 已修复"
    fi
done

echo -e "\n7️⃣ 验证修复结果..."
echo "修复后的配置："
grep -n -A3 -B3 "5001\|proxy_pass" $NGINX_DIR/nginx.conf

echo -e "\n8️⃣ 测试nginx配置语法..."
nginx -t
if [ $? -eq 0 ]; then
    echo "✅ nginx 配置语法正确"
else
    echo "❌ nginx 配置语法错误，恢复备份..."
    cp "$BACKUP_DIR/nginx.conf" "$NGINX_DIR/nginx.conf"
    exit 1
fi

echo -e "\n9️⃣ 重启nginx服务..."
systemctl stop nginx
sleep 2
systemctl start nginx
sleep 3

if systemctl is-active --quiet nginx; then
    echo "✅ nginx 服务启动成功"
else
    echo "❌ nginx 服务启动失败"
    systemctl status nginx
fi

echo -e "\n🔟 最终验证..."
echo "检查nginx进程:"
ps aux | grep nginx | grep -v grep

echo -e "\n检查端口监听:"
netstat -tlnp | grep nginx

echo -e "\n测试后端连接:"
curl -s http://127.0.0.1:5001/stats | head -c 100

echo -e "\n测试nginx代理:"
curl -s -H "Host: hezhili.online" http://localhost/stats | head -c 100

echo -e "\n🎉 修复完成！"
echo -e "\n💡 建议测试步骤:"
echo "1. 访问你的网站聊天功能"
echo "2. 检查错误日志: tail -f /var/log/nginx/error.log"
echo "3. 如果还有问题，运行: systemctl restart nginx"

echo -e "\n📋 备份位置: $BACKUP_DIR"
