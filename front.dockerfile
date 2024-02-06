FROM node:20.11.0-slim as base

ENV NODE_ENV=production

WORKDIR /src

# Build
FROM base as build

COPY --link front/package.json front/package-lock.json .
RUN npm install --production=false

COPY --link front/ .

RUN npm run build
RUN npm prune

# Run
FROM base

ENV PORT=3000

COPY --from=build /src/.output /src/.output
# Optional, only needed if you rely on unbundled dependencies
# COPY --from=build /src/node_modules /src/node_modules

CMD [ "node", ".output/server/index.mjs" ]