import {InstallerService} from '@jchptf/di-app-registry';
import {UuidInstalledReply} from './uuid-installed-reply.class';
import {InstallUuidRequest} from './install-uuid-request.class';

export class UuidUtilityInstaller implements InstallerService<InstallUuidRequest, UuidInstalledReply>
{
   public install(
      client: IContainerRegistryInstallerClient, imports: InstallUuidRequest): UuidInstalledReply
   {
      return undefined;
   }

}
