import {LocationRole} from './location-role.enum';

export interface DirectoryIndex {
   type: 'directory-index'

   role: LocationRole;

   /**
    * 0-based index indicating the height (depth) at which the located directory is found.
    */
   depthLevel: number

   /**
    * 0-based index enumerating the located directory amongst all other directories at the
    * same height (depth).
    */
   levelIndex: number;
}