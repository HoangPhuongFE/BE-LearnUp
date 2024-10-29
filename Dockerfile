# Sử dụng Node.js 20 làm hình ảnh cơ sở
FROM node:20 AS build

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép package.json và package-lock.json
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn vào thư mục làm việc
COPY . .

# Thiết lập quyền truy cập cho file .env và thư mục socket
RUN if [ -f ".env" ]; then chmod 600 .env; fi
RUN chmod -R 755 /app/src/socket

# Biên dịch mã TypeScript
RUN npm run build

# Sử dụng Node.js 20 nhẹ hơn để chạy ứng dụng
FROM node:20-alpine

# Thiết lập lại thư mục làm việc
WORKDIR /app

# Sao chép thư mục dist từ image trước đó
COPY --from=build /app/dist ./dist

# Sao chép lại package.json
COPY --from=build /app/package*.json ./

# Cài đặt chỉ các dependencies cần thiết cho môi trường sản xuất
RUN npm install --only=production

# Tạo người dùng mới và chuyển sang người dùng không phải root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Chỉ định cổng mà ứng dụng sẽ sử dụng
EXPOSE 8080

# Chạy ứng dụng
CMD ["node", "dist/server.js"]
