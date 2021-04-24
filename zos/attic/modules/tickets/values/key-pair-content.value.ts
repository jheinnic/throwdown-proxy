import {KeyPairLocator} from '../interface/locators';

export class KeyPairContent {
   constructor(
      public readonly locator: KeyPairLocator,
      public readonly publicKeyX: Buffer,
      public readonly publicKeyY: Buffer,
      public readonly privateKey: Buffer
   ) { }
}