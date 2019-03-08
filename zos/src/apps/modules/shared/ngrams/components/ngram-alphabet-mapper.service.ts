import * as path from 'path';
import { Injectable } from '@nestjs/common';

import { AbstractAlphabetMapper } from './abstract-alphabet-mapper.service';

@Injectable()
export class NgramAlphabetMapper extends AbstractAlphabetMapper
{
   constructor()
   {
      super(
         path.join(__dirname, '../../../../../../english_ngrams_short.txt'),
         250000
      );
   }
}
