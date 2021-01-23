FROM node:12.18.2-alpine3.12
WORKDIR /app
RUN pwd
COPY ./package.json ./package.json
RUN npm install
COPY . /app
EXPOSE 3000
CMD ["npm", "run", "dev"]