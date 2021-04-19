import {IsDefined, IsNotEmpty} from 'class-validator';
import {TicketArtworkLocator} from '../interface/locators';

export class FullArtworkContent {
   @IsDefined()
   public readonly locator: TicketArtworkLocator;

   @IsDefined()
   @IsNotEmpty()
   public readonly imageData: Buffer;

   constructor(template: Required<FullArtworkContent>) {
      // Object.assign(this, template);

      this.locator = template.locator;
      this.imageData = template.imageData;
   }
}