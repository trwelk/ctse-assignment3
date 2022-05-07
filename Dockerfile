FROM node:14-alpine3.13

WORKDIR /app

# copy the json file first
COPY ./package.json /app

RUN npm install 
COPY . .
EXPOSE 9090/tcp
CMD ["node", "server.js"]