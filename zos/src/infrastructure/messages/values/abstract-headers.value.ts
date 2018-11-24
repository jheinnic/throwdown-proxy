import {Merge} from 'simplytyped';
import {MessageHeadersMixin} from '../interfaces/message-headers-mixin.type';
import {HeadersConstructor} from '../interfaces/headers-constructor.interface';
import {MessageHeaders} from '../interfaces/message-headers.interface';

export abstract class AbstractHeaders implements MessageHeaders {
   public constructor() {
      return Object.assign(this, this.init(), this);
   }

   public init(): MessageHeaders {
      return {} as this;
   }

   public with<T extends AbstractHeaders>(
      overrides: Partial<Merge<this, T>>, mixin: MessageHeadersMixin<T>): Merge<this, T>
   {
      const ReturnType: HeadersConstructor<Merge<this, T>> =
         mixin<this>(this.constructor as HeadersConstructor<this>);
      const retVal = new ReturnType();

      return Object.assign(retVal, this, overrides);
   }
}
