import {IsDefined, IsNotEmpty} from 'class-validator';
import {TicketArtworkLocator} from '../interface/locators';

export class ArtworkPairContent {
   @IsDefined()
   public readonly locator: TicketArtworkLocator;

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