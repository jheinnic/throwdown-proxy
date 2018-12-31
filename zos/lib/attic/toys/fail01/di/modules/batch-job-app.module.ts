// import {ContainerModule} from 'inversify';
import {DI_TYPES} from '../types';
import {MODULES} from './modules';
import {Application} from '../interfaces';
import {diModule} from '../decorators/di-module.decorator';
import {interfaces} from 'inversify';
import {AbstractDIModule} from '../abstract-di-module.class';

@diModule(MODULES.BatchJobApp)
export class BatchJobAppModule extends AbstractDIModule
{
   constructor()
   {
      super(
         (bind: interfaces.Bind): void =>
         {
            bind<Application>(DI_TYPES.Application)
               .to('');
         }
      );
   }
}
