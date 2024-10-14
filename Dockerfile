# Bước 1: Sử dụng hình ảnh Node.js làm hình ảnh cơ sở
FROM node:16 AS build

# Bước 2: Thiết lập thư mục làm việc
WORKDIR /app

# Bước 3: Sao chép package.json và package-lock.json
COPY package*.json ./

# Bước 4: Cài đặt dependencies
RUN npm install

# Bước 5: Sao chép toàn bộ mã nguồn vào thư mục làm việc
COPY . .

# Bước 6: Thiết lập quyền truy cập cho file .env và thư mục socket
RUN if [ -f ".env" ]; then chmod 600 .env; fi
RUN chmod -R 755 /app/src/socket

# Bước 7: Biên dịch mã TypeScript
RUN npm run build

# Bước 8: Sử dụng hình ảnh Node.js nhẹ hơn để chạy ứng dụng
FROM node:16-alpine

# Bước 9: Thiết lập lại thư mục làm việc
WORKDIR /app

# Bước 10: Sao chép thư mục dist từ image trước đó
COPY --from=build /app/dist ./dist

# Bước 11: Sao chép lại package.json
COPY --from=build /app/package*.json ./

# Bước 12: Cài đặt chỉ các dependencies cần thiết cho môi trường sản xuất
RUN npm install --only=production

# Tạo người dùng mới và chuyển sang người dùng không phải root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Bước 13: Chỉ định cổng mà ứng dụng sẽ sử dụng
EXPOSE 8080

# Bước 14: Chạy ứng dụng
CMD ["node", "dist/server.js"]
