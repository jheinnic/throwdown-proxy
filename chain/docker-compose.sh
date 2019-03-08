#!/bin/sh

docker-compose -f docker-compose-networks.yml -f docker-compose-consul.yml -f docker-compose-keycloak.yml -f docker-compose-treegateway.yml -f docker-compose-geth.yml -f docker-compose-vault.yml $@
