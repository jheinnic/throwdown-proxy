import {Command} from 'commander';
import {ec as EC} from 'elliptic';
import {IsaacCSPRNG} from '../../../../src/infrastructure/randomize/sources/index';
import * as fs from 'fs';
import * as uuid from 'uuid';
import BN = require('bn.js');
import * as path from 'path';

var program = new Command();
program
   .version("0.0.1")
   .usage("[options] <directory> <file>")
   .arguments("<directory> <file>")
   .option("-c, --curve <curve>", "Elliptic curve.  Default: ed25519", /^ed25519$/)
   .option("-n, --number <n>", "How many keys to create.  Default: 10", parseInt)
   .option("-i, --isaac <comma-separated number list>", "Use ISAAC with specified seed for deterministic"
      + " output", parseList)
   .option("-u, --uuid <n>", "UUID version number to roll with each public key", /^1$|^4$/)
   .action(runCommand)
   .parse(process.argv);

function parseList(list: string) {
   let tokens = list.split(',');
   return tokens.map(parseInt);
}

function runCommand(directory: string, file: string, cmd: any) {
   fs.stat(file, (err: NodeJS.ErrnoException, stat: fs.Stats) => {
      if (!!err) {
         if (err.errno !== -2) { // ENOENT is the expected/desired error
            throw new Error(`${file} lookup failed with ${err}`);
         }
      } else if (stat.isFile()) {
         throw new Error(`${file} already exists`);
      } else {
         throw new Error(`${file} already exists and is not a plain file`);
      }
   });

   fs.stat(directory, (err: NodeJS.ErrnoException, stat: fs.Stats) => {
      if (!!err) {
         if (err.errno !== -2) { // ENOENT is the expected/desired error
            throw new Error(`${directory} lookup failed with ${err}`);
         }
         fs.mkdirSync(directory, 0o755);
      } else if (! stat.isDirectory()) {
         throw new Error(`${directory} already exists, and is not a directory`);
      }
   });

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

      fs.appendFileSync(
         path.join(directory, `${uuidStr}.private`), `${privateKeyStr}\n`);
      fs.appendFileSync(
         path.join(directory, `${uuidStr}.public`), `${publicXStr}:${publicYStr}\n`);
      fs.appendFileSync(file, `${uuidStr}\n`);
   }
}
