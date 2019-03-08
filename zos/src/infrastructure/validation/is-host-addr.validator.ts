import {registerDecorator, ValidationArguments, ValidationOptions, Validator} from 'class-validator';

const validator = new Validator();

export function IsHostAddr(validationOptions?: ValidationOptions)
{
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isHostAddr',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate: (value: any, _args: ValidationArguments) => {
          // TODO: Accept unqualified host names as well!!
          return validator.isIP(value, '4')
            || validator.isFQDN(value)
            || validator.isIP(value, '6');
        },

        defaultMessage: (args: ValidationArguments) => {
          return `${args.value} is neither a valid hostname nor an IP address`;
        }
      }
    });
  };
}
