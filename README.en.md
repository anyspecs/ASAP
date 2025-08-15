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

## Quick Start

### Docker (Recommended)

```bash
# 1. Clone project
git clone https://github.com/anyspecs/asap.git
cd asap

# 2. Configure environment variables
cp env.example .env
# Edit .env file and set necessary environment variables

# 3. Start all services with one command
docker-compose up -d

# 4. Check service status
docker-compose ps

# 5. Access application
# Frontend: http://localhost or https://localhost
# Backend API: http://localhost:3000
```

### Detailed Configuration Steps

#### 1. Environment Variables Configuration

Based on `env.config` file:

```bash
# Redis Configuration
REDIS_PASSWORD=your_secure_password
REDIS_PORT=6380

# Application Configuration
SESSION_SECRET=your_session_strong_password
UPLOAD_PATH=/data/upload
DB_PATH=/data/database

# Domain Configuration
DOMAIN=your-domain.com
ENABLE_TLS=true

# Default Admin Account
DEFAULT_ROOT_USERNAME=admin
DEFAULT_ROOT_PASSWORD=your_admin_init_pwd
```

#### 2. SSL Certificate Configuration

See `setupssl/ssl-setup.md` for details.

#### 3. Start Services

```bash
# Build and start all services
docker-compose up -d --build

# Check service status
docker-compose ps

# View logs
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f redis
```

#### 4. Service Management

```bash
# Stop all services
docker-compose down

# Restart specific service
docker-compose restart frontend
docker-compose restart backend

# Rebuild and start
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# View resource usage
docker stats
```

### Port Configuration

| Service | Port | Description |
|---------|------|-------------|
| Frontend | 80/443 | HTTP/HTTPS access port |
| Backend | 3000 | API service port (local access only) |
| Redis | 6380 | Cache service port (local access only) |

### Data Persistence

```yaml
volumes:
  redis_data:      # Redis data
  backend_data:    # Backend data (database, uploaded files)
  backend_logs:    # Backend logs
  frontend_logs:   # Frontend logs
```

### Health Checks

```bash
# Check service health status
docker-compose ps

# Manual health check
curl -f http://localhost:3000/api/status
curl -f http://localhost/api/status

# View health check logs
docker-compose logs frontend | grep health
```

### Monitoring and Maintenance

#### Log Management
```bash
# View real-time logs
docker-compose logs -f --tail=100

# Clean logs
docker system prune -f

# Log rotation configuration
# Configure logrotate on host machine
```

#### Backup Strategy
```bash
# Backup data
docker run --rm -v anyspecs_backend_data:/data -v $(pwd):/backup \
  alpine tar czf /backup/asap-backup-$(date +%Y%m%d).tar.gz /data

# Restore data
docker run --rm -v anyspecs_backend_data:/data -v $(pwd):/backup \
  alpine tar xzf /backup/asap-backup-20250101.tar.gz -C /data
```

### Production Environment Deployment

#### Security Configuration
```bash
# Firewall configuration
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable

# Disable root login
# Configure SSH key authentication
# Regularly update system and Docker images
```

#### High Availability Configuration
```bash
# Use Docker Swarm or Kubernetes
docker swarm init
docker stack deploy -c docker-compose.yml asap

# Load balancer configuration
# Database master-slave replication
# Redis cluster configuration
```

## Manual Deployment

### 1. Download and Run
```bash
# Download latest version
wget https://github.com/anyspecs/releases/latest/download/asap-linux-amd64 -O asap
chmod +x asap

# Start application
./asap --port 3000 --log-dir ./logs
```

### 2. Configure Redis (Optional)
```bash
# Start Redis
docker run -d --name redis-asap -p 6379:6379 redis:7-alpine

# Set environment variable
export REDIS_CONN_STRING=redis://localhost:6379
./asap --port 3000 --log-dir ./logs
```

### 3. Access Management Interface
1. Visit http://localhost:3000
2. Login with root account
3. Enter system settings to configure SMTP, OAuth, etc.

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

## Contributing

Welcome to submit Issues and Pull Requests!

## License

This project is licensed under the [MIT License](LICENSE).