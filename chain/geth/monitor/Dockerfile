FROM ubuntu:xenial

MAINTAINER John Heinnickel <jheinnic@hotmail.com>

WORKDIR "/opt"

ADD ./app.json /opt/app.json

RUN apt-get update \
      && apt-get install -y wget nodejs npm ntp git\
      && ln -s /usr/bin/nodejs /usr/bin/node \
      && npm install -g pm2 \
      && git clone https://github.com/jheinnic/eth-net-intelligence-api.git \
      && cd eth-net-intelligence-api \
      && mv ../app.json . \
      && npm install \
      && rm -rf /var/lib/apt/lists/*

WORKDIR "/opt/eth-net-intelligence-api"

CMD exec pm2-docker start app.json
