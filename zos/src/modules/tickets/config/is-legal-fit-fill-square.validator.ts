import {registerDecorator, ValidationArguments} from 'class-validator';
import {CustomValidationOptions} from '../../../infrastructure/validation';
import {StringKeys} from 'simplytyped';

export function IsLegalFitFillSquare<T>(
   heightProp: StringKeys<T>, widthProp: StringKeys<T>, validationOptions?: CustomValidationOptions)
{
   return function (object: T, propertyName: StringKeys<T>) {
      registerDecorator({
         target: object.constructor,
         propertyName: propertyName,
         name: 'IsLegalFitFillSquare',
         async: false,
         options: validationOptions,
         constraints: [heightProp, widthProp],
         validator: (value: 'square' | 'fit' | 'fill' | undefined, args: ValidationArguments): boolean => {
            const anyObject = args.object as any;

            return ((anyObject[args.constraints[0]] === anyObject[args.constraints[1]])
               ? ((!value) || (value === 'square'))
               : ((value === 'fit') || (value === 'fill')));
         }
      });
   };
}