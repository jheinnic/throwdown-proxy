import {registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments} from "class-validator";
import {PrizeTier} from '../config/values/prize-tier.value':;

@ValidatorConstraint({ async: false })
export class HasUniquePrizeIds implements ValidatorConstraintInterface {

   validate(prizeTiers: PrizeTier[], args: ValidationArguments): boolean {
      const idsSeen = new Set<number>();
      for (prizeTier of prizeTiers) {
         if (idsSeen.has(prizeTiers.tierId)) {
            return false;
         }
      }
      return true;
   }

}

export function HasUniquePrizeTierIds(validationOptions?: ValidationOptions) {
   return function (object: Object, propertyName: string) {
      registerDecorator({
         target: object.constructor,
         propertyName: propertyName,
         options: validationOptions,
         constraints: [],
         validator: HasUniquePrizeTierIds
      });
   };
}