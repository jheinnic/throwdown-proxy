import {interfaces} from 'inversify';

import {IDirector} from '@jchptf/api';
import {installerRequest} from '@jchptf/di-app-registry';
import {IsDefined, Min} from 'class-validator';
import {Chan} from 'chan';

@installerRequest()
export class InstallChanRequest<T extends any> {
   @IsDefined()
   readonly bindWhen: IDirector<interfaces.BindingWhenSyntax<Chan<T>>>;

   @Min(0)
   readonly bufSize: number;

   constructor(
      bindWhen: IDirector<interfaces.BindingWhenSyntax<Chan<T>>>,
      bufSize: number,
      public readonly scope: interfaces.BindingScope = "Singleton" )
   {
      this.bindWhen = bindWhen;
      this.bufSize = bufSize;
   }
}
