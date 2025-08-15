#!/bin/bash

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🛑 停止 ASAP 容器服务...${NC}"

# 停止服务
docker-compose down

echo -e "${GREEN}✅ 服务已停止${NC}"
echo -e "${GREEN}🚀 重新启动: ./start-containers.sh${NC}"
