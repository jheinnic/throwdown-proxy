import {
   registerDecorator, ValidationOptions, ValidatorConstraint,
   ValidatorConstraintInterface
} from 'class-validator';
import {PrizeTier} from '../../apps/config';

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
      }

      return true;
   }

}

export function HasUniquePrizeTierIds(validationOptions?: ValidationOptions)
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