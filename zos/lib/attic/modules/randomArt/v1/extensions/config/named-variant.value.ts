import {BitStrategyKind} from './bit-strategy-kind.enum';
import {PrefixSelectStyle} from './prefix-select-style.enum';
// import {configClass} from '../../../../infrastructure/config/decorator';

// @configClass()
export interface NamedVariant
{
   nameExtension: string;
   bitMode: BitStrategyKind;
   prefixSelect: PrefixSelectStyle;
   xRunsForward: boolean;
   yRunsForward: boolean;
   xFromBit: number;
   xToBit: number;
   yFromBit: number;
   yToBit: number;
   useNewModel: boolean;
}
