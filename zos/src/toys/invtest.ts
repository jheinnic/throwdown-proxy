import {Container, inject, injectable, tagged} from 'inversify';
import 'reflect-metadata';

@injectable()
export class Moo {
   public toString() { return "moo"; }
}

@injectable()
export class Baz {
   constructor(@inject(Moo) moo: Moo) {
      console.log(moo.toString());
   }

   public toString() { return "baz"; }
}

@injectable()
export class Bar {
   constructor(@inject(Baz) baz: Baz) {
      console.log(baz.toString());
   }

   public toString() { return "bar"; }
}

@injectable()
export class Foo
{
   constructor(@inject(Bar) @tagged("tag", "on") bar: Bar) {
      console.log(bar.toString());
   }

   public toString() { return "foo"; }
}

@injectable()
export class Main
{
   constructor(foo: Foo) {
      console.log(foo.toString());
   }
}

const c: Container = new Container();
c.bind(Main).to(Main);
c.bind(Foo).to(Foo);
c.bind(Bar).to(Bar).whenTargetTagged("tag", "on");
c.bind(Baz).to(Baz).whenParentTagged("tag", "on");
c.bind(Moo).to(Moo).whenAnyAncestorTagged("tag", "on");

let m:Main = c.get(Main);
console.log('Top', m);   
