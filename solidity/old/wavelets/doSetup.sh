#!/bin/sh

./zokrates compile -i wavelets01.source -o wavelets01.compiled
./zokrates setup -i wavelets01.compiled -m wavelets01-variables.inf -p prove_wavelets01.key -v verify_wavelets01.key 
./zokrates export-verifier -i verify_wavelets01.key -o Wavelets01Verifier.sol

./zokrates compile -i wavelets02.source -o wavelets02.compiled
./zokrates setup -i wavelets02.compiled -m wavelets02-variables.inf -p prove_wavelets02.key -v verify_wavelets02.key 
./zokrates export-verifier -i verify_wavelets02.key -o Wavelets02Verifier.sol
