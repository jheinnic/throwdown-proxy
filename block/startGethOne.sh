#!/bin/sh

NODE_DIR=/Users/jheinnic/Git/throwdown-proxy/block/nodeOne

# DEBUG_PARAMS='--trace ${NODE_DIR}/traceData.log --pprof --pprofaddr 127.0.0.1 --pprofport 8201 --debug --metrics --vmdebug'
DEBUG_PARAMS=''

geth --datadir ${NODE_DIR} --keystore ${NODE_DIR}/keystore --nodekey ${NODE_DIR}/boot.key --syncmode 'full' --nousb --port 30311 --nat none --netrestrict '192.168.5.0/26' --rpcvhosts 'localhost' --rpccorsdomain 'localhost' --rpc --rpcaddr '127.0.0.1' --rpcport 8545 --rpcapi 'personal,db,eth,net,web3,miner' --ws --wsaddr '127.0.0.1' --wsport 8645 --wsapi 'personal,db,eth,net,web3,miner' --bootnodesv4 'enode://b14a98809a7459485b35d479a7455210c4910f0b49ab9a111d5c8169986571a2002d4303c549a8c7b70932bb69db31a996db583bcb16b84fc8cb4500cec20931@192.168.5.6:30310,enode://75827ea5abe1e0af9dbcdd5e47483391f48dd25c7ad3ed2c67dadbde60e3552a467b5ee06c33d62e0e0ac9b2311da7676a119b33fa9f83010aca85f18cc1d5b0@127.0.0.1:30312,enode://76a981bac603820c23a187513c6e2c76b24c7aec56798bc1cd4a4db855d9f0e0e9111bfa46142591bacbf3e679d019507505250ae6843f8a4b095ce0134f35da@127.0.0.1:30313' --networkid 3378010 --gasprice '6' --v5disc --identity 1b095a4f80b61b20 --unlock '0x13b285a259f914f257ee899e67bdb5f4171134a7' --unlock '0xb28d31d483f49527ee096044dbe5a7d8e0e428bc' --unlock '0x56d9571435aab8f9d38046dbb605c703fef29d9e' --etherbase '0xc3e94a33aef39be9af77a001bf3dc68983d6aa01' --unlock '0xc3e94a33aef39be9af77a001bf3dc68983d6aa01' --password ${NODE_DIR}/password.txt --mine ${DEBUG_PARAMS} --targetgaslimit 18223372036854776000
