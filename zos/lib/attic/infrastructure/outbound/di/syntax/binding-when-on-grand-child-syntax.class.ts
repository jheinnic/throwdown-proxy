import {interfaces} from 'inversify';
import BindingWhenSyntax = interfaces.BindingWhenSyntax;
import {BindingWhenGrandChildSyntax} from './binding-when-grand-child-syntax.class';


export class BindingWhenOnGrandChildSyntax<T> extends BindingWhenGrandChildSyntax<T> {
   constructor( grandChildBuilder: BindingWhenSyntax<any>, generationDistance: number ) {
      super(grandChildBuilder, generationDistance);
   }

   public onActivation(_fn: (
      context: interfaces.Context, injectable: T) => T): interfaces.BindingWhenSyntax<T>
   {
      return this;
   }
}
