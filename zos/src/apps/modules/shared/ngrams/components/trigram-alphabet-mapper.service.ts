import { Injectable } from '@nestjs/common';
import * as path from 'path';

import { AbstractAlphabetMapper } from './abstract-alphabet-mapper.service';

@Injectable()
export class TrigramAlphabetMapper extends AbstractAlphabetMapper
{
   constructor()
   {
      super(
         path.join(__dirname, '../../../../../../english_trigrams.txt')
      );
   }
}
