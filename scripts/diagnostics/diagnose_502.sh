#!/bin/bash

echo "🔍 诊断线上502错误..."

echo ""
echo "📋 1. 检查Flask应用进程状态..."
ps aux | grep python | grep -v grep

echo ""
echo "📋 2. 检查端口监听状态..."
echo "检查端口5001:"
sudo lsof -iTCP -sTCP:LISTEN -P | grep 5001 || echo "端口5001未监听"

echo "检查端口5000:"
sudo lsof -iTCP -sTCP:LISTEN -P | grep 5000 || echo "端口5000未监听"

echo ""
echo "📋 3. 检查nginx进程状态..."
ps aux | grep nginx | grep -v grep
echo "nginx配置测试:"
sudo nginx -t

echo ""
echo "📋 4. 检查最近的nginx错误日志..."
echo "最近10条nginx错误日志:"
sudo tail -n 10 /var/log/nginx/error.log

echo ""
echo "📋 5. 检查Flask应用日志..."
if [ -f "/var/log/hezhili-backend.log" ]; then
    echo "最近10条Flask应用日志:"
    tail -n 10 /var/log/hezhili-backend.log
else
    echo "Flask应用日志文件不存在"
fi

echo ""
echo "📋 6. 测试后端连接..."
echo "测试本地5001端口连接:"
curl -s -w "HTTP状态码: %{http_code}\n" http://127.0.0.1:5001/ -o /tmp/backend_test.txt
echo "响应内容:"
cat /tmp/backend_test.txt

echo ""
echo "📋 7. 检查系统资源..."
echo "内存使用情况:"
free -h
echo "磁盘使用情况:"
df -h

echo ""
echo "📋 8. 检查防火墙状态..."
sudo iptables -L -n | head -10

echo ""
echo "🎯 诊断完成！请查看上述信息确定问题原因。"
