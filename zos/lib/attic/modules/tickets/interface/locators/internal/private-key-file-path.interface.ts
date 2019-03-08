import {KeyPairLocator} from '../key-pair-locator.interface';
import {Path} from '../../../../../../../src/infrastructure/validation';

export interface PrivateKeyFilePath
{
   readonly type: 'private-key-file';
   readonly locator: KeyPairLocator;
   readonly privateKeyPath: Path;
}