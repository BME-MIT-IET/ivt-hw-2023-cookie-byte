# FROM docker/whalesay:latest
# LABEL Name=ivthw2023cookiebyte Version=0.0.1
# RUN apt-get -y update && apt-get install -y fortunes
# CMD ["sh", "-c", "/usr/games/fortune -a | cowsay"]

FROM node:14

WORKDIR /app

COPY package*.json /app/

RUN npm install

COPY . /app/

CMD ["npm","test"]

EXPOSE 8081