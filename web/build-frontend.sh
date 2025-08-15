#!/bin/bash

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🏗️ 构建前端应用...${NC}"

# 检查Node.js版本
NODE_VERSION=$(node --version)
echo -e "${YELLOW}Node.js 版本: $NODE_VERSION${NC}"

# 安装依赖
echo -e "${YELLOW}📦 安装依赖...${NC}"
npm ci

# 构建应用
echo -e "${YELLOW}🔨 构建应用...${NC}"
export NODE_OPTIONS="--openssl-legacy-provider"
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ 前端构建成功！${NC}"
    echo -e "${GREEN}📁 构建产物位置: ./build${NC}"
else
    echo -e "${RED}❌ 前端构建失败！${NC}"
    exit 1
fi
