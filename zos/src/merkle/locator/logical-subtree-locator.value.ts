import {MerkleDigestLocator} from './merkle-digest-locator.interface';
import {MerkleSeriesLocator} from './merkle-series-locator.interface';
import {MerkleOrientationType} from '../merkle-orientation-type.enum';
import {MerkleLayerLocator} from './merkle-layer-locator.interface';

export class LogicalSubtreeLocator {
   constructor( public readonly root: MerkleDigestLocator, public readonly leafRange: MerkleSeriesLocator) {
      if (leafRange.depth < root.depth) {
         throw new Error('Leaf layer cannot be above the root node');
      }
      // if (leafRange.treeDescription != root.treeDescription) {
      //    throw new Error('Leaf range and root must come from the same tree');
      // }
   }

   public get orientation(): MerkleOrientationType {
      return this.root.orientation;
   }

   public get rootLayer(): MerkleLayerLocator {
      return this.root.layer;
   }

   public get rootDepth(): number {
      return this.root.depth;
   }

   public get rootIndex(): number
   {
      return this.root.index;
   }

   public get rootPosition(): number
   {
      return this.root.position;
   }

   public get leafLayer(): MerkleLayerLocator {
      return this.leafRange.layer;
   }

   public get leafDepth(): number {
      return this.leafRange.depth;
   }

   public get width(): number {
      return this.leafRange.width;
   }

   public get leftLeafPosition() {
      return this.leafRange.leftPosition;
   }

   public get leftLeafSpan() {
      return this.leafRange.leftSpan;
   }

   public get rightLeafPosition() {
      return this.leafRange.rightPosition;
   }

   public get rightLeafSpan() {
      return this.leafRange.rightSpan;
   }

   // public get treeDescription(): MerkleTreeDescription {
   //    return this.leafRange.treeDescription;
   // }

   // readonly subtreeType?: MerkleSubtreeType;
}