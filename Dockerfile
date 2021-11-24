FROM node:12.13.0

# Create certificates for testing
RUN mkdir /certs
COPY certs /certs/

RUN mkdir /app
WORKDIR /app

ADD package.json yarn.lock /app/
RUN apt-get update
RUN yes | apt-get install libgtk2.0-0 libgtk-3-0 libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb
RUN yarn install
RUN npm install -g serve

COPY config /app/config/
COPY public /app/public/
COPY src /app/src/
COPY scripts /app/scripts/
