FROM node:15

RUN mkdir -p /example/nodejs
RUN chown -R root:root /example/nodejs
ENV HOME /example/nodejs
USER root
WORKDIR $HOME

# Setup project
COPY package.json ${HOME}/package.json
COPY package-lock.json ${HOME}/package-lock.json
#RUN npm install --production --no-progress && npm cache verify
RUN npm install --no-progress && npm cache verify

# Copy source files
COPY src ${HOME}/src
COPY tsconfig.json ${HOME}/tsconfig.json
# COPY .eslintignore ${HOME}/.eslintignore
# COPY .eslintrc.js ${HOME}/.eslintrc.js
# COPY .prettierrc.yaml ${HOME}/.prettierrc.yaml
# COPY node_modules ${HOME}/node_modules


EXPOSE 3000
USER root
CMD npm run dev