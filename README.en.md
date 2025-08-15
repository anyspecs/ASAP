<p align="right">
    <a href="./README.md">中文</a> | <strong>English</strong>
</p>

# ASAP

> **A**ny**S**pecs **A**ll-in-one **P**latform

## Features

### User Authentication & Authorization
- **Multi-role User Management**: Support for Guest, Common User, Admin, and Root User roles
- **Multiple Login Methods**: Username/Password, GitHub OAuth
- **Email Verification**: Email registration verification and password reset
- **Secure Authentication**: JWT Token-based API authentication with session management
- **Permission Control**: Granular file upload/download permission control

### File Management System
- **File Upload/Download**: Support for multiple file types with batch operations
- **File Permission Management**: Role-based file access control
- **File Preview**: Support for images, documents, and various formats
- **Storage Management**: Local storage and cloud storage configuration support

### Security & Performance
- **Rate Limiting**: Redis-based API access frequency control
- **CORS Support**: Cross-Origin Resource Sharing configuration
- **Static File Caching**: Optimized static resource loading
- **Logging System**: Complete operation log recording
- **Cloudflare Turnstile**: Anti-bot verification

### User Interface
- **Responsive Design**: Perfect support for desktop and mobile devices
- **Modern UI**: Elegant interface based on Semantic UI React
- **Real-time Notifications**: Toast message notification system
- **Multi-language Support**: Chinese and English interface switching

## Technical Architecture

### Backend Tech Stack
- **Web Framework**: Gin (Go)
- **Database**: SQLite (default) / MySQL / PostgreSQL
- **Cache**: Redis
- **ORM**: GORM
- **Authentication**: JWT + Session
- **File Processing**: Go standard library

### Frontend Tech Stack
- **Framework**: React 18
- **UI Components**: Semantic UI React
- **Routing**: React Router v6
- **State Management**: React Context + Hooks
- **HTTP Client**: Axios
- **Build Tool**: Create React App

## Deployment

### Docker Deployment (Recommended)
```bash
# Start Redis container
docker run -d --name redis-asap -p 6379:6379 redis:7-alpine

# Start application
docker run -d --name anyspecs \
  --restart always \
  -p 3000:3000 \
  -v /path/to/data:/data \
  -e REDIS_CONN_STRING=redis://host.docker.internal:6379 \
  anyspecs/asap:latest
```

### Manual Deployment
1. **Clone Project**
   ```bash
   git clone https://github.com/anyspecs/asap.git
   cd asap
   ```

2. **Build Frontend**
   ```bash
   cd web
   npm install
   export NODE_OPTIONS="--openssl-legacy-provider"
   npm run build
   cd ..
   ```

3. **Build Backend**
   ```bash
   go mod download
   go build -o asap
   ```

4. **Start Application**
   ```bash
   chmod +x start.sh
   ./start.sh
   ```

5. **Access Application**
   Open browser and visit [http://localhost:3000](http://localhost:3000)

## Configuration

### Environment Variables
| Variable | Description | Example |
|----------|-------------|---------|
| `REDIS_CONN_STRING` | Redis connection string | `redis://localhost:6379` |
| `SESSION_SECRET` | Session secret key | `your-secret-key` |
| `SQL_DSN` | Database connection string | `root:pass@tcp(localhost:3306)/db` |
| `UPLOAD_PATH` | File upload path | `./upload` |
| `PORT` | Service port | `3000` |

### Command Line Arguments
```bash
./asap --port 3000 --log-dir ./logs
```

| Argument | Description | Default |
|----------|-------------|---------|
| `--port` | Service port | `3000` |
| `--log-dir` | Log directory | Not saved |
| `--version` | Show version | - |
| `--help` | Show help | - |

## System Configuration

### SMTP Email Configuration
Configure SMTP server in system settings, supporting:
- QQ Mail, Gmail, 163 Mail and other mainstream providers
- Support for STARTTLS (port 587) and SSL (port 465)
- Used for email verification and password reset

### GitHub OAuth Configuration
1. Create OAuth App on GitHub
2. Set callback URL: `http://yourdomain.com/oauth/github`
3. Fill in Client ID and Secret in system settings

### File Permission Configuration
- **Guest Permissions**: Configurable upload/download permissions
- **User Permissions**: Role-based file access control
- **Admin Permissions**: Complete file management permissions

## System Requirements

### Minimum Requirements
- **CPU**: 1 core
- **Memory**: 512MB
- **Storage**: 1GB available space
- **OS**: Linux/macOS/Windows

### Recommended Requirements
- **CPU**: 2+ cores
- **Memory**: 2GB+
- **Storage**: 10GB+ available space
- **Redis**: For caching and session storage

## Quick Start

### 1. Download and Run
```bash
# Download latest version
wget https://github.com/anyspecs/releases/latest/download/asap-linux-amd64 -O asap
chmod +x asap

# Start application
./asap --port 3000
```

### 2. Configure Redis (Optional)
```bash
# Start Redis
docker run -d --name redis-asap -p 6379:6379 redis:7-alpine

# Set environment variable
export REDIS_CONN_STRING=redis://localhost:6379
./asap
```

### 3. Access Management Interface
1. Visit http://localhost:3000
2. Login with root account
3. Enter system settings to configure SMTP, OAuth, etc.

## Contributing

Welcome to submit Issues and Pull Requests!

## License

This project is licensed under the [MIT License](LICENSE).