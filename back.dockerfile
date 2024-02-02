FROM node:20.11.0-slim

ENV NODE_ENV=production
WORKDIR /src

RUN npm i -g sequelize-cli
COPY --link back/package.json back/package-lock.json .
RUN npm install

COPY --link back/ .
RUN chmod +x startup.sh

EXPOSE 3000

ENTRYPOINT [ "./startup.sh" ]
