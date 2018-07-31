FROM node:9

RUN mkdir -p /viron
RUN chown -R node:node /viron
ENV HOME /viron
USER node
WORKDIR $HOME

# Setup project
ADD package.json /viron/package.json
ADD package-lock.json /viron/package-lock.json
#RUN npm install --production --no-progress && npm cache clean
RUN npm install

# Copy source files
ADD package.json /viron/package.json
ADD .editorconfig /viron/.editorconfig
ADD .eslintrc.js /viron/.eslintrc.js
ADD .stylefmtrc /viron/.stylefmtrc
ADD .stylelintrc /viron/.stylelintrc
ADD package-lock.json /viron/package-lock.json
ADD package.json /viron/package.json
ADD postcss.config.js /viron/postcss.config.js
ADD public /viron/public
ADD rollup.base.config.js /viron/rollup.base.config.js
ADD rollup.config.js /viron/rollup.config.js
ADD rollup.local.config.js /viron/rollup.local.config.js
ADD viron.js /viron/viron.js
ADD example-component /viron/example-component
ADD src /viron/src
ADD task /viron/task
ADD test /viron/test
Add viron.js /viron/viron.js
add example-component /viron/example-component

EXPOSE 8080
USER root
CMD npm start
