import {ChildType} from './values/child-type.enum';

interface TreeNodeValue {
   readonly nodeDepth: number;
   readonly absoluteIndex: number
   readonly layerIndex: number;
   readonly childType: ChildType;
}