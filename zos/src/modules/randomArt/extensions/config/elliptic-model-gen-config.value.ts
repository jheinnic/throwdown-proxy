import {
   BlockMappedDigestLocator, MerkleDigestLocator, NamedElement
} from '../../../../infrastructure/merkle';
import {ec} from 'elliptic';
import {NamedVariant} from '../elliptic-model-adapter.class';

export interface EllipticModelGenConfig
{
   dirTree: IterableIterator<NamedElement<BlockMappedDigestLocator>>;
   pathIterOne: IterableIterator<NamedElement<MerkleDigestLocator>>;
   pathIterTwo: IterableIterator<NamedElement<MerkleDigestLocator>>;
   readAheadSize: number;
   outputRoot: string;
   firstGeneration?: number;
   variants: NamedVariant[];
   ecInst: ec;
}