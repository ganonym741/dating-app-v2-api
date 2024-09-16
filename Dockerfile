FROM node:20-alpine3.18 AS builder

WORKDIR /app
COPY package*.json ./

RUN npm install
COPY . .

RUN npm run build

EXPOSE 3011
CMD npm run migration:generate && npm run migration:run && npm run start:prod