import {ContainerRegistry, IInstallerModuleBuilder} from '@jchptf/di-app-registry';
import {PROTO_APP_TYPES} from './types';
import {ProtoExperimentAppInstaller} from './proto-experiment-app-installer.service';

ContainerRegistry.getInstance().registerInstallers(
   (bind: IInstallerModuleBuilder): void => {
      bind.bindApplication(PROTO_APP_TYPES.ProtoExperimentApp, ProtoExperimentAppInstaller);
   }
)

export * from './types';
export * from './proto-experiment-app-installer.service';