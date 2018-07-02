#!/bin/sh

ACCOUNT_PASSWORD=/root/.accountPassword
PRIVATE_KEY=/root/.privateKey

if test ! -e /var/geth/data/nodekey
then
    /opt/geth/bin/bootnode -genkey /var/geth/data/nodekey
    chmod 400 /var/geth/data/nodekey
    ls -la /var/geth/data/nodekey
fi

if test ! -e ${ACCOUNT_PASSWORD}
then
    echo $sealerKeyPassword > ${ACCOUNT_PASSWORD}
    chmod 400 ${ACCOUNT_PASSWORD}
fi

if test ! -d /var/geth/keystore
then
	mkdir -p /var/geth/keystore
fi

if test `ls /var/geth/keystore/* 2> /dev/null | wc -l` -eq 0 
then
    echo "Importing sealer key, ${sealerPrivateKey} for ${sealerAddress} with ${sealerKeyPassword}"
    echo $sealerPrivateKey > ${PRIVATE_KEY}
    /opt/geth/bin/geth account import --datadir /var/geth/data --keystore /var/geth/keystore --password ${ACCOUNT_PASSWORD} ${PRIVATE_KEY}
    rm ${PRIVATE_KEY}
    
    for ii in `ls /root/pubAccts/*.key`
    do
        /opt/geth/bin/geth account import --datadir /var/geth/data --keystore /var/geth/keystore --password ${ACCOUNT_PASSWORD} ${ii}
        rm ${ii}
    done
fi

if test ! -e /opt/geth/genesis
then
    echo "Creating genesis block"
    /opt/geth/bin/geth --datadir /var/geth/data --keystore /var/geth/keystore --unlock ${sealerAddress} --password ${ACCOUNT_PASSWORD} init /etc/genesis.json
    touch /opt/geth/genesis
else
    echo "Subsequent run--no genesis"
fi

BOOTNODE_HOST=`getent hosts geth-bootnode | awk '{print $1}'`

echo "Launching geth in clique mode with boot node on ${BOOTNODE_HOST}"
/opt/geth/bin/geth --datadir /var/geth/data --keystore /var/geth/keystore --nodekey /var/geth/data/nodekey --syncmode full --bootnodes "enode://${bootnodeId}@${BOOTNODE_HOST}:30303" --networkid 3378010 --nousb --port 30303 --netrestrict ${chainSubnet} --nat none --verbosity 3 --rpc --rpcapi 'admin,personal,db,eth,net,web3,miner' --rpcaddr '0.0.0.0' --rpcport 8545 --rpccorsdomain '*' --rpcvhosts '*' --ws --wsaddr '0.0.0.0' --wsapi 'admin,personal,db,eth,net,web3,miner' --wsorigins '*' --gasprice 600 --targetgaslimit 4712388 --mine --minerthreads 1 --etherbase ${sealerAddress} --unlock ${sealerAddress} --password ${ACCOUNT_PASSWORD} --unlock '0x13b285a259f914f257ee899e67bdb5f4171134a7' --password ${ACCOUNT_PASSWORD} --unlock '0xb28d31d483f49527ee096044dbe5a7d8e0e428bc' --password ${ACCOUNT_PASSWORD}
