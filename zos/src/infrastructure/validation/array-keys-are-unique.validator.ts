import {registerDecorator, ValidationArguments} from 'class-validator';
import {CustomValidationOptions} from './custom-validation-options.interface';

export function ArrayKeysAreUnique(
   selector: (value: any) => string|number, validationOptions?: CustomValidationOptions)
{
   return function (object: Object, propertyName: string) {
      registerDecorator({
         target: object.constructor,
         propertyName: propertyName,
         name: 'ARRAY_KEYS_ARE_UNIQUE',
         async: false,
         options: validationOptions,
         constraints: [selector],
         validator: {
            validate: (values: any[], args: ValidationArguments) => {
               const selector = args.constraints[0] as ((value: any) => string|number);
               const idsSeen = new Set<string|number>();
               for (let value of values) {
                  const key = selector(value);

                  if (idsSeen.has(key)) {
                     return false;
                  }
                  idsSeen.add(key);
               }

               return true;
            }
         }
      });
   };
}