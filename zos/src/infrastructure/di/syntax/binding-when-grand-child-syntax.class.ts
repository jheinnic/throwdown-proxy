import {interfaces, namedConstraint, taggedConstraint, traverseAncerstors, typeConstraint} from 'inversify';
import BindingWhenSyntax = interfaces.BindingWhenSyntax;
import ConstraintFunction = interfaces.ConstraintFunction;

import {NoOpBindingOn} from './no-op-binding-on.class';


export class BindingWhenGrandChildSyntax<T> implements BindingWhenSyntax<T>
{
   private noOpBinding: NoOpBindingOn<T>;

   constructor(
      private readonly grandChildBuilder: BindingWhenSyntax<any>,
      private readonly generationDistance: number)
   {
      if (! grandChildBuilder) {
         throw new Error();
      }
      if (generationDistance < 1) {
         throw new Error();
      }
      this.noOpBinding = new NoOpBindingOn<T>(this);
   }

   public when(constraint: (parentRequest: interfaces.Request) => boolean): interfaces.BindingOnSyntax<T>
   {
      this.grandChildBuilder.when((grandChildRequest: interfaces.Request): boolean => {
         return constraint(grandChildRequest.parentRequest!);
      });

      return this.noOpBinding;
   }

   public whenAnyAncestorIs(ancestor: Function | string): interfaces.BindingOnSyntax<T>
   {
      this.grandChildBuilder.when((request: interfaces.Request) => {
         return traverseAncerstors(this.getGrandParentRequest(request), typeConstraint(ancestor));
      });

      return this.noOpBinding;
   }

   public whenAnyAncestorMatches(constraint: (request: interfaces.Request) => boolean): interfaces.BindingOnSyntax<T>
   {
      this.grandChildBuilder.when((request: interfaces.Request) => {
         return constraint(this.getGrandParentRequest(request));
      });

      return this.noOpBinding;
   }

   public whenAnyAncestorNamed(name: string | number | symbol): interfaces.BindingOnSyntax<T>
   {
      this.grandChildBuilder.when((request: interfaces.Request) => {
         return traverseAncerstors(this.getGrandParentRequest(request), namedConstraint(name));
      });

      return this.noOpBinding;
   }

   public whenAnyAncestorTagged(tag: string | number | symbol, value: any): interfaces.BindingOnSyntax<T>
   {
      this.grandChildBuilder.when((request: interfaces.Request) => {
         return traverseAncerstors(this.getGrandParentRequest(request), taggedConstraint(tag)(value));
      });

      return this.noOpBinding;
   }

   public whenInjectedInto(parent: Function | string): interfaces.BindingOnSyntax<T>
   {
      this.grandChildBuilder.when((request: interfaces.Request) => {
         return typeConstraint(parent)(this.getGrandParentRequest(request).parentRequest);
      });

      return this.noOpBinding;
   }

   public whenNoAncestorIs(ancestor: Function | string): interfaces.BindingOnSyntax<T>
   {
      this.grandChildBuilder.when((request: interfaces.Request) => {
         return !traverseAncerstors(this.getGrandParentRequest(request), typeConstraint(ancestor));
      });

      return this.noOpBinding;
   }

   public whenNoAncestorMatches(constraint: (request: interfaces.Request) => boolean): interfaces.BindingOnSyntax<T>
   {
      this.grandChildBuilder.when((request: interfaces.Request) => {
         return !traverseAncerstors(this.getGrandParentRequest(request), constraint as ConstraintFunction);
      });

      return this.noOpBinding;
   }

   public whenNoAncestorNamed(name: string | number | symbol): interfaces.BindingOnSyntax<T>
   {
      this.grandChildBuilder.when((request: interfaces.Request) => {
         return !traverseAncerstors(this.getGrandParentRequest(request), namedConstraint(name));
      });

      return this.noOpBinding;
   }

   public whenNoAncestorTagged(tag: string | number | symbol, value: any): interfaces.BindingOnSyntax<T>
   {
      this.grandChildBuilder.when((request: interfaces.Request) => {
         return !traverseAncerstors(this.getGrandParentRequest(request), taggedConstraint(tag)(value));
      });

      return this.noOpBinding;
   }

   public whenParentNamed(name: string | number | symbol): interfaces.BindingOnSyntax<T>
   {
      this.grandChildBuilder.when((request: interfaces.Request) => {
         return namedConstraint(name)(this.getGrandParentRequest(request));
      });

      return this.noOpBinding;
   }

   public whenParentTagged(tag: string | number | symbol, value: any): interfaces.BindingOnSyntax<T>
   {
      this.grandChildBuilder.when((request: interfaces.Request) => {
         return taggedConstraint(tag)(value)(this.getGrandParentRequest(request));
      });

      return this.noOpBinding;
   }

   public whenTargetIsDefault(): interfaces.BindingOnSyntax<T>
   {
      this.grandChildBuilder.when((request: interfaces.Request) => {
         var parentTarget =
            this.getGrandParentRequest(request).target;

         return (parentTarget !== null) &&
            (!parentTarget!.isNamed()) &&
            (!parentTarget!.isTagged());
      });

      return this.noOpBinding;
   }

   public whenTargetNamed(name: string | number | symbol): interfaces.BindingOnSyntax<T>
   {
      this.grandChildBuilder.when((request: interfaces.Request) => {
         return namedConstraint(name)(this.getGrandParentRequest(request));
      });


      return this.noOpBinding;
   }


   public whenTargetTagged(tag: string | number | symbol, value: any): interfaces.BindingOnSyntax<T>
   {
      this.grandChildBuilder.when((request: interfaces.Request) => {
         return taggedConstraint(tag)(value)(this.getGrandParentRequest(request));
      });

      return this.noOpBinding;
   }

   private getGrandParentRequest(request: interfaces.Request) {
      let currentParent = request.parentRequest;

      for (let ii = 1; ii < this.generationDistance; ii++ ) {
         if (! currentParent) {
            throw new Error(`No parent at generation ${ii}`);
         }
         currentParent = currentParent.parentRequest!;
      }

      if (! currentParent) {
         throw new Error(`No parent at generation ${this.generationDistance}`);
      }

      return currentParent;
   }
}
