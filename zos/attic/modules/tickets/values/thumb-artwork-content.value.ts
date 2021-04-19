import {IsDefined, IsNotEmpty} from 'class-validator';
import {TicketArtworkLocator} from '../interface/locators';

export class ThumbArtworkContent {
   @IsDefined()
   public readonly locator: TicketArtworkLocator;

   @IsDefined()
   @IsNotEmpty()
   public readonly imageData: Buffer;

   constructor(template: Required<ThumbArtworkContent>) {
      // Object.assign(this, template);

      this.locator = template.locator;
      this.imageData = template.imageData;
   }
}