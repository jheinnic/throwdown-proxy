import {interfaces} from 'inversify';
import {CO_TYPES} from '../types';
import {queueFactoryCreator} from './queue-factory-creator.function';
import {chanelFactoryCreator} from './chanel-factory-creator.function';
import {IContainerRegistryInstallerClient, InstallerService} from '@jchptf/di-app-registry';

export function coContainerInstaller(bind: interfaces.Bind) {
   bind(CO_TYPES.QueueFactory).toFactory(queueFactoryCreator);
   bind(CO_TYPES.ChanelFactory).toFactory(chanelFactoryCreator);
}

export class CoInstallerModule implements InstallerService<Object, void> {
   public install(client: IContainerRegistryInstallerClient, _imports: Object): void
   {
      client.loadToCurrent(coContainerInstaller);
   }
}