export class CommandLineBuilder implements ICommandLineBuilder {
   option(flags: string, description?: string, fn?: ((arg1: any, arg2: any) => void) | RegExp, defaultValue?: any): Command;
   option(flags: string, description?: string, defaultValue?: any): Command;

}