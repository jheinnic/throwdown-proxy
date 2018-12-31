import {Command} from 'commander';
import {inject, injectable, interfaces, named} from 'inversify';
import Bind = interfaces.Bind;
import Unbind = interfaces.Unbind;
import Rebind = interfaces.Rebind;
import IsBound = interfaces.IsBound;

import {diModule, ModuleRegistry} from '../di';
import {AbstractDIModule} from '../di/abstract-di-module.class';
import '../../../infrastructure/reflection/index';
import {diTemplate} from '../di/decorators/di-template.decorator';

let program = new Command();

function range(val: string): number[]
{
   return val.split('..')
      .map(Number);
}

program
   .option('-c, --cheese <type>..<alt>', 'add cheese [marble]', range)
   .arguments('<one> [two]')
   .action(function (one: string, two: string, cmd: Command) {
      console.log('1:', one);
      console.log('2:', two);
      console.log('cmd:', cmd.cheese);
   })
   .parse(process.argv);

console.log('Ran bar feep', process.argv, program.cheese);

export type SymbolKeys = 'one' | 'two' | 'three' | 'basicModule' | 'library' | 'libraryTemplate' | 'app' | 'appModule';

// export type Record<T extends string, F> = {
//    readonly [P in T]: F;
// }
export type Symbolic<T extends string> = Record<T, symbol>;

export const SYMBOLS: Symbolic<SymbolKeys> = {
   one: Symbol.for('one'),
   two: Symbol.for('two'),
   three: Symbol.for('three'),
   basicModule: Symbol.for('BasicModule'),
   library: Symbol.for('Library'),
   libraryTemplate: Symbol.for('LibraryTemplate'),
   app: Symbol.for('Application'),
   appModule: Symbol.for('ApplicationModule')
};

@diModule(SYMBOLS.basicModule)
export class BaseModule extends AbstractDIModule
{
   onLoad(bind: Bind, unbind: Unbind, isBound: IsBound, rebind: Rebind): void
   {
      if (isBound(SYMBOLS.one)) {
         rebind(SYMBOLS.one)
            .toConstantValue('badOne');
      } else {
         bind(SYMBOLS.one)
            .toConstantValue('badOne');
      }
      unbind(SYMBOLS.one);
      bind(SYMBOLS.one)
         .toConstantValue('badOne');
      rebind(SYMBOLS.one)
         .toConstantValue('one');
   }
}

export interface ILibrary
{
   callMe(): void;

   readonly data: string;
}

@injectable()
export class Library implements ILibrary
{
   constructor(public readonly data: string) { }

   public callMe(): void
   {
      console.log(this.data);
   }

}

@injectable()
export class Application
{
   constructor(@inject(SYMBOLS.library) @named("myApp") private readonly lib: ILibrary)
   {
   }

   public fire(): void
   {
      this.lib.callMe();
   }
}

@Reflect.metadata('bModular:dependencies', [
   {
      template: SYMBOLS.libraryTemplate,
      tag: 'a'
   }
])
@diModule<AppModule>(SYMBOLS.appModule)
export class AppModule extends AbstractDIModule
{
   onLoad(bind: Bind, )
   {
      bind(SYMBOLS.app)
         .to(Application);
   }
}

@diTemplate<LibraryTemplate>(SYMBOLS.libraryTemplate)
export class LibraryTemplate extends AbstractDIModule
{
   constructor(private readonly nameValue: string) {
      super();
   }

   onLoad(bind: Bind) {
      bind(SYMBOLS.library)
         .toDynamicValue(() => new Library(this.nameValue))
         .inSingletonScope()
         .whenTargetNamed(this.nameValue);
   }
}

function main(): void {
   const registry = ModuleRegistry.getInstance();
   registry.loadModule(SYMBOLS.basicModule);
   registry.loadModule(SYMBOLS.appModule);
   registry.expandTemplate(SYMBOLS.libraryTemplate, "myApp");
   console.log(
      registry.get(SYMBOLS.one));
   registry.get<Application>(SYMBOLS.app)
      .fire();
}

// function badMain(): void
// {
//    let moduleContainer = new Container({
//       autoBindInjectable: false,
//       defaultScope: 'Singleton',
//       skipBaseClassChecks: true
//    });
//    let appContainer = new Container();
//
//    moduleContainer.bind(ContainerModule)
//       .to(BaseModule)
//       .whenTargetNamed('BaseModule');
//    moduleContainer.bind(ContainerModule)
//       .to(AppModule)
//       .whenTargetNamed('AppModule');
//
//    appContainer.load(
//       moduleContainer.getNamed(
//          ContainerModule, 'BaseModule'));
//    appContainer.load(
//       moduleContainer.getNamed(
//          ContainerModule, 'AppModule'));
//
//    console.log(
//       appContainer.get(SYMBOLS.one));
//    appContainer.get<Application>(SYMBOLS.app)
//       .fire();
// }

main();