FROM node:9

RUN mkdir -p /demo
RUN chown -R node:node /demo
ENV HOME /demo
USER node
WORKDIR $HOME

# Setup project
ADD package.json /demo/package.json
#RUN npm install --production --no-progress && npm cache verify
RUN npm install --no-progress && npm cache verify

# Copy source files
ADD shared /demo/shared
ADD config /demo/config
ADD app.js /demo/app.js
ADD controllers /demo/controllers
ADD fittings /demo/fittings
ADD swagger /demo/swagger
ADD public /demo/public
ADD test /demo/test

EXPOSE 3000
USER root
CMD npm start
