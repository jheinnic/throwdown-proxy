import {IKeyPairStagingLayout} from '../../modules/tickets/interface/internal';
import {
   DirectoryPath, PrivateKeyFilePath, PublicKeyFilePath
} from '../../modules/tickets/interface/locators/internal';
import {KeyPairLocator} from '../../modules/tickets/interface/locators';
import {injectable} from 'inversify';
import {Path} from '../../../../src/infrastructure/validation';

@injectable()
export class KeyPairLayoutFixture implements IKeyPairStagingLayout {
   public * findPrivateDirectoriesDepthFirst(_leftToRight?: boolean): IterableIterator<DirectoryPath>
   {
      return undefined;
   }

   public * findPrivateLeafDirectories(_leftToRight?: boolean): IterableIterator<DirectoryPath>
   {
      return undefined;
   }

   public * findPublicDirectoriesDepthFirst(_leftToRight?: boolean): IterableIterator<DirectoryPath>
   {
      return undefined;
   }

   public * findPublicLeafDirectories(_leftToRight?: boolean): IterableIterator<DirectoryPath>
   {
      return undefined;
   }

   public locatePrivateKeyFile(locator: KeyPairLocator): PrivateKeyFilePath
   {
      return {
         type: 'private-key-file',
         locator,
         privateKeyPath:
            `/Users/jheinnic/Documents/randomArt3/pkFixture/privateKeys/${locator.versionUuid}` as Path
      };
   }

   public locatePublicKeyFile(locator: KeyPairLocator): PublicKeyFilePath
   {
      return {
         type: 'public-key-file',
         locator,
         publicKeyPath:
            `/Users/jheinnic/Documents/randomArt3/pkFixture/publicKeys/${locator.versionUuid}` as Path
      };
   }
}