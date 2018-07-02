#!/bin/sh

./zokrates compile -i waldo01.source -o waldo01.compiled
./zokrates setup -i waldo01.compiled -m waldo01-variables.inf -p prove_waldo01.key -v verify_waldo01.key 
./zokrates export-verifier -i verify_waldo01.key -o Waldo01Verifier.sol

./zokrates compile -i waldo02.source -o waldo02.compiled
./zokrates setup -i waldo02.compiled -m waldo02-variables.inf -p prove_waldo02.key -v verify_waldo02.key 
./zokrates export-verifier -i verify_waldo02.key -o Waldo02Verifier.sol
