import {Container, ContainerModule} from 'inversify';
import {configLoaderModule} from '../../config/di/config-loader-module.function';
import {ConfigLoader} from '../../config/service/config-loader.service';
import {CONFIG_TYPES} from '../../config/di';
import {Command} from 'commander';
import {EventSpecification} from './config/event-specification.config';

var program = new Command();

program
   .version('0.1.0')
   .option('-t, --task', '', '')
   .parse(process.argv);

// const registry: IModuleRegistry = ModuleRegistry.getInstance();
//
// registry.loadModule(MODULES.SeedProofPoolBatchJob);
// registry.loadModule(MODULES.BatchJobApp);
//
// const application: Application = registry.get(DI_TYPES.Application);
// application.start((err) => {
//    if (!!err) {
//       console.error(err);
//    } else {
//       console.log('Recording successful application shutdown');
//    }
// });

var demo = new Command()
   .arguments('<configDir>')
   .action(demoAction)
   .parse(process.argv);

function demoAction(configDir: string) {
   console.log('Param[Key]:', configDir);
   const container: Container = new Container();
   container.load(
      new ContainerModule(configLoaderModule));
   container.bind(CONFIG_TYPES.RootConfigPath)
      .toConstantValue(configDir);

   const configLoader: ConfigLoader = container.get(CONFIG_TYPES.ConfigLoader);
   console.log(configLoader);

   const gameSpec: EventSpecification =
      configLoader.getConfig(EventSpecification, "eth.lotto.eventSpec");
   console.log('GameSpec:', gameSpec);
}

console.log(demo);
