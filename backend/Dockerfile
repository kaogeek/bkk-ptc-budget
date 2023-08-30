# base image
FROM node:lts-slim AS base

ARG timezone=Asia/Bangkok

ENV TZ $timezone
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable
RUN apt-get update && apt-get -y install git
COPY . /app
WORKDIR /app

# get dependencies stage
FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod

# pack image
FROM gcr.io/distroless/nodejs20:nonroot

ARG	timezone=Asia/Bangkok

ENV LANG C.UTF-8
ENV LC_ALL C.UTF-8
ENV TZ $timezone
ENV NODE_ENV production

WORKDIR /app

COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=base /app /app

VOLUME [ "/app/uploads" ]

EXPOSE 8090

CMD [ "/app/server.js" ]