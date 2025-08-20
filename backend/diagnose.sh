#!/bin/bash

echo "=== 诊断聊天API服务状态 ==="
echo

echo "1. 检查Python Flask进程:"
ps aux | grep "python.*app.py" | grep -v grep
echo

echo "2. 检查5000端口是否被占用:"
netstat -tlnp | grep :5000 || echo "端口5000未被占用"
echo

echo "3. 检查API服务是否响应 (本地):"
curl -s http://127.0.0.1:5000/stats || echo "本地API无响应"
echo

echo "4. 检查nginx状态:"
nginx -t
echo

echo "5. 检查nginx是否运行:"
ps aux | grep nginx | grep -v grep
echo

echo "6. 测试API路由 (通过nginx):"
curl -s -I https://hezhili.online/stats || echo "通过nginx的API无响应"
echo

echo "7. 检查logs目录下的日志文件:"
ls -la ../logs/ 2>/dev/null || echo "logs目录不存在"
echo

echo "8. 检查最近的Flask日志 (如果存在):"
if [ -f "../logs/flask.log" ]; then
    echo "最后20行日志:"
    tail -20 ../logs/flask.log
else
    echo "flask.log文件不存在"
fi
echo

echo "=== 诊断完成 ==="
