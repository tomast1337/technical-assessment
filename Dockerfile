FROM node:20

WORKDIR /usr/src/app

COPY . .

COPY package.json ./
RUN npm install


EXPOSE 3000

CMD ["pnpm", "start"]