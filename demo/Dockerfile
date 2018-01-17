FROM cam-inc/amzn.2017.03/node.7.10:1.0.0

RUN mkdir -p /demo
RUN chown -R node:node /demo
ENV HOME /demo
USER node
WORKDIR $HOME

# Setup project
ADD package.json /demo/package.json
#RUN npm install --production --no-progress && npm cache clean
RUN npm install --no-progress && npm cache clean

# Copy source files
ADD shared /demo/shared
ADD config /demo/config
ADD app.js /demo/app.js
ADD controllers /demo/controllers
ADD fittings /demo/fittings
ADD swagger /demo/swagger
ADD test /demo/test

EXPOSE 3000
USER root
CMD npm start
