#!/bin/bash

# 何致力网站备份脚本
# 功能：自动备份数据库和重要配置文件

# 配置
WEBSITE_DIR="/root/hezhili-website"
BACKUP_DIR="$WEBSITE_DIR/backups"
DB_FILE="$WEBSITE_DIR/backend/data/chat_records.db"
RETENTION_DAYS=7

# 创建备份目录
mkdir -p "$BACKUP_DIR"

# 生成时间戳
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "=== 何致力网站备份 - $(date) ==="

# 备份数据库
if [ -f "$DB_FILE" ]; then
    echo "正在备份数据库..."
    cp "$DB_FILE" "$BACKUP_DIR/chat_records_$TIMESTAMP.db"
    
    # 创建SQL转储文件
    sqlite3 "$DB_FILE" .dump > "$BACKUP_DIR/backup_$TIMESTAMP.sql"
    
    echo "✓ 数据库备份完成: chat_records_$TIMESTAMP.db"
    echo "✓ SQL转储完成: backup_$TIMESTAMP.sql"
else
    echo "✗ 数据库文件不存在: $DB_FILE"
fi

# 备份配置文件
echo "正在备份配置文件..."
tar -czf "$BACKUP_DIR/config_$TIMESTAMP.tar.gz" \
    -C "$WEBSITE_DIR" \
    backend/config/ \
    backend/start.sh \
    backend/diagnose.sh \
    MAINTENANCE_GUIDE.md \
    2>/dev/null

echo "✓ 配置文件备份完成: config_$TIMESTAMP.tar.gz"

# 清理旧备份
echo "正在清理旧备份文件..."
find "$BACKUP_DIR" -name "chat_records_*.db" -mtime +$RETENTION_DAYS -delete
find "$BACKUP_DIR" -name "backup_*.sql" -mtime +$RETENTION_DAYS -delete
find "$BACKUP_DIR" -name "config_*.tar.gz" -mtime +$RETENTION_DAYS -delete

echo "✓ 已清理超过 $RETENTION_DAYS 天的旧备份"

# 显示备份统计
echo ""
echo "=== 备份统计 ==="
echo "备份目录: $BACKUP_DIR"
echo "当前备份文件数量:"
ls -la "$BACKUP_DIR" | grep -E "\.(db|sql|tar\.gz)$" | wc -l
echo "备份目录大小: $(du -sh "$BACKUP_DIR" | cut -f1)"

echo ""
echo "=== 备份完成 - $(date) ==="
