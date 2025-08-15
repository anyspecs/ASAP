#!/bin/bash

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

DOMAIN="hub.anyspecs.cn"
EMAIL="admin@anyspecs.cn"  # 请修改为您的邮箱

echo -e "${GREEN}🔐 Let's Encrypt免费SSL证书配置脚本${NC}"
echo -e "${YELLOW}域名: ${DOMAIN}${NC}"
echo -e "${YELLOW}邮箱: ${EMAIL}${NC}"
echo ""

# 检查certbot是否安装
if ! command -v certbot &> /dev/null; then
    echo -e "${YELLOW}📦 安装certbot...${NC}"
    apt update
    apt install -y certbot
    echo -e "${GREEN}✅ certbot安装完成${NC}"
else
    echo -e "${GREEN}✅ certbot已安装${NC}"
fi

echo ""

# 检查域名解析
echo -e "${BLUE}📋 检查域名解析${NC}"
echo -e "${YELLOW}请确保域名 ${DOMAIN} 已正确解析到此服务器IP${NC}"
echo -e "${YELLOW}当前服务器IP: $(curl -s ifconfig.me)${NC}"
echo ""

# 生成证书
echo -e "${BLUE}📋 生成Let's Encrypt证书${NC}"
echo -e "${YELLOW}注意: 需要确保80端口可访问，用于域名验证${NC}"
echo ""

read -p "是否继续生成证书? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}🔐 正在生成证书...${NC}"
    
    # 停止nginx服务以释放80端口
    if systemctl is-active --quiet nginx; then
        echo -e "${YELLOW}🔄 停止nginx服务...${NC}"
        systemctl stop nginx
    fi
    
    # 生成证书
    certbot certonly --standalone -d ${DOMAIN} --email ${EMAIL} --agree-tos --non-interactive
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ 证书生成成功！${NC}"
        
        # 复制证书到项目目录
        cp /etc/letsencrypt/live/${DOMAIN}/fullchain.pem ../ssl/nginx.crt
        cp /etc/letsencrypt/live/${DOMAIN}/privkey.pem ../ssl/nginx.key
        
        # 设置权限
        chmod 644 ../ssl/nginx.crt
        chmod 600 ../ssl/nginx.key
        
        echo -e "${GREEN}✅ 证书已复制到项目目录${NC}"
        echo -e "${YELLOW}🔄 需要重启Docker服务以应用新证书${NC}"
        echo -e "${YELLOW}运行: docker-compose restart frontend${NC}"
        
    else
        echo -e "${RED}❌ 证书生成失败${NC}"
        echo -e "${YELLOW}请检查域名解析和网络连接${NC}"
    fi
else
    echo -e "${YELLOW}取消证书生成${NC}"
fi

echo ""
echo -e "${BLUE}📝 Let's Encrypt证书特点:${NC}"
echo -e "${YELLOW}- 完全免费${NC}"
echo -e "${YELLOW}- 浏览器完全信任${NC}"
echo -e "${YELLOW}- 90天有效期，自动续期${NC}"
echo -e "${YELLOW}- 需要域名正确解析${NC}"
echo -e "${YELLOW}- 需要80端口可访问${NC}"
