#!/bin/sh

SAMPLE='01'
./zokrates compute-witness -i waldo01.compiled -o waldo01_witness${SAMPLE}.dat -a 1015988797 227243221 73736855 598706041 2 229 321995
./zokrates generate-proof -p prove_waldo01.key -i waldo01-variables.inf -w waldo01_witness${SAMPLE}.dat > waldo01_proof${SAMPLE}-A.log 2>&1
./zokrates generate-proof -p prove_waldo01.key -i waldo01-variables.inf -w waldo01_witness${SAMPLE}.dat > waldo01_proof${SAMPLE}-B.log 2>&1

SAMPLE='02'
./zokrates compute-witness -i waldo01.compiled -o waldo01_witness${SAMPLE}.dat -a 1139690253 537516569 1682610233 592499191 0 39 29222827
./zokrates generate-proof -p prove_waldo01.key -i waldo01-variables.inf -w waldo01_witness${SAMPLE}.dat > waldo01_proof${SAMPLE}-A.log 2>&1
./zokrates generate-proof -p prove_waldo01.key -i waldo01-variables.inf -w waldo01_witness${SAMPLE}.dat > waldo01_proof${SAMPLE}-B.log 2>&1

SAMPLE='01'
./zokrates compute-witness -i waldo02.compiled -o waldo02_witness${SAMPLE}.dat -a 1015988797 227243221 73736855 598706041 2 229 321995
./zokrates generate-proof -p prove_waldo02.key -i waldo02-variables.inf -w waldo02_witness${SAMPLE}.dat > waldo02_proof${SAMPLE}-A.log 2>&1
./zokrates generate-proof -p prove_waldo02.key -i waldo02-variables.inf -w waldo02_witness${SAMPLE}.dat > waldo02_proof${SAMPLE}-B.log 2>&1

SAMPLE='02'
./zokrates compute-witness -i waldo02.compiled -o waldo02_witness${SAMPLE}.dat -a 1139690253 537516569 1682610233 592499191 0 39 29222827
./zokrates generate-proof -p prove_waldo02.key -i waldo02-variables.inf -w waldo02_witness${SAMPLE}.dat > waldo02_proof${SAMPLE}-A.log 2>&1
./zokrates generate-proof -p prove_waldo02.key -i waldo02-variables.inf -w waldo02_witness${SAMPLE}.dat > waldo02_proof${SAMPLE}-B.log 2>&1
