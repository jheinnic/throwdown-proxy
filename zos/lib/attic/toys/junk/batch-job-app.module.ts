// import {ContainerModule} from 'inversify';
import {DI_TYPES} from '../../infrastructure/di/types/index';
import {MODULES} from '../../infrastructure/di/modules/modules';
import {Application} from '../../infrastructure/di/interfaces/index';
import {diModule} from '../../infrastructure/di/decorators/di-module.decorator';
import {interfaces} from 'inversify';
import {AbstractDIModule} from '../../infrastructure/di/v1/abstract-di-module.class';

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
