#!/bin/sh

./cdh.sh stop geth-miner-1 geth-miner-2 geth-miner-3
./cdh.sh rm geth-miner-1 geth-miner-2 geth-miner-3
docker volume ls | grep chain | egrep 'geth-key|geth-data' | awk '{print $2}' | xargs -I {} docker volume rm {}

sleep 1

./cdh.sh up --build
