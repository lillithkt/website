FROM node:22-bookworm AS builder
WORKDIR /app
RUN npm install -g pnpm
RUN apt update
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
ENV TESTENV=true
RUN pnpm run build
RUN pnpm prune --production

FROM node:22-bookworm
RUN apt update
RUN apt install -y curl
RUN npm i -g pnpm
WORKDIR /app
COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
COPY package.json .
ENV NODE_ENV=production
HEALTHCHECK --interval=120s --timeout=10s --start-period=20s --retries=3 \
  CMD curl -f http://localhost:3000/healthcheck || exit 1
CMD [ "node", "build" ]