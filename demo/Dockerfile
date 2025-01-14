FROM node:22

RUN mkdir -p /demo
RUN chown -R node:node /demo
ENV HOME /demo
USER node
WORKDIR $HOME

# Setup project
COPY  --chown=node:node package.json /demo/package.json
#RUN npm install --production --no-progress && npm cache verify
RUN npm install --no-progress && npm cache verify

# Copy source files
COPY  --chown=node:node shared /demo/shared
COPY  --chown=node:node config /demo/config
COPY  --chown=node:node app.js /demo/app.js
COPY  --chown=node:node controllers /demo/controllers
COPY  --chown=node:node fittings /demo/fittings
COPY  --chown=node:node swagger /demo/swagger
COPY  --chown=node:node public /demo/public
COPY  --chown=node:node test /demo/test
COPY  --chown=node:node wait-for-it.sh /demo/wait-for-it.sh
COPY  --chown=node:node mysql.env /demo/mysql.env
COPY  --chown=node:node .env /demo/.env

EXPOSE 3000
USER root
CMD npm start
