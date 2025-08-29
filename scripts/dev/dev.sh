#!/bin/bash

# 统一开发环境管理脚本
# 用法: ./scripts/dev/dev.sh [start|stop|restart|status]

set -e

SCRIPT_DIR="$(cd "$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查进程是否在运行
check_process() {
    local port=$1
    lsof -i:$port > /dev/null 2>&1
    return $?
}

# 获取进程ID
get_pid() {
    local port=$1
    lsof -ti:$port 2>/dev/null || echo ""
}

# 启动后端服务
start_backend() {
    log_info "启动后端API服务 (端口5001)..."

    if check_process 5001; then
        log_warning "端口5001已被占用，正在停止现有进程..."
        pkill -f "python3.*app.py" || true
        sleep 2
    fi

    cd "$PROJECT_ROOT"
    export ARK_API_KEY="${ARK_API_KEY:-6b7a963f-0952-4338-8e3e-29460040f0bf}"
    export FLASK_DEBUG=1

    log_info "启动Flask应用..."
    cd "$PROJECT_ROOT/backend/api"
    nohup python3 app.py > "$PROJECT_ROOT/backend.log" 2>&1 &
    echo $! > "$PROJECT_ROOT/backend.pid"
    cd "$PROJECT_ROOT"

    sleep 3
    if check_process 5001; then
        log_success "后端服务启动成功 - http://localhost:5001"
        return 0
    else
        log_error "后端服务启动失败，检查 backend.log"
        cat backend.log
        return 1
    fi
}

# 启动前端服务
start_frontend() {
    log_info "启动前端HTTP服务 (端口8080)..."

    if check_process 8080; then
        log_warning "端口8080已被占用，正在停止现有进程..."
        pkill -f "start_frontend.py" || true
        sleep 2
    fi

    log_info "启动前端服务器..."
    cd "$PROJECT_ROOT"
    nohup python3 "$PROJECT_ROOT/start_frontend.py" > "$PROJECT_ROOT/frontend.log" 2>&1 &
    echo $! > "$PROJECT_ROOT/frontend.pid"

    sleep 2
    if check_process 8080; then
        log_success "前端服务启动成功 - http://localhost:8080"
        return 0
    else
        log_error "前端服务启动失败，检查 frontend.log"
        cat frontend.log
        return 1
    fi
}

# 停止服务
stop_services() {
    log_info "停止所有服务..."

    # 停止后端
    if [ -f "$PROJECT_ROOT/backend.pid" ]; then
        local backend_pid=$(cat "$PROJECT_ROOT/backend.pid")
        if kill -0 $backend_pid 2>/dev/null; then
            log_info "停止后端服务 (PID: $backend_pid)"
            kill $backend_pid
            sleep 2
        fi
        rm -f "$PROJECT_ROOT/backend.pid"
    fi

    # 停止前端
    if [ -f "$PROJECT_ROOT/frontend.pid" ]; then
        local frontend_pid=$(cat "$PROJECT_ROOT/frontend.pid")
        if kill -0 $frontend_pid 2>/dev/null; then
            log_info "停止前端服务 (PID: $frontend_pid)"
            kill $frontend_pid
            sleep 2
        fi
        rm -f "$PROJECT_ROOT/frontend.pid"
    fi

    # 清理可能残留的进程
    pkill -f "python3.*app.py" || true
    pkill -f "start_frontend.py" || true

    log_success "所有服务已停止"
}

# 检查服务状态
check_status() {
    log_info "检查服务状态..."

    # 检查后端
    if check_process 5001; then
        local backend_pid=$(get_pid 5001)
        log_success "后端服务运行中 (PID: $backend_pid) - http://localhost:5001"
    else
        log_warning "后端服务未运行"
    fi

    # 检查前端
    if check_process 8080; then
        local frontend_pid=$(get_pid 8080)
        log_success "前端服务运行中 (PID: $frontend_pid) - http://localhost:8080"
    else
        log_warning "前端服务未运行"
    fi
}

# 测试API
test_api() {
    log_info "测试API端点..."

    # 测试统计API
    log_info "测试 /stats ..."
    if curl -s http://localhost:5001/stats | grep -q "unique_visitors"; then
        log_success "/stats API正常"
    else
        log_error "/stats API失败"
        curl -v http://localhost:5001/stats
        return 1
    fi
}

# 显示帮助
show_help() {
    echo "开发环境管理脚本"
    echo ""
    echo "用法:"
    echo "  $0 [command]"
    echo ""
    echo "可用命令:"
    echo "  start     启动所有服务"
    echo "  stop      停止所有服务"
    echo "  restart   重启所有服务"
    echo "  status    查看服务状态"
    echo "  test      测试API"
    echo "  help      显示此帮助信息"
    echo ""
    echo "示例:"
    echo "  $0 start    # 启动开发环境"
    echo "  $0 stop     # 停止所有服务"
    echo "  $0 restart  # 重启所有服务"
}

# 主函数
main() {
    local command=${1:-help}

    case $command in
        start)
            start_backend
            if [ $? -eq 0 ]; then
                start_frontend
                if [ $? -eq 0 ]; then
                    test_api
                    echo ""
                    log_success "开发环境启动完成！"
                    echo "   后端API: http://localhost:5001"
                    echo "   前端页面: http://localhost:8080"
                    echo "   管理页面: http://localhost:8080/pages/admin.html"
                    echo ""
                    echo "   停止服务: $0 stop"
                    echo "   查看日志: tail -f backend.log frontend.log"
                fi
            fi
            ;;
        stop)
            stop_services
            ;;
        restart)
            stop_services
            sleep 2
            main start
            ;;
        status)
            check_status
            ;;
        test)
            test_api
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            log_error "未知命令: $command"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

main "$@"
