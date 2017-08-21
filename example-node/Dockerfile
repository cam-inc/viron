FROM cam-inc/amzn.2017.03/node.7.10:1.0.0

RUN mkdir -p /example-node
RUN chown -R node:node /example-node
ENV HOME /example-node
USER node
WORKDIR $HOME

# Setup project
ADD package.json /example-node/package.json
ADD .npmrc /example-node/.npmrc
#RUN npm install --production --no-progress && npm cache clean
RUN npm install --no-progress && npm cache clean

# Copy source files
ADD shared /example-node/shared
ADD api /example-node/api
ADD config /example-node/config
ADD app.js /example-node/app.js
ADD test /example-node/test

EXPOSE 3000
USER root
CMD npm start
