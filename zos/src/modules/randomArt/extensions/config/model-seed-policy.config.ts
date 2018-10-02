import {Allow, MaxLength, Min, MinLength} from 'class-validator';

import {configClass, configProp} from '../../../../infrastructure/config/index';
import {BitStrategyKind} from './bit-strategy-kind.enum';
import {PrefixSelectStyle} from './prefix-select-style.enum';
import '../../../../infrastructure/reflection/index';

@configClass()
export class ModelSeedPolicy
{
   @configProp('name')
   @MinLength(3)
   @MaxLength(128)
   public readonly name: string = '';

   @configProp('bitMode')
   @Allow()
   public readonly bitMode: BitStrategyKind = BitStrategyKind.base64ToAscii;

   @configProp('prefixSelect')
   @Allow()
   public readonly prefixSelect: PrefixSelectStyle = PrefixSelectStyle.USE_X;

   @configProp('xRunsForward')
   @Allow()
   public readonly xRunsForward: boolean = true;

   @configProp('yRunsForward')
   @Allow()
   public readonly yRunsForward: boolean = true;

   @configProp('xFromBit')
   @Min(0)
   public readonly xFromBit: number = 0;

   @configProp('xToBit')
   @Min(7)
   public readonly xToBit: number = 0;

   @configProp('yFromBit')
   @Min(0)
   public readonly yFromBit: number = 0;

   @configProp('yToBit')
   @Min(7)
   public readonly yToBit: number = 0;

   @configProp('useNewModel')
   @Allow()
   public readonly useNewModel: boolean = false;
}
