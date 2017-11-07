FROM cam-inc/amzn.2017.03/node.7.10:1.0.0

RUN mkdir -p /example-node
RUN chown -R node:node /example-node
ENV HOME /example-node
USER node
WORKDIR $HOME

# Setup project
ADD package.json /example-node/package.json
#RUN npm install --production --no-progress && npm cache clean
RUN npm install --no-progress && npm cache clean

# Copy source files
ADD shared /example-node/shared
ADD config /example-node/config
ADD app.js /example-node/app.js
ADD controllers /example-node/controllers
ADD fittings /example-node/fittings
ADD swagger /example-node/swagger
ADD test /example-node/test

EXPOSE 3000
USER root
CMD npm start
