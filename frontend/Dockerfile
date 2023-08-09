# base image
FROM node:lts-slim AS base

ARG timezone=Asia/Bangkok

ENV TZ $timezone
ENV NPM_HOME="/npm"
ENV PATH="$NPM_HOME:$PATH"

RUN corepack enable
RUN apt-get update && apt-get -y install git
COPY . /app
WORKDIR /app

# build stage
FROM base AS builder
RUN apt-get update && apt-get install -y git
RUN --mount=type=cache,id=npm,target=/npm/store npm install --legacy-peer-deps
RUN npm run build

# pack image
FROM gcr.io/distroless/nodejs20:nonroot

ARG	timezone=Asia/Bangkok
ARG node_env=production

ENV LANG C.UTF-8
ENV LC_ALL C.UTF-8
ENV TZ $timezone
ENV NODE_ENV $node_env

WORKDIR /app

WORKDIR /app

COPY --from=builder /app/.output/ /app

EXPOSE 3000

CMD [ "/app/server/index.mjs" ]
