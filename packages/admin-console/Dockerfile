FROM node:16.17.1-alpine as builder
# test || production
ARG STAGING=staging

WORKDIR /admin-console
COPY package*.json ./
COPY yarn.lock ./
# RUN npm i -g yarn
RUN yarn install --immutable
COPY . .
RUN yarn build:${STAGING}


# production environment
FROM nginx:1.21.0-alpine

COPY /.nginx/nginx.conf /etc/nginx/conf.d/default.conf

RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /admin-console/build /usr/share/nginx/html

ENTRYPOINT ["nginx", "-g", "daemon off;"]
