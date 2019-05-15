FROM node:latest

WORKDIR /opt/app
COPY package.json .
COPY package-lock.json .
RUN npm install && npm install --only=development
COPY . .
RUN npm run build

ENTRYPOINT exit 0



