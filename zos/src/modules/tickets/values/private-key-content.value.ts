import {IsByteLength, IsDefined} from 'class-validator';
import {KeyPairLocator} from '../interface/locators';

export class PrivateKeyContent {
   @IsDefined()
   public readonly locator: KeyPairLocator;

   @IsByteLength(256)
   public readonly privateKey: Buffer;

   constructor(template: Required<PrivateKeyContent>) {
      // Object.assign(this, template);

      this.locator = template.locator;
      this.privateKey = template.privateKey;
   }
}