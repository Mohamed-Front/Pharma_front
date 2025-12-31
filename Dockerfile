FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 8080
RUN sed -i 's/80/8080/g' /etc/nginx/conf.d/default.conf
RUN sed -i 's|index  index.html index.htm;|index  index.html index.htm; try_files $uri $uri/ /index.html;|g' /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
