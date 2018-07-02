#!/bin/sh

/opt/geth/bin/geth --datadir /var/geth/data --keystore /var/geth/keystore --preload /opt/geth/bin/console-utils.js attach
