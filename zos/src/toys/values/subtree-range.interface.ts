import {BoundKind} from './bound-kind.enum';

export interface LayerRange {
   readonly layerDepth: number;
   readonly fromOffset: number;
   readonly fromBoundKind: BoundKind;
   readonly toOffset: number;
   readonly toBoundKind: BoundKind;
}