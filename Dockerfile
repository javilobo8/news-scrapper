FROM node:10-slim

RUN mkdir -p /opt/app
WORKDIR /opt/app

COPY package.json yarn.lock ./
RUN yarn install --production
COPY . .

EXPOSE 8080
CMD ["node", "./bin/www"]
