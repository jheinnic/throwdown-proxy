#!/bin/sh

docker-compose -f docker-compose-networks-geth.yml -f docker-compose-geth.yml $@
