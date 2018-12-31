import {inject, injectable} from 'inversify';
import LRU = require('lru-cache');

@injectable()
export class MerkleTree {
   constructor(
      @inject(LRU) private readonly lruCache: LRU
   ) {
      console.log(this.lruCache);
   }
}