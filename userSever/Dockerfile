# 使用官方Node.js镜像作为基础镜像
FROM node:16-alpine

# 设置工作目录
WORKDIR /usr/src/app

# 安装依赖（多阶段构建优化）
COPY package*.json ./
RUN npm install --only=production

# 拷贝应用代码
COPY . .

# 如果你需要构建TypeScript项目，可以在这里添加编译步骤
# RUN npm run build

# 暴露应用程序监听的端口
EXPOSE 3000

# 启动命令
CMD ["npm", "start"]