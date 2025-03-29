# Этап 1: Сборка приложения
FROM node:20-alpine AS builder

WORKDIR /app

# Копируем только package.json и package-lock.json для кеширования зависимостей
COPY package*.json ./

# Устанавливаем только production-зависимости
RUN npm install --only=production

# Копируем оставшиеся файлы, кроме ненужных (.dockerignore)
COPY . .

# Оптимизация: Убираем source maps
ENV GENERATE_SOURCEMAP=false

# Сборка React-приложения
RUN npm run build

# Этап 2: Запуск Nginx
FROM nginx:alpine

# Копируем файлы сборки из первого этапа
COPY --from=builder /app/build /usr/share/nginx/html

# Экспонируем порт 80
EXPOSE 80

# Запуск Nginx
CMD ["nginx", "-g", "daemon off;"]
