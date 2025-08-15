# 前端构建阶段
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

# 创建 VERSION 文件或使用构建参数
ARG VERSION=v1.0.0
RUN echo $VERSION > VERSION

# 设置环境变量以解决 Node.js 18 的 OpenSSL 兼容性问题
ENV NODE_OPTIONS="--openssl-legacy-provider"

RUN REACT_APP_VERSION=$(cat VERSION) npm run build

# 生产阶段 - 使用nginx托管静态文件
FROM nginx:alpine

# 复制构建产物到nginx目录
COPY --from=builder /app/build /usr/share/nginx/html

# 复制nginx配置
COPY nginx.conf /etc/nginx/nginx.conf

# 暴露端口
EXPOSE 80

# 启动nginx
CMD ["nginx", "-g", "daemon off;"]
