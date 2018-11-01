import {IsDefined, IsNotEmpty} from 'class-validator';
import {ArtworkLocator} from '../interface/locators';

export class FullArtworkContent {
   @IsDefined()
   public readonly locator: ArtworkLocator;

   @IsDefined()
   @IsNotEmpty()
   public readonly imageData: Buffer;

   constructor(template: Required<FullArtworkContent>) {
      // Object.assign(this, template);

      this.locator = template.locator;
      this.imageData = template.imageData;
   }
}