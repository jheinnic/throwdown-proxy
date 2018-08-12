#!/bin/sh

NODE_DIR=/Users/jheinnic/Git/throwdown-proxy/block/nodeOne

geth --datadir ${NODE_DIR} --networkid 3378010 --unlock '0x13b285a259f914f257ee899e67bdb5f4171134a7' --unlock '0xb28d31d483f49527ee096044dbe5a7d8e0e428bc' --unlock '0x56d9571435aab8f9d38046dbb605c703fef29d9e' --password ${NODE_DIR}/password.txt --targetgaslimit 18223372036854776000 --preload console-utils.js attach
