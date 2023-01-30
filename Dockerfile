# Build box for all packages    
# this image does not contain the files or any env vars
FROM node:16.17.1-alpine as builder

WORKDIR /@oauth

# manual step, for now
# copy package.json manually from the packages
COPY package.json yarn.lock lerna.json /@oauth/

COPY packages/admin-console/package.json /@oauth/packages/admin-console/package.json
COPY packages/server/package.json /@oauth/packages/server/package.json
# for postinstall stuff
COPY packages/db-client/ /@oauth/packages/db-client/

RUN yarn install --frozen-lockfile

# copy ALL the files -- tis might not work if multiple packages are changed and you want to install only one .... figure this out
COPY . /app


# this is super unoptimised approach
RUN yarn build


### SERVER IMAGE ###
FROM node:16.17.1-alpine as server

WORKDIR /@oauth
# copy the package.json so we can install prod deps, ones that are in the "dependencies" key
COPY --from=builder /@oauth/packages/server/package.json .

# copy the yarn.lock to save time resolving packages
COPY --from=builder /@oauth/yarn.lock .

# copy the built dist
COPY --from=builder /@oauth/packages/server/dist .

# install prod deps
RUN yarn install --production=true --ignore-optional

# remove the yarn cache
RUN yarn cache clean

EXPOSE 3000

CMD [ "npm","run", "production" ]


# production environment
FROM nginx:1.21.0-alpine as admin-console

#Copy production build files from builder phase to nginx
# COPY --from=builder /app/packages/client/dist /usr/share/nginx/html

COPY packages/admin-console/.nginx/nginx.conf /etc/nginx/conf.d/default.conf

RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder @oauth/packages/admin-console/build /usr/share/nginx/html

ENTRYPOINT ["nginx", "-g", "daemon off;"]