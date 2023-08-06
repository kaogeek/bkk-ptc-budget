# base image
FROM node:16-slim AS base

ARG timezone=Asia/Bangkok

ENV TZ $timezone
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable
COPY . /app
WORKDIR /app

# build stage
FROM base AS builder
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install
RUN pnpm run build

# pack image
FROM base

ARG	timezone=Asia/Bangkok

ENV LANG C.UTF-8
ENV LC_ALL C.UTF-8
ENV TZ $timezone

COPY --from=builder /app/.output/ /app

EXPOSE 3000

CMD [ "pnpm", "/app/server/index.mjs" ]
