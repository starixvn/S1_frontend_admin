FROM node:18-alpine AS build-step

WORKDIR /build
COPY package.json ./
COPY package-lock.json ./
COPY postinstall.js ./
RUN npm ci --prefer-offline --no-audit --progress=false

COPY . .
RUN npm run build

FROM nginx:1.18.0
WORKDIR /app
COPY --from=build-step /build/dist .
COPY admin.conf /etc/nginx/conf.d

EXPOSE 5071