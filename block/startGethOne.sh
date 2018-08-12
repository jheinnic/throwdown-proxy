#!/bin/sh

NODE_DIR=/Users/jheinnic/Git/throwdown-proxy/block/nodeOne

# DEBUG_PARAMS='--trace ${NODE_DIR}/traceData.log --pprof --pprofaddr 127.0.0.1 --pprofport 8201 --debug --metrics --vmdebug'
DEBUG_PARAMS=''

geth --datadir ${NODE_DIR} --keystore ${NODE_DIR}/keystore --nodekey ${NODE_DIR}/nodekey --syncmode 'full' --nousb --port 30311 --nat none --netrestrict '192.168.5.0/26' --rpcvhosts 'localhost' --rpccorsdomain 'localhost' --rpc --rpcaddr '127.0.0.1' --rpcport 8545 --rpcapi 'debug,personal,db,eth,net,web3,miner' --ws --wsaddr '127.0.0.1' --wsport 8645 --wsapi 'debug,personal,db,eth,net,web3,miner' --bootnodes 'enode://b14a98809a7459485b35d479a7455210c4910f0b49ab9a111d5c8169986571a2002d4303c549a8c7b70932bb69db31a996db583bcb16b84fc8cb4500cec20931@192.168.5.6:30310' --networkid 3378010 --gasprice 600 --identity 1b095a4f80b61b20 --unlock '0x13b285a259f914f257ee899e67bdb5f4171134a7' --password ${NODE_DIR}/password.txt --unlock '0xb28d31d483f49527ee096044dbe5a7d8e0e428bc' --password ${NODE_DIR}/password.txt --unlock '0x56d9571435aab8f9d38046dbb605c703fef29d9e' --password ${NODE_DIR}/password.txt --etherbase '0xc3e94a33aef39be9af77a001bf3dc68983d6aa01' --unlock '0xc3e94a33aef39be9af77a001bf3dc68983d6aa01' --password ${NODE_DIR}/password.txt --mine --minerthreads 1 ${DEBUG_PARAMS} --targetgaslimit 18223372036854776000
