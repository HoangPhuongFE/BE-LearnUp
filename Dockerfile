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

# Bước 6: Biên dịch mã TypeScript
RUN npm run build

# Bước 7: Sử dụng hình ảnh Node.js nhẹ hơn để chạy ứng dụng
FROM node:16-alpine

# Bước 8: Thiết lập lại thư mục làm việc
WORKDIR /app

# Bước 9: Sao chép thư mục dist từ image trước đó
COPY --from=build /app/dist ./dist

# Bước 10: Sao chép lại package.json
COPY --from=build /app/package*.json ./

# Bước 11: Cài đặt chỉ các dependencies cần thiết cho môi trường sản xuất
RUN npm install --only=production

# Bước 12: Chỉ định cổng mà ứng dụng sẽ sử dụng
EXPOSE 8080

# Bước 13: Chạy ứng dụng
CMD ["node", "dist/server.js"]
