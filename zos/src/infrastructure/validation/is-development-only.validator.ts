import {
   registerDecorator, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface
} from 'class-validator';
import {CustomValidationOptions} from './custom-validation-options.interface';

@ValidatorConstraint({async: false})
export class IsDevelopmentOnlyValidator implements ValidatorConstraintInterface
{
   validate(value: any /*, args: ValidationArguments*/ ): boolean
   {
      // Fail iff NODE_ENV is not 'development' and also 'value' is not undefined.
      return (process.env.NODE_ENV === 'development') || (!value);
   }

   defaultMessage(args: ValidationArguments): string {
      return `${args.property} is only validly set in development mode`;
   }
}

export function IsDevelopmentOnly(validationOptions?: CustomValidationOptions)
{
   return function (object: Object, propertyName: string) {
      registerDecorator({
         target: object.constructor,
         propertyName: propertyName,
         name: 'FOR_DEVELOPMENT_ONLY',
         async: false,
         options: validationOptions,
         constraints: [],
         validator: IsDevelopmentOnlyValidator
      });
   };
}