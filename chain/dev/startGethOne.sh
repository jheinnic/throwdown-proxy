#!/bin/sh

geth \
	--nodiscover \
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
	--networkid 9999 \
	--gasprice '18000000000' \
	--unlock '0xc3e94a33aef39be9af77a001bf3dc68983d6aa01' \
	--password nodeOne/password.txt \
	--identity nodeOne 
	# config-nodeOne.json
