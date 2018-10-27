import {interfaces} from 'inversify';
import BindingOnSyntax = interfaces.BindingOnSyntax;

export class NoOpBindingOn<T> implements BindingOnSyntax<T> {
   constructor (private readonly parentBuilder: interfaces.BindingWhenSyntax<T> ) { }

   public onActivation(_fn: (context: interfaces.Context, injectable: T) => T): interfaces.BindingWhenSyntax<T>
   {
      return this.parentBuilder;
   }
}
