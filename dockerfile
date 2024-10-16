FROM hub.lumigame.com/base/node:18-16-alpine-24h1.1 AS build-step

WORKDIR /build
COPY package.json ./
COPY package-lock.json ./
COPY postinstall.js ./
RUN npm ci --prefer-offline --no-audit --progress=false

COPY . .
COPY missing-config.js public/c.js
RUN npm run build

FROM hub.lumigame.com/base/nginx:brotli-1.20.2-zlib
WORKDIR /app
COPY admin.conf /etc/nginx/conf.d/default.conf
COPY --from=build-step /build/dist /usr/share/nginx/html

EXPOSE 5000