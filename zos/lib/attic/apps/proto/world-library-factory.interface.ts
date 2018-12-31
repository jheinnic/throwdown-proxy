import {V1Options, V4Options} from 'uuid/interfaces';
import {IWorldLibrary} from './v1-world-library.class';

export interface IWorldLibraryFactory {
   initV1Library(options: V1Options): IWorldLibrary;

   initV4Library(options: V4Options): IWorldLibrary;
}