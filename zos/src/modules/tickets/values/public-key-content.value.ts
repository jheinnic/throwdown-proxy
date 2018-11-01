import {IsByteLength, IsDefined} from 'class-validator';
import {KeyPairLocator} from '../interface/locators';

export class PublicKeyContent {
   @IsDefined()
   public readonly locator: KeyPairLocator;

   @IsByteLength(256)
   public readonly publicKeyX: Buffer;

   @IsByteLength(256)
   public readonly publicKeyY: Buffer;

   constructor(template: Required<PublicKeyContent>) {
      // Object.assign(this, template);

      this.locator = template.locator;
      this.publicKeyX = template.publicKeyX;
      this.publicKeyY = template.publicKeyY;
   }
}