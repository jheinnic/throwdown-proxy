import {
   initHeaders, isConstructor, MessageHeaders, HeadersConstructor, WithHeadersType,
   MessageHeadersMixin, isMixinDecorator, MessageHeadersHelpers
} from '../interfaces';

function isMixin<H, T>(withMixin: HeadersConstructor<H & T> | MessageHeadersMixin<T>): withMixin is MessageHeadersMixin<T> {
   return withMixin.hasOwnProperty(isMixinDecorator);
}

export class BasicHeaders<H = Object> implements MessageHeadersHelpers<H> {
   public constructor(base?: Partial<H>, overrides?: Partial<H>) {
      Object.assign(this, base, overrides);
      this[initHeaders]();
   }

   static [isConstructor]: true;

   // static get [Symbol.species](): HeadersConstructor<any> {
   //    throw unsupported();
   // }

   public [initHeaders](): void { }

   // public [getDefaultFor]<P extends Keys<H>>(_prop: P): H[P]|undefined {
   //    throw unsupported();
      // return undefined;
   // }

   public with<T extends any>(
      overrides: Partial<T>, withMixin: WithHeadersType<H, T>): MessageHeaders<H &T>
   {
      // const ReturnType: HeadersConstructor<H & T> = isMixin<H, T>(withMixin)
      //    ? withMixin<H>(this.constructor as HeadersConstructor<H>)
      //    : withMixin; // as HeadersConstructor<H & T>;
      let ReturnType: HeadersConstructor<H & T>;
      if (isMixin<H, T>(withMixin)) {
         ReturnType = withMixin<H>(this.constructor as HeadersConstructor<H>)
      } else {
         ReturnType = withMixin as HeadersConstructor<H & T>;
      }

      const retVal = new ReturnType();

      return Object.assign(retVal, this, overrides);
   }
}
