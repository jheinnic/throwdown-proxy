// <reference file="../../../../typings/hash.js/index.d.ts">
import { Injectable } from '@nestjs/common';
import { HmacDrbgSeed } from './hmac-drbg-seed.interface';
import { IPseudoRandomSeedFactory, IPseudoRandomSource } from '../interface';
import { HmacDrbgPseudoRandomSource } from './hmac-drbg-pseudo-random-source.class';
import { ConstructorFor } from 'simplytyped';
import * as crypto from 'crypto';
import { hash }  from 'hash.js';
// import HashJs = require('../../../../typings/hash.js');
// import HashJs = require('hash.js');

@Injectable()
export class HmacDrbgPseudoRandomSourceFactory implements IPseudoRandomSeedFactory
{
   private seedSource: HmacDrbgSeed = {
      entropyWord: crypto.randomBytes(32),
      nonceWord: crypto.randomBytes(16),
      additionalEntropy: [ crypto.randomBytes(8) ]
   };

   public seedGenerator(seedSource: HmacDrbgSeed): IPseudoRandomSource
   {
      this.seedSource = seedSource;
      return new HmacDrbgPseudoRandomSource({
         hash: hash.sha256 as unknown as ConstructorFor<hash.Sha256>,
         entropy: this.seedSource.entropyWord.toString('hex'),
         nonce: this.seedSource.nonceWord.toString('hex'),
         minEntropy: 256
      });
   }

   // TODO: I don't recall what the semantics were for re-seeding HmacDrbg, but I am
   //       certain what's implemented below is incorrect--I've just cobbled it together
   //       to get the rest of what's here to compile.
   public async seedNextSource(): Promise<IPseudoRandomSource>
   {
      return new HmacDrbgPseudoRandomSource<Sha256>({
         hash: HashJs.sha256 as unknown as ConstructorFor<Sha256>,
         entropy: this.seedSource.entropyWord.toString('hex'),
         nonce: this.seedSource.nonceWord.toString('hex'),
         minEntropy: 256
      });
   }

}