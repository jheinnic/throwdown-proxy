// import {transformAndValidateSync} from 'class-transformer-validator';
import {configMeta} from './config-meta.symbols';
import {ClassDecorator, Constructor} from '../../reflection';
import "../../reflection";

export function configClass<T extends {} = any>(defaultRoot: string = ""): ClassDecorator<T>
{
   return function classDecorator(target: Constructor<T>): void
   {
      Reflect.defineMetadata(configMeta.defaultRoot, defaultRoot, target);
      return;
   }
}

