ARG DOCKER_PROXY_HOST="docker.io"
FROM ${DOCKER_PROXY_HOST}/node:22

# 環境変数の設定
USER node
WORKDIR /app

# package build
COPY --chown=node:node package.json ./
COPY --chown=node:node package-lock.json ./
COPY --chown=node:node turbo.json ./
COPY --chown=node:node example/nodejs ./example/nodejs
COPY --chown=node:node packages/nodejs ./packages/nodejs
COPY --chown=node:node packages/linter ./packages/linter
RUN npm install && npm cache verify && npm run build -- --filter=@viron/example-nodejs

WORKDIR /app/example/nodejs

# ポート設定 & 実行コマンド
EXPOSE 3000
ENTRYPOINT ["npm"]
CMD ["start"]