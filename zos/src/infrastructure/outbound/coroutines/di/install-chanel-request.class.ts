import {interfaces} from 'inversify';

import {IDirector} from '@jchptf/api';
import {installerRequest} from '@jchptf/di-app-registry';
import {Chanel, ChanelOptions} from 'chanel';

@installerRequest()
export class InstallChanelRequest<T extends any> {
   bindWhen: IDirector<interfaces.BindingWhenSyntax<Chanel<T>>>;

   chanelOptions: ChanelOptions;

   constructor(
      bindWhen: IDirector<interfaces.BindingWhenSyntax<Chanel<T>>>,
      chanelOptions: ChanelOptions,
      public readonly scope: interfaces.BindingScope
   ) {
      this.bindWhen = bindWhen;
      this.chanelOptions = chanelOptions;
   }
}
