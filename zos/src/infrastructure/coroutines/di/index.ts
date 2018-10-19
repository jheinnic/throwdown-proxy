import {ContainerRegistry} from '@jchptf/di-app-registry';
import {ChanInstallerService} from './chan-installer.service';
import {CO_TYPES} from './types';
import {interfaces} from 'inversify';
import {ChanelInstallerService} from './chanel-installer.service';
import {QueueInstallerService} from './queue-installer.service';
import {IInstallerModuleBuilder} from '../../../../node_modules/@jchptf/di-app-registry/dist/interfaces/module/installer-module-builder.interface';
import {InstallChanRequest} from './install-chan-request.class';
import {InstallChanelRequest} from './install-chanel-request.class';
import {InstallQueueRequest} from './install-queue-request.class';

export * from './chan-installer.service'
export * from './chanel-installer.service'
export * from './queue-installer.service'
export * from './install-chan-request.class'
export * from './install-chanel-request.class'
export * from './install-queue-request.class'
export * from './types'

const installerRegistry = ContainerRegistry.getInstance();
installerRegistry.registerInstallers((bind: IInstallerModuleBuilder) => {
   bind.bindInstaller(
      CO_TYPES.ChanRequest,
      InstallChanRequest,
      CO_TYPES.Chan,
      ChanInstallerService
   );
   bind.bindInstaller(
      CO_TYPES.ChanelRequest,
      InstallChanelRequest,
      CO_TYPES.Chanel,
      ChanelInstallerService
   );
   bind.bindInstaller(
      CO_TYPES.QueueRequest,
      InstallQueueRequest,
      CO_TYPES.Queue,
      QueueInstallerService
   )
