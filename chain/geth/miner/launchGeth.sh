#!/bin/sh

ls /var
ls /var/geth
ls /var/geth/data
mkdir -p /var/geth/data
rm /var/geth/data/nodekey

if test ! -e /var/geth/data/nodekey; then /opt/geth/bin/bootnode -genkey /var/geth/data/nodekey; echo "New nodekey"; else echo "Reused nodekey"; fi;

chmod 400 /var/geth/data/nodekey

/opt/geth/bin/geth $@
