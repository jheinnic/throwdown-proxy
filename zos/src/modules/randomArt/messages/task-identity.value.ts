import {Name, Path, UUID} from '../../../infrastructure/validation';

export interface TaskIdentity
{
   readonly locatorPath: Path;
   readonly renderPolicy: Name;
   readonly configVersion: UUID;
}


