import {KeyPairLocator} from '../key-pair-locator.interface';

export interface PrivateKeyFilePath
{
   readonly type: 'private-key-file';
   readonly locator: KeyPairLocator;
   readonly privateKeyPath: string;
}