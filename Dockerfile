FROM node:10.14

WORKDIR /app/

COPY package.json package-lock.json /app/
RUN npm i

COPY . /app/
VOLUME /app/storage

EXPOSE 80

ENV NODE_ENV=production

CMD npm start