# base image
FROM node:lts-slim AS base

ARG timezone=Asia/Bangkok

ENV TZ $timezone
ENV NPM_HOME="/npm"
ENV PATH="$NPM_HOME:$PATH"

RUN corepack enable
COPY . /app
WORKDIR /app

# build stage
FROM base AS builder
RUN apt-get update && apt-get install -y git
RUN --mount=type=cache,id=npm,target=/npm/store npm install --legacy-peer-deps
RUN npm run build

# pack image
FROM node:lts-slim

ARG	timezone=Asia/Bangkok

ENV LANG C.UTF-8
ENV LC_ALL C.UTF-8
ENV TZ $timezone

COPY --from=builder /app/.output/ /app

EXPOSE 3000

CMD [ "node", "/app/server/index.mjs" ]
