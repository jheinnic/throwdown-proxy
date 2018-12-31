import {interfaces} from 'inversify';
import BindingWhenSyntax = interfaces.BindingWhenSyntax;
import BindingWhenOnSyntax = interfaces.BindingWhenOnSyntax;
import BindingOnSyntax = interfaces.BindingOnSyntax;
import ConstraintFunction = interfaces.ConstraintFunction;
import Context = interfaces.Context;
import Request = interfaces.Request;

import {NoOpBindingOn} from './no-op-binding-on.class';
import {Director} from '../../lib';
import {UnsupportedBindingWhenOnSyntax} from './unsupported-binding-when-on-syntax.class';
import {BindingWhenOnChildSyntax} from './binding-when-on-child-syntax.class';
import {CompositeBindingSyntaxBuilder} from '../interfaces/composite-binding-syntax-builder.interface';
import {BindingWhenOnGrandChildSyntax} from './binding-when-on-grand-child-syntax.class';


export class CompositeBindingSyntax<T> implements CompositeBindingSyntaxBuilder<T>
{
   private readonly constraintList: ConstraintFunction[];

   constructor(private readonly hostBuilder: BindingWhenOnSyntax<T>) {
      this.constraintList = [];
   }

   public apply(director: Director<CompositeBindingSyntaxBuilder<T>>) {
      director.apply(this);

      this.hostBuilder.when((request: Request): boolean =>
         this.constraintList.every((constraint: ConstraintFunction): boolean =>
            constraint(request)));
   }

   public bindHost(director: Director<BindingWhenSyntax<T>|BindingWhenOnSyntax<T>>): CompositeBindingSyntaxBuilder<T> {
      const builder = new this.CompositeBindingWhenSyntax(this.constraintList, this.hostBuilder);

      director.apply(builder);

      return this;
   }

   public bindParent(director: Director<BindingWhenSyntax<any>|BindingWhenOnSyntax<any>>): CompositeBindingSyntaxBuilder<T> {
      const delegate = new this.CompositeBindingWhenSyntax(this.constraintList);
      const builder = new BindingWhenOnChildSyntax(delegate);

      director.apply(builder);

      return this;
   }

   public bindAncestor(generationDistance: number, director: Director<BindingWhenSyntax<any>|BindingWhenOnSyntax<any>>): CompositeBindingSyntaxBuilder<T> {
      const delegate = new this.CompositeBindingWhenSyntax(this.constraintList);
      const builder = new BindingWhenOnGrandChildSyntax(delegate, generationDistance);

      director.apply(builder);

      return this;
   }

   private CompositeBindingWhenSyntax = class CompositeBindingWhenOnSyntax<T> extends UnsupportedBindingWhenOnSyntax<T> {
      private readonly bindingOnSyntax: BindingOnSyntax<T>;

      constructor(
         private readonly constraintList: ConstraintFunction[],
         bindingOnSyntax?: BindingOnSyntax<T> )
      {
         super();
         if (!!bindingOnSyntax) {
            this.bindingOnSyntax = bindingOnSyntax;
         } else {
            this.bindingOnSyntax = new NoOpBindingOn(this);
         }
      }

      when(constraint: (parentRequest: Request) => boolean): BindingOnSyntax<T>
      {
          this.constraintList.push(constraint as ConstraintFunction);

          return this.bindingOnSyntax;
      }

      public onActivation(_fn: (
         context: Context, injectable: T) => T): BindingWhenSyntax<T>
      {
         this.bindingOnSyntax.onActivation(_fn);

         return this;
      }
  }
}
