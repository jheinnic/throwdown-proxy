import {MerkleDigestLocator} from './merkle-digest-locator.value';
import {MerkleLayerLocator} from './merkle-layer-locator.value';
import {BlockMappedDigestLocator} from './block-mapped-digest-locator.value';
import {BlockMappedLayerLocator} from './block-mapped-layer-locator.value';

export * from './block-mapped-subtree-locator.value';
export * from './block-mapped-digest-locator.value';
export * from './block-mapped-layer-locator.value';
export * from './merkle-digest-locator.value';
export * from './merkle-layer-locator.value';
export * from '../merkle-tree-description.value';
export * from './merkle-proof-locator.interface';
export * from './merkle-orientation-type.enum';
export * from './merkle-node-type.enum';

export type LayerFor<Node extends MerkleDigestLocator> = Node extends BlockMappedDigestLocator
   ? BlockMappedLayerLocator
   : MerkleLayerLocator;

export type NodeFor<Layer extends MerkleLayerLocator> = Layer extends BlockMappedLayerLocator
   ? BlockMappedDigestLocator
   : MerkleDigestLocator;
