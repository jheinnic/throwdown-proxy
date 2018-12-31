import {inject, injectable} from 'inversify';
import {RECORD_LIST_TYPES} from './di';

@injectable()
export class LocalFileRecordStore {
   constructor(
      @inject(RECORD_LIST_TYPES.LocalDirectory) _localDirectory: string
   ) { }
}