import {registerDecorator, ValidationOptions, ValidationArguments} from 'class-validator';
import * as path from 'path';

export function IsPath(separator: string = '/', validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isPath',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [separator],
            options: validationOptions,
            validator: {
                validate: (value: any, _args: ValidationArguments) => {
                    // try {
                    const result = path.parse(value);
                    if (typeof result === 'object') {
                        return true;
                    }

                    return false;
                    // } catch (error) {
                    //     console.error(error);
                    //     throw error;
                    // }
                },

                defaultMessage: (args: ValidationArguments) => {
                    return `${args.value} is not a valid path.`;
                }
            }
        });
    };
}
