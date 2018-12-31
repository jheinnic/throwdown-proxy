import {interfaces} from 'inversify';
import Bind = interfaces.Bind;
import {AbstractDIModule, diModule} from '../../../di';
import {LTC_MODULES} from './modules';
import {LTC_TYPES} from './types';
import {LtcApp} from '../service/ltc-app.service';

@diModule(LTC_MODULES.LtcAppModule)
export class LtcAppModule extends AbstractDIModule {
   constructor() {
      super();
   }

   public onLoad(bind: Bind): void
      // , unbind: interfaces.Unbind, isBound: interfaces.IsBound, rebind: interfaces.Rebind): void
   {
      bind(LTC_TYPES.LtcApp).to(LtcApp).inSingletonScope();
   }

}