ARG DOCKER_PROXY_HOST="docker.io"
FROM ${DOCKER_PROXY_HOST}/node:16

USER node
ENV HOME /example/nodejs
WORKDIR $HOME

# Copy source files
COPY --chown=node:node package.json ${HOME}/package.json
COPY --chown=node:node src ${HOME}/src
COPY --chown=node:node tsconfig.json ${HOME}/tsconfig.json
COPY --chown=node:node tsconfig.production.json ${HOME}/tsconfig.production.json
COPY --chown=node:node cert ${HOME}/cert

# Setup project
RUN npm install --no-progress --legacy-peer-deps && npm cache verify
RUN npm run build

EXPOSE 3000

ENTRYPOINT ["npm"]
CMD ["start"]
