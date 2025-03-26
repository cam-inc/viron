# === Stage 1: Build package/nodejs module ===
ARG DOCKER_PROXY_HOST="docker.io"
FROM ${DOCKER_PROXY_HOST}/node:22 AS package-builder

# 環境変数の設定
USER node
ENV SRC=packages/nodejs
WORKDIR /workspace/${SRC}

# package build
COPY --chown=node:node ${SRC} ./
RUN npm install && npm cache verify
RUN npm run build

# === Stage 2: Build main application ===
FROM ${DOCKER_PROXY_HOST}/node:22 AS app-builder

# 環境変数の設定
USER node
ENV SRC=example/nodejs
ENV PACKAGE=packages/nodejs
WORKDIR /app/${SRC}

# package.json を先にコピーし、キャッシュを活用
COPY --chown=node:node ${SRC}/package.json ./
RUN npm install && npm cache verify

# 残りのソースコードをコピー
COPY --chown=node:node ${SRC} ./

# package/nodejsをlocalのコードを参照するようにする
COPY --chown=node:node --from=package-builder /workspace/${PACKAGE} /app/${PACKAGE}
RUN rm -rf node_modules/@viron/lib && ln -s /app/${PACKAGE} /app/${SRC}/node_modules/@viron/lib

# Stage 2 ではビルドのみを実行（シンボリックリンクは作らない）
RUN npm run build

# ポート設定 & 実行コマンド
EXPOSE 3000
ENTRYPOINT ["npm"]
CMD ["start"]