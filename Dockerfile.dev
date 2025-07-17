FROM node:18-alpine

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

RUN npm i -g pnpm
RUN pnpm build

EXPOSE 3000
RUN npm install -g nodemon
CMD ["nodemon", "dist/main"]