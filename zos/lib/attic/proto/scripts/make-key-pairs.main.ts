import {Command} from 'commander';
import {ec as EC} from 'elliptic';
import {IsaacCSPRNG} from '../../../../src/infrastructure/randomize/sources/index';
import * as fs from 'fs';
import * as uuid from 'uuid';
import BN = require('bn.js');

var program = new Command();
program
   .version("0.0.1")
   .usage("[options] <file>")
   .arguments("<file>")
   .option("-c, --curve <curve>", "Elliptic curve.  Default: ed25519", /^ed25519$/)
   .option("-n, --number <n>", "How many keys to create.  Default: 10", parseInt)
   .option("-a, --append", "If <file> exists, append rather than fail.  Default: false")
   .option("-p, --private <file>", "Store private keys separately in given file instead of with public key")
   .option("-i, --isaac <comma-separated number list>", "Use ISAAC with specified seed for deterministic"
      + " output", parseList)
   .option("-u, --uuid <n>", "UUID version number to roll with each public key", /^1$|^4$/)
   .option("-d, --directory <directory>", "Store public keys in UUID-based file")
   .action(runCommand)
   .parse(process.argv);

function parseList(list: string) {
   let tokens = list.split(',');
   return tokens.map(parseInt);
}

function runCommand(file: string, cmd: any) {
   if (!!cmd.append && !!cmd.private) {
      throw new Error('Append mode with separate private key file is unsupported');
   }

   fs.stat(file, (err: NodeJS.ErrnoException, stat: fs.Stats) => {
      if (!!err) {
         if (err.errno !== -2) { // ENOENT is the expected/desired error
            throw new Error(`${file} lookup failed with ${err}`);
         }
      } else if (stat.isFile()) {
         if (! cmd.append) {
            throw new Error(`${file} already exists and append mode (-a) not enabled`);
         }
      } else {
         throw new Error(`${file} already exists and is not a plain file`);
      }
   });

   if (!! cmd.private) {
      try {
         fs.statSync(cmd.private);
         throw new Error(`Private key file, ${cmd.private} already exists.`);
      } catch(err) {
         if (err.errno !== -2) {
            throw new Error(`${cmd.private} lookup failed with ${err}`);
         }
      }
   }

   let uuidFn: () => string;
   if (!!cmd.uuid) {
      if (cmd.uuid === '1') {
         uuidFn = uuid.v1;
      } else if(cmd.uuid === '4') {
         uuidFn = uuid.v4;
      } else {
         throw new Error(`${cmd.uuid} is not a valid UUID version`);
      }
   } else {
      uuidFn = uuid.v1;
   }

   const ecInst = new EC(cmd.curve || 'ed25519');
   const keyCount = cmd.number || 10;
   const isaac = (!! cmd.isaac) ? new IsaacCSPRNG(cmd.isaac) : new IsaacCSPRNG(process.pid);

   for (let ii = 0; ii < keyCount; ii++ ) {
      const keyPair = ecInst.genKeyPair({
         entropy: isaac.bytes(64),
         entropyEnc: 'binary',
         pers: undefined,
         persEnc: undefined
      });
      const privateKeyBN: BN = keyPair.getPrivate() as BN;
      // @ts-ignore
      const privateKeyStr: string = privateKeyBN.toBuffer().hexSlice(0);
      const publicKey = keyPair.getPublic();
      const publicX = publicKey.getX();
      const publicY = publicKey.getY();
      const publicXStr = publicX.toBuffer().hexSlice(0);
      const publicYStr = publicY.toBuffer().hexSlice(0);
      const uuidStr = uuidFn();

      if(!! cmd.private) {
         fs.appendFileSync(cmd.private, `${privateKeyStr}\n`);
         fs.appendFileSync(file, `${publicXStr}:${publicYStr}:${uuidStr}\n`);
      } else {
         fs.appendFileSync(file, `${privateKeyStr}:${publicXStr}:${publicYStr}:${uuidStr}\n`);
      }
   }
}
