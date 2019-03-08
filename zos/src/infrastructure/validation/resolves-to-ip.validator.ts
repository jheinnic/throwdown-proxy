import {registerDecorator, ValidatorConstraint, ValidatorConstraintInterface} from 'class-validator';
import {lookup} from 'dns';
import {promisify} from 'util';

import {CustomValidationOptions} from './custom-validation-options.interface';

@ValidatorConstraint({async: false})
export class ResolvesToIpValidator implements ValidatorConstraintInterface
{
   private readonly lookup = promisify(lookup);

   async validate(value: string /*, args: ValidationArguments*/): Promise<boolean>
   {
      try {
         let result = await this.lookup(value, {all: true});
         console.log(result);
         return result.address.length > 0;
      } catch(error) {
         console.error(error);
         return false;
      }
   }
}

export function ResolvesToIP(validationOptions?: CustomValidationOptions)
{
   return function (object: Object, propertyName: string) {
      registerDecorator({
         target: object.constructor,
         propertyName: propertyName,
         options: validationOptions,
         constraints: [],
         async: true,
         validator: ResolvesToIpValidator
      });
   };
}