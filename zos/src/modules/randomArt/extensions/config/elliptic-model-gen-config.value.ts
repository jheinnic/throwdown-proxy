import {NamedElement} from '../../../../infrastructure/merkle';
import {ec} from 'elliptic';
import {configClass} from '../../../../infrastructure/config';
import {NamedVariant} from './model-seed-policy.config';

@configClass()
export class EllipticModelGenConfig
{
   // dirTree: IterableIterator<NamedElement<BlockMappedDigestLocator>>;
   // pathIterOne: IterableIterator<NamedElement<MerkleDigestLocator>>;
   // pathIterTwo: IterableIterator<NamedElement<MerkleDigestLocator>>;
   readAheadSize: number;
   outputRoot: string;
   generation: number;
   variants: NamedVariant[];
   ecInst: ec;
}