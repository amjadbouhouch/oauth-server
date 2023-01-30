FROM node:16.17.1-alpine as builder
WORKDIR /@oauth/server
COPY package*.json ./
# TODO FIX
# COPY yarn.lock ./
RUN yarn install --immutable
COPY . .
RUN yarn build
RUN rm -rf src
EXPOSE 3000

CMD [ "npm","run", "production" ]
