import {injectable, interfaces} from 'inversify';
import {chan, Chan} from 'chan';

import {CO_TYPES} from './types';
import {InstallChanRequest} from './install-chan-request.class';
import {IContainerRegistryInstallerClient, InstallerService} from '@jchptf/di-app-registry';
import {InstallChanelRequest} from './install-chanel-request.class';
import {Chanel} from 'chanel';

@injectable()
export class ChanelInstallerService implements InstallerService<InstallChanelRequest<any>, void>
{
   install<T extends any>(client: IContainerRegistryInstallerClient, request: InstallChanelRequest<T>)
   {
      switch(request.scope) {
         case "Singleton":
         {
            client.loadToCurrent(
               (bind: interfaces.Bind) => {
                  request.bindWhen(
                     bind<Chanel<T>>(CO_TYPES.Chanel)
                        .toDynamicValue((_context: interfaces.Context) => {
                           return chan(request.);
                        })
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
                     bind<Chan<T>>(CO_TYPES.Chan)
                        .toDynamicValue((_context: interfaces.Context) => {
                           return chan(request.bufSize);
                        })
                        .inTransientScope()
                  );
               }
            );

            break;
         }
         case "Request":
         {
            client.loadToCurrent(
               (bind: interfaces.Bind) => {
                  request.bindWhen(
                     bind<Chan<T>>(CO_TYPES.Chan)
                        .toDynamicValue((_context: interfaces.Context) => {
                           return chan(request.bufSize);
                        })
                        .inRequestScope()
                  )
               }
            );

            break;
         }
   }
}