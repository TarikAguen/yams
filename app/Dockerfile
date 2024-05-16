FROM node:latest

WORKDIR /usr/src/app

COPY package*.json ./

RUN rm -rf package-lock.json node_modules

RUN npm i
RUN npm install

# RUN npm install vite@4.4.0

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "dev"]