FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:25-slim@sha256:136ab7fbbb01dbcf838f783af570420c266f69693082db0f6ed4c17e9d61a54e

ENV NODE_ENV=production
ENV NPM_CONFIG_CACHE=/tmp

WORKDIR /usr/src/app
COPY server server
COPY frontend frontend

WORKDIR /usr/src/app/server

ARG VERSION
ENV VERSION=$VERSION

CMD ["--trace-warnings", "dist/server.js"]
EXPOSE 8080
