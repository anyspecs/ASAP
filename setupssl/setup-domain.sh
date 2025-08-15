#!/bin/bash

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

DOMAIN="hub.anyspecs.cn"
SSL_DIR="../ssl"

echo -e "${GREEN}🔧 域名和SSL证书配置脚本${NC}"
echo -e "${YELLOW}域名: ${DOMAIN}${NC}"
echo ""

# 检查SSL证书
if [ -f "${SSL_DIR}/nginx.crt" ] && [ -f "${SSL_DIR}/nginx.key" ]; then
    echo -e "${GREEN}✅ SSL证书已存在${NC}"
    echo -e "${YELLOW}证书信息:${NC}"
    openssl x509 -in "${SSL_DIR}/nginx.crt" -text -noout | grep -E "(Subject:|Not After:)" | head -2
else
    echo -e "${RED}❌ SSL证书不存在，正在生成...${NC}"
    mkdir -p "${SSL_DIR}"
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout "${SSL_DIR}/nginx.key" \
        -out "${SSL_DIR}/nginx.crt" \
        -subj "/C=CN/ST=Beijing/L=Beijing/O=AnySpecs/OU=IT/CN=${DOMAIN}"
    echo -e "${GREEN}✅ SSL证书生成完成${NC}"
fi

echo ""

# 检查hosts文件
if grep -q "${DOMAIN}" /etc/hosts; then
    echo -e "${GREEN}✅ 本地hosts文件已配置${DOMAIN}${NC}"
else
    echo -e "${YELLOW}⚠️  本地hosts文件未配置${DOMAIN}${NC}"
    echo -e "${YELLOW}请手动添加: 127.0.0.1 ${DOMAIN}${NC}"
fi

echo ""

# 检查服务状态
echo -e "${YELLOW}📊 服务状态检查:${NC}"
if command -v docker-compose &> /dev/null; then
    docker-compose ps
else
    echo -e "${RED}❌ docker-compose 未安装${NC}"
fi

echo ""
echo -e "${GREEN}🌐 访问地址:${NC}"
echo -e "${YELLOW}HTTP:  http://${DOMAIN} (将重定向到HTTPS)${NC}"
echo -e "${YELLOW}HTTPS: https://${DOMAIN}${NC}"
echo -e "${YELLOW}后端API: http://127.0.0.1:3000${NC}"
echo ""
echo -e "${GREEN}📝 注意事项:${NC}"
echo -e "${YELLOW}1. 当前使用的是自签名证书，浏览器会显示安全警告${NC}"
echo -e "${YELLOW}2. 生产环境建议使用Let's Encrypt等权威CA的证书${NC}"
echo -e "${YELLOW}3. 确保域名DNS解析指向此服务器IP${NC}"
echo -e "${YELLOW}4. 如果使用云服务器，请确保安全组开放80和443端口${NC}"
