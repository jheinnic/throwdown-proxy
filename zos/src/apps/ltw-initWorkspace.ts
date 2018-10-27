import {Container, ContainerModule} from 'inversify';
import {Command} from 'commander';
import * as util from 'util';

import {CONFIG_TYPES, configLoaderModule, ConfigLoader} from '@jchptf/config';
import {configContainerModule} from './di';
import {EventSpecification} from './config';

const program = new Command();

program
   .version('0.1.0')
   .action(demoAction)
   .parse(process.argv);

function demoAction() {
   const container: Container = new Container();
   container.load(
      new ContainerModule(configLoaderModule));
   container.load(
      new ContainerModule(configContainerModule));
   // container.load(
   //    new ContainerModule(initWorkspaceWorkerModule));

   const configLoader: ConfigLoader = container.get(CONFIG_TYPES.ConfigLoader);
   console.log(configLoader);

   const gameSpec: EventSpecification =
      configLoader.getConfig(EventSpecification, "eth.lotto.eventSpec");
   // const deployment: Deployment =
   //    configLoader.getConfig(Deployment);
   // const setupPolicy: SetupPolicy =
   //    configLoader.getConfig(SetupPolicy);


   console.log('GameSpec:', util.inspect(gameSpec, true, 5, true));
}

console.log(program);
