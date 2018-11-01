import {KeyPairLocator} from '../key-pair-locator.interface';
import {Path} from '../../../../../infrastructure';

export interface PublicKeyFilePath
{
   readonly type: 'public-key-file';
   readonly locator: KeyPairLocator;
   readonly publicKeyPath: Path;
}