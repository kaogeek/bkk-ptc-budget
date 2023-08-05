# base image
FROM node:16-slim AS base

ARG timezone=Asia/Bangkok

ENV TZ $timezone
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable
COPY . /app
WORKDIR /app

# get dependencies stage
FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install

# pack image
FROM base

ARG	timezone=Asia/Bangkok

ENV LANG C.UTF-8
ENV LC_ALL C.UTF-8
ENV TZ $timezone

COPY --from=prod-deps /app/node_modules /app/node_modules
VOLUME [ "/app/uploads" ]

EXPOSE 8090

CMD [ "pnpm", "server.js" ]