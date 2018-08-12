#!/bin/sh

NODE_DIR=/Users/jheinnic/Git/throwdown-proxy/block/nodeThree

# DEBUG_PARAMS='--trace ${NODE_DIR}/traceData.log --pprof --pprofaddr 127.0.0.1 --pprofport 8203 --debug --metrics --vmdebug'
DEBUG_PARAMS=''

geth --datadir ${NODE_DIR} --keystore ${NODE_DIR}/keystore --nodekey ${NODE_DIR}/nodekey --syncmode 'full' --nousb --port 30313 --nat none --netrestrict '192.168.5.0/26' --rpcvhosts 'localhost' --rpccorsdomain 'localhost' --rpc --rpcaddr '127.0.0.1' --rpcport 8547 --rpcapi 'personal,db,eth,net,web3,miner' --ws --wsaddr '127.0.0.1' --wsport 8647 --wsapi 'personal,db,eth,net,web3,miner' --wsorigins 'localhost' --bootnodesv4 'enode://b14a98809a7459485b35d479a7455210c4910f0b49ab9a111d5c8169986571a2002d4303c549a8c7b70932bb69db31a996db583bcb16b84fc8cb4500cec20931@102.168.5.6:30310,enode://1b095a4f80b61b206ae03cf5918028ff1617ae01d4d3d100402f6961a0a685b7e3cf8d862968d69d0b5725c973f34b8392c77dd6ed1692b39a87db3a752a56ef@192.168.5.6:30311,enode://75827ea5abe1e0af9dbcdd5e47483391f48dd25c7ad3ed2c67dadbde60e3552a467b5ee06c33d62e0e0ac9b2311da7676a119b33fa9f83010aca85f18cc1d5b0@192.168.5.6:30312' --networkid 3378010 --gasprice '6' --v5disc --identity 76a981bac603820c --unlock '0x13b285a259f914f257ee899e67bdb5f4171134a7' --unlock '0xb28d31d483f49527ee096044dbe5a7d8e0e428bc' --unlock '0x56d9571435aab8f9d38046dbb605c703fef29d9e' --etherbase '0x7df5d1658cdf0ee4d2e72bee51bf68b632e81e7b' --unlock '0x7df5d1658cdf0ee4d2e72bee51bf68b632e81e7b' --password ${NODE_DIR}/password.txt --mine --targetgaslimit 1822337203685477600 ${DEBUG_PARAMS} init genesis.json
