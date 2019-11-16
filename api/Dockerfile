FROM node:12-alpine

WORKDIR /opt/app
RUN apk add --update --no-cache mysql-client
COPY package.json .
COPY yarn.lock .

RUN yarn install
COPY . .

CMD ["sh", "entrypoint.sh"]
