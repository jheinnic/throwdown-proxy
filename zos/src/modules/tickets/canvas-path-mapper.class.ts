import {RANDOM_ART_TYPES} from '../randomArt/di/types';
import {Path} from '../../infrastructure/validation';
import {ICanvasPathMapper} from './interface/canvas-path-mapper.interface';
import {TicketArtworkLocator} from './interface/locators';
import * as path from 'path';
import * as crypto from 'crypto';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CanvasPathMapper implements ICanvasPathMapper
{
   constructor(
      @Inject(RANDOM_ART_TYPES.RootPathName) private readonly rootPathName: Path)
   { }

   public mapToPath(artwork: TicketArtworkLocator): Path
   {

      return path.join(
         this.rootPathName, `${artwork.slotIndex}`) as Path;
   }
}
