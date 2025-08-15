#!/bin/bash
# 避免服务器反复输入命令
docker-compose down

echo -e "${GREEN}✅ 服务已停止${NC}"
echo -e "${GREEN}🚀 重新启动: ./start-containers.sh${NC}"
