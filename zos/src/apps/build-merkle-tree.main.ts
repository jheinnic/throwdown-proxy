import {MerkleTreeDescription} from '../merkle/merkle-tree-description.class';
import {MerkleCalculator} from '../merkle/merkle-calculator.class';
import {BlockMappedSubtreeLocator} from '../merkle/locator/block-mapped-subtree-locator.interface';

const treeDescriptor: MerkleTreeDescription = new MerkleTreeDescription(256, 256, 8192, 1900005);
const merkleCalculator: MerkleCalculator = new MerkleCalculator(treeDescriptor);

merkleCalculator.getTreeAssemblyBlockOrder().subscribe((mappedBlock: BlockMappedSubtreeLocator) => {
   console.log(mappedBlock);
});