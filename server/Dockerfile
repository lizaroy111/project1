FROM node:16.20.2

WORKDIR /app

COPY ./package*.json ./

RUN npm install

COPY . .

EXPOSE 8000

CMD ["npm","run","start"]