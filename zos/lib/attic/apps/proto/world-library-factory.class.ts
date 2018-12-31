import {IWorldLibraryFactory} from './world-library-factory.interface';
import {V1Options, V4Options} from 'uuid/interfaces';
import {V1WorldLibrary} from './v1-world-library.class';
import {V4WorldLibrary} from './v4-world-library.class';

export class WorldLibraryFactory implements IWorldLibraryFactory {
   public initV1Library(options: V1Options)
   {
      return new V1WorldLibrary(options);
   }

   public initV4Library(options: V4Options)
   {
      return new V4WorldLibrary(options);
   }
}