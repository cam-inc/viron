FROM cam-inc/amzn.2017.03/node.7.10:1.0.0

RUN mkdir -p /example-google
RUN chown -R node:node /example-google
ENV HOME /example-google
USER node
WORKDIR $HOME

# Setup project
ADD package.json /example-google/package.json
#RUN npm install --production --no-progress && npm cache clean
RUN npm install --no-progress && npm cache clean

# Copy source files
ADD shared /example-google/shared
ADD config /example-google/config
ADD app.js /example-google/app.js
ADD controllers /example-google/controllers
ADD fittings /example-google/fittings
ADD swagger /example-google/swagger

EXPOSE 3000
USER root
CMD npm start
