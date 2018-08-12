#!/bin/sh

./zokrates compile -i nck.source -o nck.compiled

./zokrates setup -i nck.compiled -m nck-variables.inf -p proving.key -v verify.key 

./zokrates export-verifier -i verify.key -o Verifier.sol

./zokrates compute-witness -i nck.compiled -o witness01.dat -a 6 3

./zokrates generate-proof -p proving.key -i nck-variables.inf  -w witness01.dat > proof.log 2>&1
