import {MerkleDigestLocator} from '../locator';

export interface NamedPath<T extends MerkleDigestLocator> {
   name: string;
   pathTo: T;
}