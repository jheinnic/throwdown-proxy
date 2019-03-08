import {
   registerDecorator, ValidatorConstraint, ValidatorConstraintInterface
} from 'class-validator';
import {CustomValidationOptions} from './custom-validation-options.interface';
import {PrizeTier} from '../../apps/oldConfig';

@ValidatorConstraint({async: false})
export class HasUniquePrizeTierIdsValidator implements ValidatorConstraintInterface
{

   validate(prizeTiers: PrizeTier[] /*, args: ValidationArguments*/ ): boolean
   {
      const idsSeen = new Set<number>();
      for (let prizeTier of prizeTiers) {
         if (idsSeen.has(prizeTier.tierId)) {
            return false;
         }
         idsSeen.add(prizeTier.tierId);
      }

      return true;
   }

}

export function HasUniquePrizeTierIds(validationOptions?: CustomValidationOptions)
{
   return function (object: Object, propertyName: string) {
      registerDecorator({
         target: object.constructor,
         propertyName: propertyName,
         options: validationOptions,
         constraints: [],
         validator: HasUniquePrizeTierIdsValidator
      });
   };
}