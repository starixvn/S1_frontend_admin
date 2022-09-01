FROM node:14.9.0 AS build-step

WORKDIR /build
COPY package.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:1.18.0
WORKDIR /app
COPY --from=build-step /build/build .
EXPOSE 5071