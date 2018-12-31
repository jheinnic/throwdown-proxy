import {KeyPairLocator} from '../key-pair-locator.interface';
import {Path} from '../../../../../infrastructure/validation';

export interface PrivateKeyFilePath
{
   readonly type: 'private-key-file';
   readonly locator: KeyPairLocator;
   readonly privateKeyPath: Path;
}