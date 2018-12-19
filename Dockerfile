FROM node:10.14

WORKDIR /app/

COPY package.json package-lock.json /app/
RUN npm i

COPY . /app/
VOLUME /app/storage

CMD npm start