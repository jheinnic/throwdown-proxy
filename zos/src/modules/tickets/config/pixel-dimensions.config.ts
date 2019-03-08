import {IsInt, IsPositive} from 'class-validator';

import '@jchptf/reflection';
import {configClass, configProp} from '@jchptf/di-app-registry';

@configClass()
export class PixelDimensions {
   @configProp('pixelWidth')
   @IsPositive()
   @IsInt()
   public readonly pixelWidth: number = 0;

   @configProp('pixelWidth')
   @IsPositive()
   @IsInt()
   public readonly pixelHeight: number = 0;
}

