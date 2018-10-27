import {ec} from 'elliptic';
import {configClass} from '@jchptf/config';
import {ModelSeedPolicy} from './model-seed-policy.config';

@configClass()
export class EllipticModelGenConfig
{
   // dirTree: IterableIterator<NamedElement<BlockMappedDigestLocator>>;
   // pathIterOne: IterableIterator<NamedElement<MerkleDigestLocator>>;
   // pathIterTwo: IterableIterator<NamedElement<MerkleDigestLocator>>;
   readAheadSize: number;
   outputRoot: string;
   generation: number;
   variants: ModelSeedPolicy[];
   ecInst: ec;
}