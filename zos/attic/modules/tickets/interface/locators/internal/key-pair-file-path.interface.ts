import {KeyPairLocator} from '../key-pair-locator.interface';

export interface KeyPairFilePath
{
   readonly type: 'key-pair-files';
   readonly locator: KeyPairLocator;
   readonly publicKeyPath: string;
   readonly privateKeyPath: string;
}