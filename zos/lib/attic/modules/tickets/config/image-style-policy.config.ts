import {IsIn, IsInt, IsPositive, MaxLength, Min, MinLength, ValidateNested} from 'class-validator';

import '@jchptf/reflection';
import {configClass, configProp} from '@jchptf/di-app-registry';
import {Name} from '../../../../../src/infrastructure/validation';
import {IsLegalFitFillSquare} from './is-legal-fit-fill-square.validator';
import {PixelDimensions} from './pixel-dimensions.config';

@configClass()
export class ImageStylePolicy {
   @configProp('name')
   @MinLength(3)
   @MaxLength(128)
   public readonly name: Name = '' as Name;

   @configProp('fullSize')
   @ValidateNested()
   public readonly fullSize: PixelDimensions = new PixelDimensions();

   @configProp('thumbnail')
   @ValidateNested()
   // TODO: IsProportional Constraint
   public readonly thumbnail: PixelDimensions = new PixelDimensions();

   @configProp('unitScale')
   @Min(1.0)
   public readonly unitScale: number = 0;

   @configProp('previewPixel')
   // TODO: IsDivisorOf
   @IsPositive()
   @IsInt()
   public readonly previewPixel: number = 0;

   @IsLegalFitFillSquare<ImageStylePolicy>('fullSize.pixelHeight', 'fullSize.pixelWidth')
   @IsIn(['square', 'fit', 'fill', undefined])
   @configProp('fitOrFill')
   public readonly fitOrFill: 'square' | 'fit' | 'fill' = 'square';
}

