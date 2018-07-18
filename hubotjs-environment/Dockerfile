FROM node:8-alpine

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

RUN apk add --no-cache bash gawk sed grep bc coreutils

VOLUME usr/src/app userfunc
ADD . /usr/src/app

WORKDIR /usr/src/app

RUN npm install && npm cache clean --force
CMD [ "npm", "start" ]

EXPOSE 8888
