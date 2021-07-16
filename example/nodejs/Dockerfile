ARG DOCKER_PROXY_HOST="docker.io"
FROM ${DOCKER_PROXY_HOST}/node:16

RUN mkdir -p /example/nodejs
RUN chown -R root:root /example/nodejs
ENV HOME /example/nodejs
USER root
WORKDIR $HOME

# Copy source files
COPY package.json ${HOME}/package.json
COPY src ${HOME}/src
COPY tsconfig.json ${HOME}/tsconfig.json
COPY tsconfig.production.json ${HOME}/tsconfig.production.json
COPY cert ${HOME}/cert

# Setup project
RUN npm install --no-progress && npm cache verify
RUN npm run build

EXPOSE 3000
USER node
ENTRYPOINT ["npm"]
CMD ["start"]
