FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:25-slim@sha256:9fa179c3469b3fa2b68e2567f45a2386dbd9570f4464e765c2a5ef0d40c13959

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
