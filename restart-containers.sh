#!/bin/bash

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🔄 重启 ASAP 容器服务...${NC}"

# 重启服务
docker-compose restart

echo -e "${GREEN}✅ 服务已重启${NC}"
echo -e "${GREEN}🔍 查看状态: docker-compose ps${NC}"
echo -e "${GREEN}📊 查看日志: docker-compose logs -f${NC}"
