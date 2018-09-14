import {Command} from 'commander';

var program = new Command();

program
   .version('0.1.0')
   .command('capture [name]', 'install one or more packages')
   .command('initStore', 'install one or more packages')
   .command('search [query]', 'search with optional query')
   .command('list', 'list packages installed', {isDefault: true})
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
