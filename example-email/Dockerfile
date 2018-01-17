FROM cam-inc/amzn.2017.03/node.7.10:1.0.0

RUN mkdir -p /example-email
RUN chown -R node:node /example-email
ENV HOME /example-email
USER node
WORKDIR $HOME

# Setup project
ADD package.json /example-email/package.json
#RUN npm install --production --no-progress && npm cache clean
RUN npm install --no-progress && npm cache clean

# Copy source files
ADD shared /example-email/shared
ADD config /example-email/config
ADD app.js /example-email/app.js
ADD controllers /example-email/controllers
ADD fittings /example-email/fittings
ADD swagger /example-email/swagger

EXPOSE 3000
USER root
CMD npm start
