import {IWorldLibrary} from './world-library.interface';
import {V4Options} from '../../../node_modules/@types/uuid/interfaces';
import uuid = require('uuid');
import {illegalArgs} from '@thi.ng/errors';
import {inject, injectable, optional} from 'inversify';
import {UUID} from '../../../../src/infrastructure/validation';

@injectable()
export class V4WorldLibrary implements IWorldLibrary {
   constructor(@inject("v4options") @optional() private readonly options?: V4Options) {}

   getUuid(): UUID {
      return uuid.v4(this.options) as UUID;
   }

   fillBuffer(buffer: Buffer, offset: number = 0): void {
      if ((buffer.length - offset) < 16) {
         illegalArgs('Buffer too short');
      }

      uuid.v4(this.options, buffer, offset);
   }
}