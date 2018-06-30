FROM ubuntu:xenial
  
MAINTAINER John Heinnickel <jheinnic@hotmail.com>

WORKDIR "/opt"

RUN apt-get update \
      && apt-get install -y wget nodejs npm ntp git \
      && ln -s /usr/bin/nodejs /usr/bin/node \
      && git clone https://github.com/jheinnic/eth-netstats.git \
      && cd eth-netstats \
      && npm install -g grunt-cli \
      && npm install \
      && grunt \
      && rm -rf /var/lib/apt/lists/*

WORKDIR "/opt/eth-netstats"

CMD WS_SECRET=test npm start
