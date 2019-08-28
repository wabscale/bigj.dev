FROM node:alpine AS buildit
MAINTAINER big_J

WORKDIR /tmp/build
COPY package.json .
COPY yarn.lock .
RUN yarn install
COPY . .
RUN yarn run build

FROM node:alpine

WORKDIR /opt/jaime
COPY --from=buildit /tmp/build/build ./build
RUN yarn global add serve

CMD serve -s build
