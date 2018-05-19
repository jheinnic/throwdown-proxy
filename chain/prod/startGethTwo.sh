#!/bin/sh

geth \
	--datadir nodeTwo \
	--syncmode 'full' \
	--port 30312 \
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
	--bootnodesv5 'enode://b14a98809a7459485b35d479a7455210c4910f0b49ab9a111d5c8169986571a2002d4303c549a8c7b70932bb69db31a996db583bcb16b84fc8cb4500cec20931@127.0.0.1:30310' \
	--networkid 39448701 \
	--gasprice '1' \
	--unlock '0xb5e82077bf08ca3d50dc0fef87d473dd6b5099d0' \
	--password nodeTwo/password.txt \
	--identity nodeTwo \
	config-gethTwo.json
