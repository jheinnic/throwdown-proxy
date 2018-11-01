import {KeyPairLocator} from '../key-pair-locator.interface';

export interface KeyPairFile
{
   readonly type: 'key-pair-files';
   readonly locator: KeyPairLocator;
   readonly publicKeyPath: string;
   readonly privateKeyPath: string;
}