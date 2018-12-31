import {LocationRole} from './location-role.enum';
import {Path} from '../../../../../infrastructure/validation/path.type';

export interface DirectoryPath {
   type: 'directory-path';
   role: LocationRole;
   path: Path;
}