export enum LoadResourcePoolStrategy
{
   EAGER_FIXED_ITERABLE = 'EagerFixedIterable',
   EAGER_FIXED_ASYNC_ITERABLE = 'EagerFixedAsyncIterable',
   EAGER_FIXED_CALL_FACTORY = 'EagerFixedCallFactory'
}

export namespace EagerFixedIterableLoadStrategy
{
   export interface Defaults
   {
   }

   export interface Required<T extends object>
   {
      readonly loadStrategy: LoadResourcePoolStrategy.EAGER_FIXED_ITERABLE
      readonly name: string;
      readonly resources: Iterable<T>;
   }

   export interface Runtime<T extends object> extends Defaults, Required<T> {}
}

export namespace EagerFixedAsyncIterableLoadStrategy
{
   export interface Defaults
   {
   }

   export interface Required<T extends object>
   {
      readonly loadStrategy: LoadResourcePoolStrategy.EAGER_FIXED_ASYNC_ITERABLE
      readonly name: string;
      readonly resources: AsyncIterable<T>;
   }

   export interface Runtime<T extends object> extends Defaults, Required<T> {}
}

export namespace EagerFixedCallFactoryLoadStrategy
{
   export interface Defaults
   {
   }

   export interface Required<T extends object>
   {
      readonly loadStrategy: LoadResourcePoolStrategy.EAGER_FIXED_CALL_FACTORY;
      readonly name: string;
      readonly factory: () => T;
      readonly poolSize: number
   }

   export interface Runtime<T extends object> extends Defaults, Required<T> {}
}


/**
 * The remaining portion mixes in a paired hierarchy of variant sub-configurations
 * that support required and default split semantics.
 */
export interface EagerFixedIterableLoadStrategy<T extends object>
   extends Partial<EagerFixedIterableLoadStrategy.Defaults>,
      EagerFixedIterableLoadStrategy.Required<T> {}

export interface EagerFixedAsyncIterableLoadStrategy<T extends object>
   extends Partial<EagerFixedAsyncIterableLoadStrategy.Defaults>,
      EagerFixedAsyncIterableLoadStrategy.Required<T> {}

export interface EagerFixedCallProviderLoadStrategy<T extends object>
   extends Partial<EagerFixedCallFactoryLoadStrategy.Defaults>,
      EagerFixedCallFactoryLoadStrategy.Required<T> {}

export type LoadResourcePoolStrategyConfig<T extends object> =
   EagerFixedIterableLoadStrategy<T>
   | EagerFixedAsyncIterableLoadStrategy<T>
   | EagerFixedCallProviderLoadStrategy<T>

