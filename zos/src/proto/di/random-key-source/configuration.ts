/** Users of your module possibly never need interfaces in this namespace. But you will. */
import {configClass} from '@jchptf/di-app-registry';
import {IsIn, IsPositive} from 'class-validator';

export namespace Configuration {

   /** Configuration defaults -> all of these keys are optional for users of your module. */
   export interface Defaults {
      /** If set to true, my module will always fail. Default = false */
      keyCount: number,
      curve: "ed25519" | "jubjub"
   }

   /** Required configuration options, no defaults are used here */
   export interface Required {
   }

   /** This is the interface you - as the module developer - are working with*/
   export interface Runtime extends Defaults, Required {};
};

/** This is the interface for your module clients */
export interface Configuration extends Partial<Configuration.Defaults>, Configuration.Required {};

const defaults: Configuration.Defaults = {
   curve: "ed25519",
   keyCount: 5000
};

@configClass("proto.randomKeySource")
export class ConfigurationImpl implements Configuration.Runtime {
   @IsIn(["ed25516", "jubjub"])
   // @ts-ignore
   public readonly curve: "ed25519" | "jubjub";

   @IsPositive()
   // @ts-ignore
   public readonly keyCount: number;

   constructor(overrides: Partial<Configuration.Defaults> & Configuration.Required)
   {
      Object.assign(this, defaults, overrides);
   }
}

