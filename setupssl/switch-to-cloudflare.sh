#!/bin/bash

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}🔄 切换到Cloudflare配置${NC}"
echo ""

# 备份当前配置
if [ -f "web/nginx.conf" ]; then
    cp "web/nginx.conf" "web/nginx.conf.backup"
    echo -e "${YELLOW}📋 已备份当前nginx配置${NC}"
fi

# 检查当前配置是否已经是Cloudflare配置
if grep -q "Cloudflare" "web/nginx.conf"; then
    echo -e "${GREEN}✅ 当前配置已经是Cloudflare配置${NC}"
else
    echo -e "${YELLOW}⚠️  当前配置不是Cloudflare配置${NC}"
    echo -e "${YELLOW}请手动更新web/nginx.conf文件以支持Cloudflare${NC}"
fi

# 检查Cloudflare证书
if [ -f "../ssl/nginx.crt" ] && [ -f "../ssl/nginx.key" ]; then
    echo -e "${GREEN}✅ SSL证书文件存在${NC}"
    
    # 验证证书
    echo -e "${YELLOW}🔍 证书信息:${NC}"
    openssl x509 -in "../ssl/nginx.crt" -text -noout | grep -E "(Subject:|Not After:|Issuer:)" | head -3
    
    echo ""
    echo -e "${GREEN}🔄 需要重新构建前端镜像以应用新配置${NC}"
    echo -e "${YELLOW}运行命令: docker-compose build frontend && docker-compose up -d${NC}"
    
else
    echo -e "${RED}❌ SSL证书文件不存在${NC}"
    echo -e "${YELLOW}请先运行: ./setup-cloudflare-ssl.sh${NC}"
fi

echo ""
echo -e "${BLUE}🌐 Cloudflare配置特性:${NC}"
echo -e "${YELLOW}- 支持Cloudflare真实IP获取${NC}"
echo -e "${YELLOW}- 优化的安全头配置${NC}"
echo -e "${YELLOW}- 支持HTTP/2和现代加密${NC}"
echo -e "${YELLOW}- 优化的缓存策略${NC}"
