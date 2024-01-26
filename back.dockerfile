ARG NODE_VERSION=20.11.0

FROM node:${NODE_VERSION}-slim as base

WORKDIR /src

COPY back/package.json back/package-lock.json .
RUN npm install

COPY back/ .

EXPOSE 3001

CMD [ "npm", "run", "pm2"]
