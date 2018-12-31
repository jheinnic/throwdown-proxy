import {Command} from 'commander';

var program = new Command();

program
   .version('0.1.0')
   .command(
      'initWorkspace',
      'populate fill the vault store'
   )
   .command(
      'capture',
      'Authorize enrolled workers to capture, store, label, and sign quantities of entropy')
   .command(
      'nonce',
      'Authorize enrolled workers to consume allotments of entropy required for nonce creation')
   .command(
      'shuffle',
      'Authorize enrolled workers to consume an allotment of entropy to perform a specified shuffle ' +
      'round and write out its result.'
   )
   .command(
      'ticket',
      'Authorize enrolled workers to consume an allotment of entropy '
   )
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

// var demo = new Command()
//    .arguments('<configDir>')
//    .action(demoAction)
//    .parse(process.argv);
//
// function demoAction(configDir: string) {
//    console.log('Param[Key]:', configDir);
//    const container: Container = new Container();
//    container.load(
//       new ContainerModule(configLoaderModule));
//    container.bind(CONFIG_TYPES.RootConfigPath)
//       .toConstantValue(configDir);
//
//    const configLoader: ConfigLoader = container.get(CONFIG_TYPES.ConfigLoader);
//    console.log(configLoader);
//
//    const gameSpec: EventSpecification =
//       configLoader.getConfig(EventSpecification, "eth.lotto.eventSpec");
//    console.log('GameSpec:', gameSpec);
// }
//
// console.log(demo);
