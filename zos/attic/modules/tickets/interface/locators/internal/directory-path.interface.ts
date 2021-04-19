import {LocationRole} from './location-role.enum';
import {Path} from '../../../../../infrastructure/validation';

export interface DirectoryPath {
   type: 'directory-path';
   role: LocationRole;
   path: Path;
}