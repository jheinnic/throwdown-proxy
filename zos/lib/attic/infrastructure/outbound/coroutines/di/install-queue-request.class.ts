import {interfaces} from 'inversify';

import {IDirector} from '@jchptf/api';
import {installerRequest} from '@jchptf/di-app-registry';
import {Queue} from 'co-priority-queue';

@installerRequest()
export class InstallQueueRequest<T extends any>
{
   bindWhen: IDirector<interfaces.BindingWhenSyntax<Queue<T>>>;

   constructor(
      bindWhen: IDirector<interfaces.BindingWhenSyntax<Queue<T>>>,
      public readonly scope: interfaces.BindingScope)
   {
      this.bindWhen = bindWhen;
   }
}
