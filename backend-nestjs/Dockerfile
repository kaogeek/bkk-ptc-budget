# syntax=docker/dockerfile:1
FROM node:18-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app
COPY package*.json *-lock.yaml ./

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm i --prod --frozen-lockfile

FROM base AS builder
ENV NODE_ENV build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm i --frozen-lockfile
RUN pnpm run build

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
COPY --from=builder /app/dist ./dist
COPY --from=prod-deps /app/node_modules ./node_modules
# expose 3000 on container
EXPOSE 3000

CMD ["pm2-runtime", "dist/main.js"]