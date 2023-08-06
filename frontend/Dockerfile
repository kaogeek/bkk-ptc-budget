# base image
FROM node:16-slim AS base

ARG timezone=Asia/Bangkok

ENV TZ $timezone
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable
RUN apt-get update && apt-get -y install git
COPY . /app
WORKDIR /app

# build stage
FROM base AS builder
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install
RUN pnpm run build

# pack image
FROM gcr.io/distroless/nodejs20:nonroot

ARG	timezone=Asia/Bangkok
ARG node_env=production

ENV LANG C.UTF-8
ENV LC_ALL C.UTF-8
ENV TZ $timezone
ENV NODE_ENV $node_env

WORKDIR /app

COPY --from=builder /app/.output/ /app

EXPOSE 3000

CMD [ "/app/server/index.mjs" ]
