
FROM ubuntu:xenial

MAINTAINER John Heinnickel <jheinnic@hotmail.com>

EXPOSE 8545
EXPOSE 30303

VOLUME /var/geth/data/
VOLUME /var/geth/keystore/

WORKDIR "/opt/geth/bin"

ARG BINARY="geth-alltools-linux-amd64-1.8.11-dea1ce05.tar.gz"
ARG sealerAddress
ARG sealerKeyPassword
ARG sealerPrivateKey

ADD ./genesis.json /etc/genesis.json
ADD ./keystore/UTC--2018-06-16T18:34:04.264Z--13b285a259f914f257ee899e67bdb5f4171134a7 /var/geth/keystore/
ADD ./keystore/UTC--2018-06-16T18:46:05.945Z--56d9571435aab8f9d38046dbb605c703fef29d9e /var/geth/keystore/
ADD ./keystore/UTC--2018-06-16T18:46:18.861Z--b28d31d483f49527ee096044dbe5a7d8e0e428bc /var/geth/keystore/
ADD ./launchGeth.sh /opt/geth/bin/launchGeth.sh

RUN mkdir /var/geth/data /var/geth/keystore \
     && apt-get update \
     && apt-get install -y wget \
     && wget "https://gethstore.blob.core.windows.net/builds/$BINARY" \
     && tar -xzvf $BINARY --strip 1 \
     && echo $sealerKeyPassword > ~/.accountPassword \
     && echo $sealerPrivateKey > ~/.privateKey \
     && echo $sealerAddress > ~/.sealerAddress \
     && chmod 400 /etc/genesis.json ~/.accountPassword ~/.privateKey /var/geth/keystore/* \
     && chmod 500 /opt/geth/bin/launchGeth.sh \
     && ./geth account import --keystore /var/geth/keystore --password ~/.accountPassword  ~/.privateKey \
     && rm -rf /var/lib/apt/lists/* $BINARY ~/.privateKey \
     && ./geth --datadir /var/geth/data --keystore /var/geth/keystore init /etc/genesis.json


ENV bootnodeId=""
ENV bootnodeIp=""
ENV chainSubnet="127.0.0.1/30"

# TODO: Set --rpcvhosts
# TODO: Set --wsport
CMD exec /opt/geth/bin/launchGeth.sh --datadir /var/geth/data --keystore /var/geth/keystore --nodekey /var/geth/data/nodekey --syncmode full --bootnodes "enode://$bootnodeId@$bootnodeIp:30303" --networkid=3378010 --nousb --port 30303 --netrestrict $chainSubnet --nat none --verbosity=4 --rpc --rpcapi 'admin,personal,db,eth,net,web3,miner' --rpcaddr '0.0.0.0' --rpcport 8545 --rpccorsdomain '*' --rpcvhosts '*' --ws --wsaddr '0.0.0.0' --wsapi 'admin,personal,db,eth,net,web3,miner' --wsorigins '*' --gasprice 600 --targetgaslimit 18223372036854776000 --mine --minerthreads 2 --etherbase $sealerAddress --unlock $sealerAddress --password ~/.accountPassword
