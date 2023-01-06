FROM node:latest AS build
WORKDIR /app
COPY . .

RUN npm install -g npm@latest
RUN npm install --legacy-peer-deps
RUN npm audit fix --legacy-peer-deps
RUN npm run build --configuration=production

FROM nginx:alpine
WORKDIR /app

COPY --from=build /app/dist/test-app /usr/share/nginx/html
