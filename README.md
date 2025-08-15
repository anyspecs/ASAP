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

## 部署方式

### Docker部署（推荐）
```bash
# 启动Redis容器
docker run -d --name redis-asap -p 6379:6379 redis:7-alpine

# 启动应用
docker run -d --name anyspecs \
  --restart always \
  -p 3000:3000 \
  -v /path/to/data:/data \
  -e REDIS_CONN_STRING=redis://host.docker.internal:6379 \
  anyspecs/asap:latest
```

### 手动部署
1. **克隆项目**
   ```bash
   git clone https://github.com/anyspecs/asap.git
   cd asap
   ```

2. **构建前端**
   ```bash
   cd web
   npm install
   export NODE_OPTIONS="--openssl-legacy-provider"
   npm run build
   cd ..
   ```

3. **构建后端**
   ```bash
   go mod download
   go build -o asap
   ```

4. **启动应用**
   ```bash
   ./asap --port 3000 --log-dir ./logs
   ```

5. **访问应用**
   打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 配置说明

### 环境变量
| 变量名 | 说明 | 示例 |
|--------|------|------|
| `REDIS_CONN_STRING` | Redis连接字符串 | `redis://localhost:6379` |
| `SESSION_SECRET` | 会话密钥 | `your-secret-key` |
| `SQL_DSN` | 数据库连接字符串 | `root:pass@tcp(localhost:3306)/db` |
| `UPLOAD_PATH` | 文件上传路径 | `./upload` |
| `PORT` | 服务端口 | `3000` |

### 命令行参数
```bash
./asap --port 3000 --log-dir ./logs
```

| 参数 | 说明 | 默认值 |
|------|------|--------|
| `--port` | 服务端口 | `3000` |
| `--log-dir` | 日志目录 | 不保存 |
| `--version` | 显示版本 | - |
| `--help` | 显示帮助 | - |

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
