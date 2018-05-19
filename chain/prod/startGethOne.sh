#!/bin/sh

geth \
	--datadir nodeOne \
	--syncmode 'full' \
	--port 30311 \
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
	--bootnodesv5 'enode://b14a98809a7459485b35d479a7455210c4910f0b49ab9a111d5c8169986571a2002d4303c549a8c7b70932bb69db31a996db583bcb16b84fc8cb4500cec20931@127.0.0.1:30310' \
	--networkid 39448701 \
	--gasprice '1' \
	--unlock '0xc3e94a33aef39be9af77a001bf3dc68983d6aa01' \
	--password nodeOne/password.txt \
	--identity nodeOne \
	config-nodeOne.json
