import {BlockMappedDigestLocator} from '../../../infrastructure/merkle/locator';

export interface Directories
{
   type: 'directory'
   publicKeyDir: string;
   privateKeyDir: string;
   imageStoreDir: string;
   merkleBlock: BlockMappedDigestLocator;
}