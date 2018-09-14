export interface ICommandBuilder<T>
{
   option<P extends keyof T>(
      flag: P, short?: string, description?: string, regex?: RegExp,
      defaultValue?: T[P]): ICommandBuilder<T>;

   option<P extends keyof T>(
      flag: P, short?: string, description?: string, fn?: (arg1: string, arg2: T[P]) => T[P],
      defaultValue?: T[P]): ICommandBuilder<T>;

   option<P extends keyof T>(
      flag: P, short?: string, description?: string, defaultValue?: T[P]): ICommandBuilder<T>;

   arguments(required: keyof T[], optional: keyof T[]): ICommandBuilder<T>

   action(action: (params: T) => void): ICommandBuilder<T>;
}