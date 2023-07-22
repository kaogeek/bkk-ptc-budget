# syntax=docker/dockerfile:1
FROM node:18-slim AS base
ENV npm_HOME="/npm"
ENV PATH="$npm_HOME:$PATH"
RUN corepack enable
WORKDIR /app
COPY package*.json *-lock.yaml ./

# FROM base AS prod-deps
# RUN --mount=type=cache,id=npm,target=/npm/store npm ci --legacy-peer-deps --force --omit=dev

FROM base AS builder
ENV NODE_ENV build
RUN --mount=type=cache,id=npm,target=/npm/store npm ci --legacy-peer-deps --force
RUN npm run build

FROM keymetrics/pm2:latest-slim
LABEL maintainer="Kawin Viriyaprasopsook <kawin.v@kkumail.com>"

ARG	timezone=Asia/Bangkok

ENV	LANG C.UTF-8
ENV	LC_ALL C.UTF-8
ENV	TZ $timezone
ENV NODE_ENV=production

# change init directory
WORKDIR /app
# copy all files
COPY . ./
COPY --from=builder /app/.nuxt ./.nuxt
COPY --from=builder /app/.output ./.output
# COPY --from=prod-deps /app/node_modules ./node_modules
# expose 3000 on container
EXPOSE 3000

CMD ["pm2-runtime", ".output/index.mjs"]