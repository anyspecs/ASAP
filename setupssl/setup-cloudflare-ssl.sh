#!/bin/bash

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

DOMAIN="hub.anyspecs.cn"
SSL_DIR="../ssl"
CLOUDFLARE_DIR="./cloudflare"

echo -e "${GREEN}🔐 Cloudflare Origin CA证书配置脚本${NC}"
echo -e "${YELLOW}域名: ${DOMAIN}${NC}"
echo ""

# 创建Cloudflare目录
mkdir -p "${CLOUDFLARE_DIR}"

echo -e "${BLUE}📋 配置步骤说明:${NC}"
echo -e "${YELLOW}1. 登录Cloudflare控制台${NC}"
echo -e "${YELLOW}2. 进入 'SSL/TLS' > 'Origin Server'${NC}"
echo -e "${YELLOW}3. 点击 'Create Certificate'${NC}"
echo -e "${YELLOW}4. 选择 '15 years' 有效期${NC}"
echo -e "${YELLOW}5. 添加域名: ${DOMAIN}${NC}"
echo -e "${YELLOW}6. 下载证书文件${NC}"
echo ""

echo -e "${BLUE}📁 请将以下文件放入 ${CLOUDFLARE_DIR} 目录:${NC}"
echo -e "${YELLOW}- ${DOMAIN}.pem (证书文件)${NC}"
echo -e "${YELLOW}- ${DOMAIN}.key (私钥文件)${NC}"
echo ""

# 检查证书文件
if [ -f "${CLOUDFLARE_DIR}/${DOMAIN}.pem" ] && [ -f "${CLOUDFLARE_DIR}/${DOMAIN}.key" ]; then
    echo -e "${GREEN}✅ Cloudflare证书文件已存在${NC}"
    
    # 备份当前证书
    if [ -f "${SSL_DIR}/nginx.crt" ]; then
        cp "${SSL_DIR}/nginx.crt" "${SSL_DIR}/nginx.crt.backup"
        echo -e "${YELLOW}📋 已备份当前自签名证书${NC}"
    fi
    
    # 复制Cloudflare证书
    cp "${CLOUDFLARE_DIR}/${DOMAIN}.pem" "${SSL_DIR}/nginx.crt"
    cp "${CLOUDFLARE_DIR}/${DOMAIN}.key" "${SSL_DIR}/nginx.key"
    
    echo -e "${GREEN}✅ Cloudflare证书已安装${NC}"
    
    # 设置权限
    chmod 600 "${SSL_DIR}/nginx.key"
    chmod 644 "${SSL_DIR}/nginx.crt"
    
    # 验证证书
    echo -e "${YELLOW}🔍 证书信息:${NC}"
    openssl x509 -in "${SSL_DIR}/nginx.crt" -text -noout | grep -E "(Subject:|Not After:|Issuer:)" | head -3
    
    echo ""
    echo -e "${GREEN}🔄 需要重启Docker服务以应用新证书${NC}"
    echo -e "${YELLOW}运行命令: docker-compose restart frontend${NC}"
    
else
    echo -e "${RED}❌ Cloudflare证书文件不存在${NC}"
    echo -e "${YELLOW}请按照上述步骤获取证书文件${NC}"
    echo ""
    echo -e "${BLUE}📝 手动配置说明:${NC}"
    echo -e "${YELLOW}1. 将 ${DOMAIN}.pem 重命名为 nginx.crt${NC}"
    echo -e "${YELLOW}2. 将 ${DOMAIN}.key 重命名为 nginx.key${NC}"
    echo -e "${YELLOW}3. 放入 ${SSL_DIR} 目录${NC}"
    echo -e "${YELLOW}4. 重启前端服务${NC}"
fi

echo ""
echo -e "${BLUE}🌐 Cloudflare配置完成后:${NC}"
echo -e "${YELLOW}- 域名将通过Cloudflare代理${NC}"
echo -e "${YELLOW}- 自动获得免费SSL证书${NC}"
echo -e "${YELLOW}- 支持HTTP/3和现代加密${NC}"
echo -e "${YELLOW}- 获得CDN加速和DDoS防护${NC}"
