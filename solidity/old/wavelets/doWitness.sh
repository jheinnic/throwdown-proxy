#!/bin/sh

SAMPLE='01'
./zokrates compute-witness -i wavelets01.compiled -o wavelets01_witness${SAMPLE}.dat -a 41636 1384 10888 841 21357 5432 31355 20790
./zokrates generate-proof -p prove_wavelets01.key -i wavelets01-variables.inf -w wavelets01_witness${SAMPLE}.dat > wavelets01_proof${SAMPLE}-A.log 2>&1
./zokrates generate-proof -p prove_wavelets01.key -i wavelets01-variables.inf -w wavelets01_witness${SAMPLE}.dat > wavelets01_proof${SAMPLE}-B.log 2>&1

SAMPLE='02'
./zokrates compute-witness -i wavelets02.compiled -o wavelets02_witness${SAMPLE}.dat -a 24421 12209 13282 7492 27987 12209 11642 351
./zokrates generate-proof -p prove_wavelets02.key -i wavelets02-variables.inf -w wavelets02_witness${SAMPLE}.dat > wavelets02_proof${SAMPLE}-A.log 2>&1
./zokrates generate-proof -p prove_wavelets02.key -i wavelets02-variables.inf -w wavelets02_witness${SAMPLE}.dat > wavelets02_proof${SAMPLE}-B.log 2>&1
