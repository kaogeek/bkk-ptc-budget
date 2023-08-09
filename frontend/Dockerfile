# base image
FROM node:lts-slim AS base

ARG timezone=Asia/Bangkok

ENV TZ $timezone
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable
COPY . /app
WORKDIR /app

# build stage
FROM base AS builder
RUN apt-get update && apt-get install -y git
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install
RUN pnpm run build

# pack image
FROM gcr.io/distroless/nodejs20:nonroot

ARG	timezone=Asia/Bangkok

ENV LANG C.UTF-8
ENV LC_ALL C.UTF-8
ENV TZ $timezone

COPY --from=builder /app/.output/ /app

EXPOSE 3000

CMD [ "/app/server/index.mjs" ]
