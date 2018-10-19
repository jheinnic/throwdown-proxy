import {interfaces} from 'inversify';
import ServiceIdentifier = interfaces.ServiceIdentifier;

export abstract class AbstractDIModule
{
   protected constructor(public readonly dependsOn: ServiceIdentifier<any>[] = []) { }

   public abstract onLoad(
      bind: interfaces.Bind, unbind: interfaces.Unbind, isBound: interfaces.IsBound,
      rebind: interfaces.Rebind): void;
}

