import {ApplicationInstaller, IContainerRegistryInstallerClient} from '@jchptf/di-app-registry';
import {APP_CONFIG_TYPES} from '../../../apps/di';
import {Deployment, TicketMintingPolicy} from '../../../apps/config';

export class KeypairProvisioningAppDi implements ApplicationInstaller {
   constructor(
      private readonly @inject(APP_CONFIG_TYPES.Deployment) deployConfig: Deployment,
      private readonly @inject(APP_CONFIG_TYPES.TicketMintingPolicy) ticketMinting: TicketMintingPolicy,

   )
   public install(client: IContainerRegistryInstallerClient): void
   {
   }
}