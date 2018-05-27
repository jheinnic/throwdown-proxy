#!/bin/sh

geth --datadir ./nodeOne --keystore nodeOne/keystore --syncmode 'full' --port 30311 --rpc --rpcaddr 'localhost' --rpcport 8501 --rpcapi 'personal,db,eth,net,web3,txpool,miner' --ws --wsaddr 'localhost' --wsport 8601 --wsapi 'personal,db,eth,net,web3,txpool,miner' --bootnodesv4 'enode://b14a98809a7459485b35d479a7455210c4910f0b49ab9a111d5c8169986571a2002d4303c549a8c7b70932bb69db31a996db583bcb16b84fc8cb4500cec20931@192.168.5.3:30310,enode://8334ba69ddccd58be4226846797c72f350e11efd0223045223dfc1358b356c3132c8e908ed81ee3f25067932163d41f221cb399b3653724f0fd51f6b7e27055c@192.168.5.3:30312' --networkid 39448701 --gasprice '1' --unlock '0xc3e94a33aef39be9af77a001bf3dc68983d6aa01' --password nodeOne/password.txt --mine --v5disc --identity 036defc0eb63413e

