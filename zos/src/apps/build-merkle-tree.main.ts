import LRU from 'lru-cache';
import {MerkleCalculator} from '../merkle'
import {MerkleLocatorFactory} from '../merkle/merkle-locator-factory.service';
import {BlockMappedSubtreeLocator, MerkleDigestLocator, MerkleTreeDescription} from '../merkle/locator';

const treeDescriptor: MerkleTreeDescription = new MerkleTreeDescription(256, 256, 8192, 1900005);
// const treeDescriptor: MerkleTreeDescription = new MerkleTreeDescription(256, 256, 8192, 1280 * 32);
const lruCache: LRU.Cache<number, MerkleDigestLocator> =
   new LRU<number, MerkleDigestLocator>(Math.pow(2,12));

const merkleLocatorFactory: MerkleLocatorFactory = new MerkleLocatorFactory(treeDescriptor, lruCache);
const merkleCalculator: MerkleCalculator = new MerkleCalculator(treeDescriptor, merkleLocatorFactory);

merkleCalculator.getTreeAssemblyBlockOrder().subscribe((mappedBlock: BlockMappedSubtreeLocator) => {
   console.log([mappedBlock.level, mappedBlock.offset, mappedBlock.merkleSubtree.root]);
});