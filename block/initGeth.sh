#!/bin/sh

geth \
	--datadir nodeOne \
 	--keystore nodeOne/keystore \
	init genesis.json

geth \
	--datadir nodeTwo \
 	--keystore nodeTwo/keystore \
	init genesis.json

# bootnode --genkey ./boot.key

geth \
	--port 30011 \
        --datadir nodeOne \
        --keystore nodeOne/keystore \
        --unlock '0xc3e94a33aef39be9af77a001bf3dc68983d6aa01' \
        --nousb \
        --mine \
        --rpc \
        --rpcaddr 'localhost' \
        --rpcport 8501 \
	--rpcapi 'personal,db,eth,net,web3,txpool,miner' \
        --ws \
        --wsaddr 'localhost' \
        --wsport 8601 \
	--wsapi 'personal,db,eth,net,web3,txpool,miner' \
        --nat upnp \
        --identity nodeOne \
	--bootnodes 'enode://b14a98809a7459485b35d479a7455210c4910f0b49ab9a111d5c8169986571a2002d4303c549a8c7b70932bb69db31a996db583bcb16b84fc8cb4500cec20931@192.168.5.3:30310' \
	dumpconfig > config-nodeOne.json 2>&1

geth \
	--port 30012 \
        --datadir nodeTwo \
        --keystore nodeTwo/keystore \
        --unlock '0xb5e82077bf08ca3d50dc0fef87d473dd6b5099d0' \
        --nousb \
        --mine \
        --rpc \
        --rpcaddr 'localhost' \
        --rpcport 8502 \
	--rpcapi 'personal,db,eth,net,web3,txpool,miner' \
        --ws \
        --wsaddr 'localhost' \
        --wsport 8602 \
	--wsapi 'personal,db,eth,net,web3,txpool,miner' \
        --nat upnp \
        --identity nodeTwo \
	--bootnodes 'enode://b14a98809a7459485b35d479a7455210c4910f0b49ab9a111d5c8169986571a2002d4303c549a8c7b70932bb69db31a996db583bcb16b84fc8cb4500cec20931@192.168.5.3:30310' \
	dumpconfig > config-nodeTwo.json 2>&1
