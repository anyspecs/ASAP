# SSL证书配置指南(Free Plan)

## Cloudflare 生成

### 步骤1: Cloudflare账户设置
1. 注册/登录 [Cloudflare](https://cloudflare.com)
2. 添加域名例如 `hub.anyspecs.cn`（根据你的情况自行替换）
3. 选择免费计划 (Free Plan)

### 步骤2: DNS配置
将以下DNS记录添加到Cloudflare：
- 类型: A
- 名称: hub
- 内容: [您的服务器IP地址]
- 代理状态: 开启 (橙色云朵)

### 步骤3: SSL/TLS设置
1. 在Cloudflare控制台中，进入 "SSL/TLS" 部分
2. 加密模式选择: "Full (strict)" 或 "Full"
3. 边缘证书: 启用 "始终使用HTTPS"
4. 最低TLS版本: TLS 1.2

### 步骤4: 服务器配置
1. 生成Cloudflare Origin CA证书
2. 下载证书文件到新建文件夹 `./cloudflare` 下
- 手动更新nginx配置
- 或者直接执行 `./setup-cloudflare-ssl.sh` 然后 `./switch-to-cloudflare.sh` 重启即可。

## Let's Encrypt 生成

直接执行 `./setup-letsencrypt.sh` 即可

## 自签名(不推荐)

直接执行 `./setup-domain.sh`。