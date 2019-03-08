/**
 * Created by jheinnic on 4/4/17.
 */

import {registerDecorator, ValidationArguments, ValidationOptions} from 'class-validator';

export function IsLongerThan(property: string, validationOptions?: ValidationOptions)
{
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      name: 'IS_LONGER_THAN_OTHER_PROPERTY_VALUE',
      constraints: [property],
      async: false,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments)
        {
          const [relatedPropertyName]: [string] = args.constraints as [string];
          const relatedValue: any = (args.object as { [key: string]: any })[relatedPropertyName];
          // const relatedValue = (
          //   args.object as any
          // )[relatedPropertyName];

          // you can return a Promise<boolean> here as well, if you want to make async validation
          return 'length' in value // typeof value === 'string'
            && 'length' in relatedValue // typeof relatedValue === 'string'
            && value.length > relatedValue.length;
        }
      }
    });
  };
}
