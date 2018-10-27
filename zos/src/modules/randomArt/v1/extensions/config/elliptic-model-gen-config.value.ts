import {ec} from 'elliptic';
import {NamedVariant} from './named-variant.value';

export interface EllipticModelGenConfig
{
   // dirTree: IterableIterator<NamedPath<BlockMappedDigestLocator>>;
   // pathIterOne: IterableIterator<NamedPath<MerkleDigestLocator>>;
   // pathIterTwo: IterableIterator<NamedPath<MerkleDigestLocator>>;
   readAheadSize: number;
   outputRoot: string;
   firstGeneration?: number;
   variants: NamedVariant[];
   ecInst: ec;
}