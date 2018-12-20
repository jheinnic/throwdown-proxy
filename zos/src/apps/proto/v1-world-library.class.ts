import {illegalArgs} from '@thi.ng/errors';
import {V1Options} from 'uuid/interfaces';
import uuid = require('uuid');

import {IWorldLibrary} from './world-library.interface';

export class V1WorldLibrary implements IWorldLibrary {
   constructor(private readonly options: V1Options) {}

   getUuid(): string {
      return uuid.v1(this.options);
   }

   fillBuffer(buffer: Buffer, offset: number = 0): void {
      if ((buffer.length - offset) < 16) {
         illegalArgs('Buffer too short');
      }

      uuid.v1(this.options, buffer, offset);
   }
}