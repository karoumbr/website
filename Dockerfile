FROM node:12.20
RUN mkdir /app
WORKDIR /app
COPY . /app
RUN npm install
EXPOSE 80
CMD ["node","server.js"]