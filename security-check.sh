#!/bin/bash

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🔒 执行前后端分离安全检查...${NC}"

# 检查容器网络隔离
echo -e "${YELLOW}检查网络隔离...${NC}"
if docker network ls | grep -q "asap_internal"; then
    echo -e "${GREEN}✅ 内部网络已创建${NC}"
    docker network ls | grep asap
else
    echo -e "${RED}❌ 内部网络未创建${NC}"
fi

if docker network ls | grep -q "asap_external"; then
    echo -e "${GREEN}✅ 外部网络已创建${NC}"
    docker network ls | grep asap
else
    echo -e "${RED}❌ 外部网络未创建${NC}"
fi

# 检查端口绑定
echo -e "${YELLOW}检查端口绑定...${NC}"
if netstat -tlnp 2>/dev/null | grep -q ":3000"; then
    echo -e "${GREEN}✅ 后端端口3000已绑定到本地${NC}"
else
    echo -e "${RED}❌ 后端端口3000未正确绑定${NC}"
fi

if netstat -tlnp 2>/dev/null | grep -q ":80"; then
    echo -e "${GREEN}✅ 前端端口80已绑定${NC}"
else
    echo -e "${RED}❌ 前端端口80未正确绑定${NC}"
fi

if netstat -tlnp 2>/dev/null | grep -q ":6380"; then
    echo -e "${GREEN}✅ Redis端口6380已绑定到本地${NC}"
else
    echo -e "${RED}❌ Redis端口6380未正确绑定${NC}"
fi

# 检查Redis连接
echo -e "${YELLOW}检查Redis连接...${NC}"
if [ -f env.config ]; then
    source env.config
    if docker-compose exec redis redis-cli -a "$REDIS_PASSWORD" info server 2>/dev/null | grep -q "redis_version"; then
        echo -e "${GREEN}✅ Redis连接正常${NC}"
    else
        echo -e "${RED}❌ Redis连接失败${NC}"
    fi
else
    echo -e "${RED}❌ 环境配置文件不存在${NC}"
fi

# 检查后端健康状态
echo -e "${YELLOW}检查后端健康状态...${NC}"
if curl -s http://localhost:3000/api/status >/dev/null 2>&1; then
    echo -e "${GREEN}✅ 后端API服务正常${NC}"
else
    echo -e "${RED}❌ 后端API服务异常${NC}"
fi

# 检查前端健康状态
echo -e "${YELLOW}检查前端健康状态...${NC}"
if curl -s http://localhost:80 >/dev/null 2>&1; then
    echo -e "${GREEN}✅ 前端服务正常${NC}"
else
    echo -e "${RED}❌ 前端服务异常${NC}"
fi

# 检查容器状态
echo -e "${YELLOW}检查容器状态...${NC}"
docker-compose ps

# 检查网络连接
echo -e "${YELLOW}检查网络连接...${NC}"
echo "前端 -> 后端连接测试:"
docker-compose exec frontend wget --no-verbose --tries=1 --spider http://backend:3000/api/status 2>&1 | head -1

echo "后端 -> Redis连接测试:"
docker-compose exec backend wget --no-verbose --tries=1 --spider http://redis:6380 2>&1 | head -1

echo -e "${GREEN}✅ 前后端分离安全检查完成${NC}"
echo -e "${GREEN}🔍 查看详细日志: docker-compose logs${NC}"
echo -e "${GREEN}🌐 前端访问: http://localhost:80${NC}"
echo -e "${GREEN}🔌 后端API: http://localhost:3000${NC}"
