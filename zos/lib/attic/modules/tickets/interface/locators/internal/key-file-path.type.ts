import {PublicKeyFilePath} from './public-key-file-path.interface';
import {PrivateKeyFilePath} from './private-key-file-path.interface';

export type KeyFilePath = PublicKeyFilePath | PrivateKeyFilePath;

export function isPubicKey(filePath: KeyFilePath): filePath is PublicKeyFilePath {
   return filePath.type === 'public-key-file';
}

export function isPrivateKey(filePath: KeyFilePath): filePath is PrivateKeyFilePath {
   return filePath.type === 'private-key-file';
}
