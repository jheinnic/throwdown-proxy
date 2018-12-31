export enum LoadSourceStrategy
{
   EAGER_FIXED_ITERABLE = 'EagerFixedIterable',
   EAGER_FIXED_ASYNC_ITERABLE = 'EagerFixedAsyncIterable',
   EAGER_FIXED_CALL_PROVIDER = 'EagerFixedCallProvider'
}

export namespace ResourcePoolModuleConfig
{
   export interface Defaults
   {
   }

   export interface Required
   {
      readonly name: string;
      readonly loadStrategy: LoadSourceStrategy;
      // readonly reservationChannel: string;
      // readonly returnChannel: string;
   }

   export interface Runtime extends Defaults, Required {}
}

export namespace EagerFixedIterableLoadStrategy
{
   export interface Defaults
   {
   }

   export interface Required<T> // extends ResourcePoolModuleConfig.Required
   {
      name: string;
      loadStrategy: LoadSourceStrategy.EAGER_FIXED_ITERABLE
      source: Iterable<T>;
   }

   export interface Runtime<T> extends Defaults, Required<T> {}
}

export namespace EagerFixedAsyncIterableLoadStrategy
{
   export interface Defaults
   {
   }

   export interface Required<T> // extends ResourcePoolModuleConfig.Required
   {
      name: string;
      loadStrategy: LoadSourceStrategy.EAGER_FIXED_ASYNC_ITERABLE
      source: AsyncIterable<T>;
   }

   export interface Runtime<T> extends Defaults, Required<T> {}
}

export namespace EagerFixedCallProviderLoadStrategy
{
   export interface Defaults
   {
   }

   export interface Required // extends ResourcePoolModuleConfig.Required
   {
      name: string;
      loadStrategy: LoadSourceStrategy.EAGER_FIXED_CALL_PROVIDER;
      providerToken: any;
      poolSize: number
   }
}

/** This is common portion for your module clients */
interface ResourcePoolModuleConfiguration
   extends Partial<ResourcePoolModuleConfig.Defaults>,
      ResourcePoolModuleConfig.Required {}


/**
 * The remaining portion mixes in a paired hierarchy of variant sub-configurations
 * that support required and default split semantics.
 */
export interface EagerFixedIterableLoadStrategy<T>
   extends Partial<EagerFixedIterableLoadStrategy.Defaults>,
      EagerFixedIterableLoadStrategy.Required<T> {}

export interface EagerFixedAsyncIterableLoadStrategy<T>
   extends Partial<EagerFixedAsyncIterableLoadStrategy.Defaults>,
      EagerFixedAsyncIterableLoadStrategy.Required<T> {}

export interface EagerFixedCallProviderLoadStrategy
   extends Partial<EagerFixedCallProviderLoadStrategy.Defaults>,
      EagerFixedCallProviderLoadStrategy.Required {}

export type LoadSourceStrategyOptions<T> =
   EagerFixedIterableLoadStrategy<T>
   | EagerFixedAsyncIterableLoadStrategy<T>
   | EagerFixedCallProviderLoadStrategy

/**
 * The exposed public interface type is an intersection of the base common options
 * with a union type from the subtype variants.
 */
export type ResourcePoolModuleConfig<T> =
   ResourcePoolModuleConfiguration & LoadSourceStrategyOptions<T>

