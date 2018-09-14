import {MerkleLayerLocator} from './merkle-layer-locator.value';
import {MerkleTreeDescription} from './merkle-tree-description.value';

export class MerkleSeriesLocator
{
   public readonly width: number;
   /**
    * A zero-based index for locating a node by layer.  The root node is at index 0 of layer 0,
    * and its immediate children are at indices 0 and 1 of layer 1.  All leaf nodes are found at
    * a layer depth equal to the height (or depth) of the tree in which they are located, at
    * layer indices ranging from 0 to ((2^depth) - 1).
    */
   readonly _depth: number;

   /**
    * Zero-based index for locating left-most node of a referenced series in its host tree.
    *
    * Whereas leftSpan is an index among nodes on the same layer, leftPosition is an index
    * into all the nodes across all layers.
    */
   readonly _leftPosition: number;

   /**
    * Zero-based index for locating right-most node of a referenced series in its host tree.
    *
    * Whereas rightSpan is an index among nodes on the same layer, rightPosition is an index
    * into all the nodes across all layers.
    */
   readonly _rightPosition: number;

   public constructor(
      public readonly layer: MerkleLayerLocator,
      public readonly leftSpan: number,
      public readonly rightSpan: number) {
      if (rightSpan < leftSpan) {
         throw new Error('Right span cannot be to the left of left span');
      }
      if (leftSpan < 0) {
         throw new Error('Left span cannot be negative');
      }

      this.width = rightSpan + 1 - leftSpan;
      if (this.width > layer.width) {
         throw new Error('Left span and right span width cannot exceed ' + layer.width);
      }

      this._depth = layer.depth;
      this._leftPosition = layer.leftPosition + leftSpan;
      this._rightPosition = layer.leftPosition + rightSpan;
   }

   // public get treeDescription(): MerkleTreeDescription {
   //    return this.layer.treeDescription;
   // }

   public get depth(): number {
      return this._depth;
   }

   public get leftPosition(): number {
      return this._leftPosition;
   }

   public get rightPosition(): number {
      return this._rightPosition;
   }
}
