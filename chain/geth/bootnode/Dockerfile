FROM ubuntu:xenial

MAINTAINER John Heinnickel <jheinnic@hotmail.com>

EXPOSE 30301/udp
EXPOSE 30303/udp

WORKDIR "/opt/geth/bin"
ARG BINARY="geth-alltools-linux-amd64-1.8.11-dea1ce05.tar.gz"

# TODO: Use a secrets vault instead
# ADD ./bootnode.key /etc/bootnode.key

RUN apt-get update \
     && apt-get install -y wget \
     && wget "https://gethstore.blob.core.windows.net/builds/$BINARY" \
     && tar -xzvf $BINARY --strip 1 \
     && rm -rf $BINARY /var/lib/apt/lists/* 

ENV nodekeyhex=""
CMD exec /opt/geth/bin/bootnode -nodekeyhex ${nodekeyhex} -v5 -verbosity 5
