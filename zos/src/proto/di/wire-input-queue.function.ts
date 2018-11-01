import {interfaces} from 'inversify';
import {IKeyPairStagingLayout} from '../../modules/tickets/interface/internal';
import {TICKET_POOL_TYPES} from '../../modules/tickets/di';
import {IKeyPairStagingAccess} from '../../modules/tickets/interface';
import {KeyPairLocator} from '../../modules/tickets/interface/locators';

export function wireInputQueue(context: interfaces.Context) {
   const container = context.container;
   const keyPairLayout: IKeyPairStagingLayout = container.get(TICKET_POOL_TYPES.KeyPairLayout);
   const keyPairAccess: IKeyPairStagingAccess = container.get(TICKET_POOL_TYPES.KeyPairAccess);

   function * openAllKeyPairs() {
      let locator: KeyPairLocator;
      for (locator of keyPairAccess.findAllKeyPairs(true)) {
         yield keyPairAccess.readPublicKeyFile(locator);
      }
   }
}