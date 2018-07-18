FROM node:8-alpine

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

RUN apk add --no-cache bash gawk sed grep bc coreutils

RUN mkdir -p /usr/src/app
RUN mkdir -p /userfunc

WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install && npm cache clean --force
COPY server.js /usr/src/app/server.js
COPY sample-applet.2018-07-09.private-key.pem /usr/src/app/sample-applet.2018-07-09.private-key.pem

CMD [ "npm", "start" ]

EXPOSE 8888