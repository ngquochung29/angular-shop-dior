# Stage 1: Build Angular app
FROM node:20-alpine AS build
WORKDIR /app

# Copy package files và cài dependencies
COPY package*.json ./
RUN npm install

# Copy toàn bộ source code và build Angular (theo cấu hình production mặc định)
COPY . .
RUN npm run build -- --configuration production

# Stage 2: Serve bằng Nginx
FROM nginx:alpine

# Copy file build vào thư mục Nginx (dist/myapp theo angular.json)
COPY --from=build /app/dist/myapp /usr/share/nginx/html

# Copy nginx config để support Angular routing (SPA)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
