<p align="right">
   <strong>中文</strong> | <a href="./README.en.md">English</a>
</p>

# ASAP

> **A**ny**S**pecs **A**ll-in-one **P**latform

## 功能特性

### 用户认证与授权
- **多角色用户管理**：支持游客、普通用户、管理员、根用户四种角色
- **多种登录方式**：用户名密码、GitHub OAuth
- **邮箱验证**：支持邮箱注册验证和密码重置
- **安全认证**：基于JWT Token的API认证，支持会话管理
- **权限控制**：细粒度的文件上传下载权限控制

### 文件管理系统
- **文件上传下载**：支持多种文件类型，支持批量操作
- **文件权限管理**：基于用户角色的文件访问控制
- **文件预览**：支持图片、文档等多种格式预览
- **存储管理**：支持本地存储和云存储配置

### 安全与性能
- **请求频率限制**：基于Redis的API访问频率控制
- **CORS支持**：跨域资源共享配置
- **静态文件缓存**：优化的静态资源加载
- **日志系统**：完整的操作日志记录
- **Cloudflare Turnstile**：防机器人验证

### 用户界面
- **响应式设计**：完美支持桌面端和移动端
- **现代化UI**：基于Semantic UI React的优雅界面
- **实时通知**：Toast消息提示系统
- **多语言支持**：中英文界面切换

## 技术架构

### 后端技术栈
- **Web框架**：Gin (Go)
- **数据库**：SQLite (默认) / MySQL / PostgreSQL
- **缓存**：Redis
- **ORM**：GORM
- **认证**：JWT + Session
- **文件处理**：Go标准库

### 前端技术栈
- **框架**：React 18
- **UI组件**：Semantic UI React
- **路由**：React Router v6
- **状态管理**：React Context + Hooks
- **HTTP客户端**：Axios
- **构建工具**：Create React App

## 系统配置

### SMTP邮件配置
在系统设置中配置SMTP服务器，支持：
- QQ邮箱、Gmail、163邮箱等主流服务商
- 支持STARTTLS (587端口) 和SSL (465端口)
- 用于邮箱验证和密码重置

### GitHub OAuth配置
1. 在GitHub创建OAuth App
2. 设置回调URL：`http://yourdomain.com/oauth/github`
3. 在系统设置中填入Client ID和Secret

### 文件权限配置
- **游客权限**：可配置是否允许上传下载
- **用户权限**：基于角色的文件访问控制
- **管理员权限**：完整的文件管理权限

## 系统要求

### 最低配置
- **CPU**：1核心
- **内存**：512MB
- **存储**：1GB可用空间
- **操作系统**：Linux/macOS/Windows

### 推荐配置
- **CPU**：2核心以上
- **内存**：2GB以上
- **存储**：10GB以上可用空间
- **Redis**：用于缓存和会话存储

## 快速开始

### Docker（推荐）

```bash
# 1. 克隆项目
git clone https://github.com/anyspecs/asap.git
cd asap

# 2. 配置环境变量
cp env.example .env
# 编辑 .env 文件，设置必要的环境变量

# 3. 一键启动所有服务
docker-compose up -d

# 4. 查看服务状态
docker-compose ps

# 5. 访问应用
# 前端: http://localhost 或 https://localhost
# 后端API: http://localhost:3000
```

### 详细配置步骤

#### 1. 环境变量配置

根据 `env.config` 文件：

```bash
# Redis 配置
REDIS_PASSWORD=your_secure_password
REDIS_PORT=6380

# 应用配置
SESSION_SECRET=your_session_strong_password
UPLOAD_PATH=/data/upload
DB_PATH=/data/database

# 域名配置
DOMAIN=your-domain.com
ENABLE_TLS=true

# 默认管理员账户
DEFAULT_ROOT_USERNAME=admin
DEFAULT_ROOT_PASSWORD=your_admin_init_pwd
```

#### 2. SSL证书配置

详细见 `setupssl/ssl-setup.md`。

#### 3. 启动服务

```bash
# 构建并启动所有服务
docker-compose up -d --build

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f redis
```

#### 4. 服务管理

```bash
# 停止所有服务
docker-compose down

# 重启特定服务
docker-compose restart frontend
docker-compose restart backend

# 重新构建并启动
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# 查看资源使用
docker stats
```

### 端口配置

| 服务 | 端口 | 说明 |
|------|------|------|
| Frontend | 80/443 | HTTP/HTTPS访问端口 |
| Backend | 3000 | API服务端口（仅本地访问） |
| Redis | 6380 | 缓存服务端口（仅本地访问） |

### 数据持久化

```yaml
volumes:
  redis_data:      # Redis数据
  backend_data:    # 后端数据（数据库、上传文件）
  backend_logs:    # 后端日志
  frontend_logs:   # 前端日志
```

### 健康检查

```bash
# 检查服务健康状态
docker-compose ps

# 手动健康检查
curl -f http://localhost:3000/api/status
curl -f http://localhost/api/status

# 查看健康检查日志
docker-compose logs frontend | grep health
```

### 监控和维护

#### 日志管理
```bash
# 查看实时日志
docker-compose logs -f --tail=100

# 清理日志
docker system prune -f

# 日志轮转配置
# 在宿主机配置logrotate
```

#### 备份策略
```bash
# 备份数据
docker run --rm -v anyspecs_backend_data:/data -v $(pwd):/backup \
  alpine tar czf /backup/asap-backup-$(date +%Y%m%d).tar.gz /data

# 恢复数据
docker run --rm -v anyspecs_backend_data:/data -v $(pwd):/backup \
  alpine tar xzf /backup/asap-backup-20250101.tar.gz -C /data
```

### 生产环境部署

#### 安全配置
```bash
# 防火墙配置
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable

# 禁用root登录
# 配置SSH密钥认证
# 定期更新系统和Docker镜像
```

#### 高可用配置
```bash
# 使用Docker Swarm或Kubernetes
docker swarm init
docker stack deploy -c docker-compose.yml asap

# 负载均衡配置
# 数据库主从复制
# Redis集群配置
```

### 1. 下载并运行
```bash
# 下载最新版本
wget https://github.com/anyspecs/releases/latest/download/asap-linux-amd64 -O asap
chmod +x asap

# 启动应用
./asap --port 3000 --log-dir ./logs
```

### 2. 配置Redis（可选）
```bash
# 启动Redis
docker run -d --name redis-asap -p 6379:6379 redis:7-alpine

# 设置环境变量
export REDIS_CONN_STRING=redis://localhost:6379
./asap --port 3000 --log-dir ./logs
```

### 3. 访问管理界面
1. 访问 http://localhost:3000
2. 使用root账户登录
3. 进入系统设置配置SMTP、OAuth等

## 贡献指南

欢迎提交Issue和Pull Request！

## 许可证

本项目基于 [MIT License](LICENSE) 开源协议。