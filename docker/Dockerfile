FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY node/package.json node/pnpm-lock.yaml* ./

RUN corepack enable pnpm && pnpm install --frozen-lockfile

COPY node/ ./

RUN pnpm run build

EXPOSE 8000 9000

ENTRYPOINT ["node", "dist/index.js"]