import {IsIn, IsInt, IsPositive, MaxLength, Min, MinLength} from 'class-validator';

import {configClass, configProp} from '../../../../infrastructure/config/index';
import {IsLegalFitFillSquare} from '../../messages/is-legal-fit-fill-square.validator';
import '../../../../infrastructure/reflection/index';

@configClass()
export class ImageFieldPolicy {
   @configProp('name')
   @MinLength(3)
   @MaxLength(128)
   public readonly name: string = '';

   @configProp('pixelWidth')
   @IsPositive()
   @IsInt()
   public readonly pixelWidth: number = 0;

   @configProp('pixelWidth')
   @IsPositive()
   @IsInt()
   public readonly pixelHeight: number = 0;

   @configProp('unitScale')
   @Min(1.0)
   public readonly unitScale: number = 0;

   @IsLegalFitFillSquare<ImageFieldPolicy>('pixelHeight', 'pixelWidth')
   @IsIn(['square', 'fit', 'fill', undefined])
   @configProp('fitOrFill')
   public readonly fitOrFill: 'square' | 'fit' | 'fill' = 'square';
}

