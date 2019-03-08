import {MixableConstructor}  from '../../../../src/infrastructure/lib';
import {MetadataAccessor, MetadataInspector, MetadataMap, MethodDecoratorFactory} from '@loopback/metadata';
import {DI_META} from '../infrastructure/di/decorators/di-meta.symbols';
import {AbstractBehavioralState, Test} from '../../infrastructure/lib/machina';

export class TestModel
{
   public readonly foo: string = '';

   public readonly bar: number = 0;

   public readonly baz: number = 0;

   public readonly quibble: boolean[] = [];
}

export const FluentTestModel = FluentlyBuilt<typeof TestModel>(TestModel);

export const thing = FluentTestModel.create(
   (builder: FluentTemplate<TestModel>) => {
      builder.foo('')
         .bar(4)
         .baz(3)
         .quibble([true, true, false]);
   }
);

export const thang = thing.clone(
   (builder) => {
      builder.baz(10);
   }
);

export interface DiMethod
{
   id: symbol;
   name: string;
   async: boolean;
   dependsOn: MixableConstructor[];
   linksTo: symbol[];
   version: number;
}

/*
export class DiMethodImpl implements DiMethod
{
   public readonly id: symbol = Symbol.for('Cheese');

   public readonly async: boolean = false;

   public readonly dependsOn: Constructor[] = [];

   public readonly linksTo: symbol[] = [];

}
*/

const diMethodAccessor: MetadataAccessor<DiMethod, MethodDecorator> =
   MetadataAccessor.create<DiMethod, MethodDecorator>('TestIt');

function diMethod(spec: DiMethod): MethodDecorator
{
   return MethodDecoratorFactory.createDecorator<DiMethod>(diMethodAccessor, spec);
}

class Demo
{
   skipThis(): void
   {
      console.log('skipped');
   }

   @diMethod({
      id: DI_META.diModules,
      name: 'Cheese',
      async: true,
      dependsOn: [TestModel, MethodDecoratorFactory],
      linksTo: [DI_META.syncProviderMethods, DI_META.asyncProviderMethods],
      version: 9
   })
   catchThis(): number
   {
      console.log('ow');
      return 9;
   }
}

const allMethods: MetadataMap<DiMethod> | undefined = MetadataInspector.getAllMethodMetadata<DiMethod>(
   diMethodAccessor,
   Demo.prototype,
);

if (!!allMethods) {
   const allData: (DiMethod| undefined)[] = Object.getOwnPropertyNames(allMethods).map<(DiMethod| undefined)>(
      (method: string): DiMethod| undefined => {
         const myMethod: (DiMethod| undefined) = MetadataInspector.getMethodMetadata<DiMethod>(
            diMethodAccessor,
            Demo.prototype,
            method
         );

         return myMethod;
      });


   console.log(JSON.stringify(allData));
}


// export type foo = Exclude<string|symbol|number, symbol>
export type bar<T, U, V, W> = T extends U ? V : W;
export class B {
   public readonly foo: "B" = "B";
}
export class A extends B {
   public readonly bar: "A" = "A";
}
export class D {
   public readonly foo: "D" = "D";
}
export class E {
   public readonly foo: "E" = "E";
}
export class C extends D {
   public readonly bar: "C" = "C";
}
export class F extends D {
   public readonly bar: "F" = "F";
}
export class G extends A {
   public readonly baz: "G" = "G";
}
export class H extends B {
   public readonly bar: "H" = "H";
}

export const foo: bar<A, B, C, F> = new C();

export type SS = 'a'|'b';
export type AA = 'c'|'d';

export const a: Test<A, SS, AA> = {
   c: "a",
   d: function (this: AbstractBehavioralState<A, SS, AA>, client: A) {
      this.handle(client, 'c');
      this.transition(client, 'a');
   }
};
