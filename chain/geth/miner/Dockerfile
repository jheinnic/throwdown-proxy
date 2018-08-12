FROM ubuntu:xenial

MAINTAINER John Heinnickel <jheinnic@hotmail.com>

EXPOSE 8545
EXPOSE 30303

VOLUME /var/geth/data/
VOLUME /var/geth/keystore/

WORKDIR "/opt/geth/bin"

ARG BINARY="geth-alltools-linux-amd64-1.8.11-dea1ce05.tar.gz"

RUN apt-get update \
     && apt-get install -y wget \
     && wget "https://gethstore.blob.core.windows.net/builds/$BINARY" \
     && tar -xzvf $BINARY --strip 1 \
     && rm -rf /var/lib/apt/lists/* $BINARY

# RUN echo $sealerKeyPassword > ~/.accountPassword \
#      && echo $sealerPrivateKey > ~/.privateKey \
#      && echo $sealerAddress > ~/.sealerAddress \
#      && chmod 400 ~/.accountPassword ~/.privateKey /var/geth/keystore/* \
#      && chmod 500 /opt/geth/bin/launchContainer.sh \
#      && ./geth account import --keystore /var/geth/keystore --password ~/.accountPassword  ~/.privateKey \
#      && rm -rf ~/.privateKey
# ADD ./keystore/UTC--2018-06-16T18:34:04.264Z--13b285a259f914f257ee899e67bdb5f4171134a7 /var/geth/keystore/
# ADD ./keystore/UTC--2018-06-16T18:46:05.945Z--56d9571435aab8f9d38046dbb605c703fef29d9e /var/geth/keystore/
# ADD ./keystore/UTC--2018-06-16T18:46:18.861Z--b28d31d483f49527ee096044dbe5a7d8e0e428bc /var/geth/keystore/

ADD ./pubAccts/* /root/pubAccts/
ADD ./genesis.json /etc/genesis.json
ADD ./launchGeth.sh /opt/geth/bin/launchGeth.sh
ADD ./launchConsole.sh /opt/geth/bin/launchConsole.sh
ADD ./launchContainer.sh /opt/geth/bin/launchContainer.sh
ADD ./console-utils.js /opt/geth/bin/console-utils.js

RUN chmod 500 /opt/geth/bin/launchGeth.sh /opt/geth/bin/launchContainer.sh /opt/geth/bin/launchConsole.sh \
      && chmod 400 /etc/genesis.json 

ENV bootnodeId=""
ENV bootnodeIp=""
ENV sealerAddress=""
ENV sealerKeyPassword=""
ENV sealerPrivateKey=""
ENV chainSubnet="127.0.0.1/30"

# TODO: Set --rpcvhosts
# TODO: Set --wsport
CMD exec /opt/geth/bin/launchContainer.sh
