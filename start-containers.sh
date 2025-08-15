#!/bin/bash

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 启动 ASAP 前后端分离容器服务...${NC}"

# 检查环境变量文件
if [ ! -f env.config ]; then
    echo -e "${RED}❌ 错误: env.config 文件不存在${NC}"
    echo "请配置 env.config 文件中的环境变量"
    exit 1
fi

# 加载环境变量
source env.config

# 检查必要的环境变量
if [ -z "$REDIS_PASSWORD" ] || [ -z "$SESSION_SECRET" ]; then
    echo -e "${RED}❌ 错误: 请设置 REDIS_PASSWORD 和 SESSION_SECRET${NC}"
    exit 1
fi

# 创建必要的目录
echo -e "${YELLOW}📁 创建必要的目录...${NC}"
mkdir -p uploads
mkdir -p logs

# 设置环境变量
export REDIS_PASSWORD
export SESSION_SECRET
export DEFAULT_ROOT_USERNAME
export DEFAULT_ROOT_PASSWORD

# 构建前端（如果需要）
echo -e "${YELLOW}🏗️ 检查前端构建...${NC}"
if [ ! -d "web/build" ] || [ "$1" = "--rebuild" ]; then
    echo -e "${YELLOW}🔨 构建前端应用...${NC}"
    cd web
    chmod +x build-frontend.sh
    ./build-frontend.sh
    cd ..
fi

# 启动服务
echo -e "${YELLOW}🐳 启动 Docker 容器...${NC}"
# 确保环境变量被正确传递
export REDIS_PASSWORD
export SESSION_SECRET
export DEFAULT_ROOT_USERNAME
export DEFAULT_ROOT_PASSWORD
docker-compose up -d

# 等待服务启动
echo -e "${YELLOW}⏳ 等待服务启动...${NC}"
sleep 15

# 检查服务状态
echo -e "${YELLOW}🔍 检查服务状态...${NC}"
docker-compose ps

# 检查健康状态
echo -e "${YELLOW}💚 检查健康状态...${NC}"
if docker-compose exec redis redis-cli -h 127.0.0.1 -p 6380 -a "$REDIS_PASSWORD" ping 2>/dev/null | grep -q "PONG"; then
    echo -e "${GREEN}✅ Redis 连接正常${NC}"
else
    echo -e "${RED}❌ Redis 连接失败${NC}"
fi

if curl -s http://localhost:3000/api/status >/dev/null 2>&1; then
    echo -e "${GREEN}✅ 后端API服务正常${NC}"
else
    echo -e "${RED}❌ 后端API服务异常${NC}"
fi

if curl -s http://localhost:80 >/dev/null 2>&1; then
    echo -e "${GREEN}✅ 前端服务正常${NC}"
else
    echo -e "${RED}❌ 前端服务异常${NC}"
fi

echo -e "${GREEN}✅ 前后端分离服务启动完成！${NC}"
echo -e "${GREEN}🌐 前端地址: http://localhost:80${NC}"
echo -e "${GREEN}🔌 后端API: http://localhost:3000${NC}"
echo -e "${GREEN}📊 状态检查: http://localhost:3000/api/status${NC}"
echo -e "${GREEN}🔍 查看日志: docker-compose logs -f${NC}"
echo -e "${GREEN}🛑 停止服务: docker-compose down${NC}"
echo -e "${GREEN}🔄 重新构建前端: ./start-containers.sh --rebuild${NC}"
