import {IsDefined, IsNotEmpty} from 'class-validator';
import {ArtworkLocator} from '../interface/locators';

export class ArtworkPairContent {
   @IsDefined()
   public readonly locator: ArtworkLocator;

   @IsDefined()
   @IsNotEmpty()
   public readonly fullImageData: Buffer;

   @IsDefined()
   @IsNotEmpty()
   public readonly thumbImageData: Buffer;

   constructor(template: Required<ArtworkPairContent>) {
      // Object.assign(this, template);

      this.locator = template.locator;
      this.fullImageData = template.fullImageData;
      this.thumbImageData = template.thumbImageData;
   }
}