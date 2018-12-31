import {injectable, interfaces} from 'inversify';
import {Queue} from 'co-priority-queue';

import {CO_TYPES} from './types';
import {InstallQueueRequest} from './install-queue-request.class';
import {IContainerRegistryInstallerClient, InstallerService} from '@jchptf/di-app-registry';

@injectable()
export class QueueInstallerService implements InstallerService<InstallQueueRequest<any>, void>
{
   install<T extends any>(client: IContainerRegistryInstallerClient, request: InstallQueueRequest<T>)
   {
      switch(request.scope) {
         case "Singleton":
         {
            client.loadToCurrent(
               (bind: interfaces.Bind) => {
                  request.bindWhen(
                     bind<Queue<T>>(CO_TYPES.Queue)
                        .to(Queue)
                        .inSingletonScope()
                  )
               }
            );

            break;
         }
         case "Transient":
         {
            client.loadToCurrent(
               (bind: interfaces.Bind) => {
                  request.bindWhen(
                     bind<Queue<T>>(CO_TYPES.Queue)
                        .to(Queue)
                        .inTransientScope()
                  )
               }
            );

            break;
         }
         case "Request":
         {
            client.loadToCurrent(
               (bind: interfaces.Bind) => {
                  request.bindWhen(
                     bind<Queue<T>>(CO_TYPES.Queue)
                        .to(Queue)
                        .inRequestScope()
                  )
               }
            );

            break;
         }
      }
   }
}