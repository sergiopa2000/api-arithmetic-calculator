FROM node:16
WORKDIR /usr/src/app
COPY ./package*.json ./
RUN npm install
COPY ./.env .env
COPY ./proxy/proxy-server.js ./server.js
COPY ./proxy/certificates/ ./certificates
EXPOSE 443
CMD [ "node", "server.js" ]