// import {inject, injectable} from 'inversify';
import {RANDOM_ART_TYPES} from '../di/types';
import {Path} from '../../../../../src/infrastructure/validation';
import {ICanvasPathMapper} from '../interface/canvas-path-mapper.interface';
import {TicketArtworkLocator} from '../../tickets/interface/locators';
import * as path from 'path';
import * as crypto from 'crypto';

// @injectable()
export class CanvasPathMapper implements ICanvasPathMapper
{
   constructor(
      /*@inject(RANDOM_ART_TYPES.RootPathName)*/ private readonly rootPathName: Path)
   { }

   public mapToPath(artwork: TicketArtworkLocator): Path
   {

      return path.join(
         this.rootPathName, `${artwork.slotIndex}`) as path;
   }
}
