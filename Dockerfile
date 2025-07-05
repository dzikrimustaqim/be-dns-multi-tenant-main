FROM node:22.14

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

CMD ["npx", "nodemon", "src/server.js"]

