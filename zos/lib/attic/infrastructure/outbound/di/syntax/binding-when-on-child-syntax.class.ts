import {interfaces} from 'inversify';
import {BindingWhenChildSyntax} from './binding-when-child-syntax.class';
import BindingWhenSyntax = interfaces.BindingWhenSyntax;


export class BindingWhenOnChildSyntax<T> extends BindingWhenChildSyntax<T> {
   constructor( childBuilder: BindingWhenSyntax<any> ) {
      super(childBuilder);
   }

   public onActivation(_fn: (
      context: interfaces.Context, injectable: T) => T): interfaces.BindingWhenSyntax<T>
   {
      return this;
   }
}
