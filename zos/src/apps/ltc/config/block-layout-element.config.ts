import {IsInt, IsPositive, Max, Min} from 'class-validator';
import {configProp} from '../../../config/decorator/index';
import '../../../reflection';

export class BlockLayoutElement {
   @configProp("fieldSize")
   @IsPositive()
   @IsInt()
   public readonly fieldSize: number = 0;

   @configProp("fieldOffset")
   @IsInt()
   @Min(0)
   @Max(512)
   public readonly fieldOffset: number = 0;
}