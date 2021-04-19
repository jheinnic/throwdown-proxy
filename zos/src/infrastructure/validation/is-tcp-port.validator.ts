import {registerDecorator, ValidationOptions, ValidationArguments} from 'class-validator';

// const validator = new Validator();

export function IsTcpPort(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isTcpPort',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate: (value: number, _args: ValidationArguments) => {
                    // TODO: Add constraint flag to distinguish privileged and unprivileged ranges
                    return (value > 0) && (value < 65536);
                },

                defaultMessage: (args: ValidationArguments) => {
                    return `${args.value} is outside valid TCP port range (1 through 65535)`;
                }
            }
        });
    };
}
