import {Command} from 'commander';

var program = new Command();

program
   .version('0.1.0')
   .command(
      'status',
      'retrieve and display a summary report on worker enrollment and current activity.',
      {isDefault: true})
   .command(
      'vault',
      'Most commands require an active session with vault store, which must also be in an unsealed' +
      'state.  Unseal and reseal, as well as authentication and logout begin here.')
   .command(
      'bootstrap',
      'Locally compute a graph of tasks and data sets required to launch the currently selected event ' +
      'and label each node for use with other commands.  Data sets, include entropy blocks, ECDSA ' +
      'key pairs, record shuffle maps, nonce sets, serial number sets, merkle trees, proof witnesses, ' +
      'ipfs publications, derived images, and perhaps even more artifacts not listed here.  Tasks are ' +
      'discrete activities that can be accomplished by a single worker and require access to read/write ' +
      'some number of data sets.')
   .command(
      'enroll',
      'vote to approve or reject public key material corresponding to private key material local to' +
      'a new worker node as prerequisite to accepting new tasks.')
   .command(
      'manage',
      'Some steps in the event publication workflow require interaction with an administrative user that ' +
      'cannot be delegated to a worker node.  Access such activities through this sub-command.')
   .command(
      'authorize',
      'Delegate work to an enrolled worker.'
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
