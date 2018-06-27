#!/bin/sh

geth \
	--nodiscover \
	--datadir nodeOne \
 	--keystore nodeOne/keystore \
	init genesis.json
