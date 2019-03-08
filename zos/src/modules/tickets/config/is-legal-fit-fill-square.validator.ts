import {registerDecorator, ValidationArguments} from 'class-validator';
import {CustomValidationOptions} from '../../../infrastructure/validation';
import {StringKeys} from 'simplytyped';

export function IsLegalFitFillSquare<T>(
   heightProp: String, widthProp: String, validationOptions?: CustomValidationOptions)
{
   const heightPath = heightProp.split('.');
   const widthPath = widthProp.split('.');
   return function (object: T, propertyName: StringKeys<T>) {
      registerDecorator({
         target: object.constructor,
         propertyName: propertyName,
         name: 'IsLegalFitFillSquare',
         async: false,
         options: validationOptions,
         constraints: [heightPath, widthPath],
         validator: (value: 'square' | 'fit' | 'fill' | undefined, args: ValidationArguments): boolean => {
            const anyObject = args.object as any;

            let heightVal: any = anyObject;
            for (const heightProp of args.constraints[0]) {
               heightVal = heightVal[heightProp];
            }

            let widthVal: any = anyObject;
            for (const widthProp of args.constraints[1]) {
               widthVal = widthVal[widthProp];
            }

            if ((!widthVal) || (!heightVal)) {
               return false;
            }

            return (widthVal === heightVal)
               ? ((!value) || (value === 'square'))
               : ((value === 'fit') || (value === 'fill'));
         }
      });
   };
}

// export function IsLegalFitFillSquare<T>(
//    dimensionProp: StringKeys<T>, validationOptions?: CustomValidationOptions)
// {
//    return function (object: T, propertyName: StringKeys<T>) {
//       registerDecorator({
//          target: object.constructor,
//          propertyName: propertyName,
//          name: 'IsLegalFitFillSquare',
//          async: false,
//          options: validationOptions,
//          constraints: [heightProp, widthProp],
//          validator: (value: 'square' | 'fit' | 'fill' | undefined, args: ValidationArguments): boolean => {
//             const anyObject = args.object as any;
//
//             return ((anyObject[args.constraints[0]] === anyObject[args.constraints[1]])
//                ? ((!value) || (value === 'square'))
//                : ((value === 'fit') || (value === 'fill')));
//          }
//       });
//    };
// }