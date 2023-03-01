FROM node:14.9.0 AS build-step

WORKDIR /build
COPY package.json ./
COPY package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.18.0
WORKDIR /app
COPY --from=build-step /build/build .
COPY nginx /etc/nginx/conf.d/
EXPOSE 5071