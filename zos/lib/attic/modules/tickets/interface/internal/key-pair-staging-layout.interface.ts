import {DirectoryPath, PrivateKeyFilePath, PublicKeyFilePath} from '../locators/internal';
import {KeyPairLocator} from '../locators';

export interface IKeyPairStagingLayout {
   locatePublicKeyFile(locator: KeyPairLocator): PublicKeyFilePath

   locatePrivateKeyFile(locator: KeyPairLocator): PrivateKeyFilePath

   findPublicDirectoriesDepthFirst(leftToRight?: boolean): IterableIterator<DirectoryPath>;

   findPrivateDirectoriesDepthFirst(leftToRight?: boolean): IterableIterator<DirectoryPath>;

   findPublicLeafDirectories(leftToRight?: boolean): IterableIterator<DirectoryPath>;

   findPrivateLeafDirectories(leftToRight?: boolean): IterableIterator<DirectoryPath>;
}