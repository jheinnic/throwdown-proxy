import Config from 'config'

var program = require('commander');

program
   .version('0.1.0')
   .command('install [name]', 'install one or more packages')
   .command('search [query]', 'search with optional query')
   .command('list', 'list packages installed', {isDefault: true})
   .parse(process.argv);
/*
const registry: IModuleRegistry = ModuleRegistry.getInstance();

registry.loadModule(MODULES.SeedProofPoolBatchJob);
registry.loadModule(MODULES.BatchJobApp);

const application: Application = registry.get(DI_TYPES.Application);
application.start((err) => {
   if (!!err) {
      console.error(err);
   } else {
      console.log('Recording successful application shutdown');
   }
});
*/


process.env.NODE_CONFIG_DIR = './mypool/';
const cfg1 = Config.get('eth.lotto.eventSpec.prizePool');
const cfg2 = Config.get('eth.lotto.eventSetup.proofSeed');

console.log(cfg1);
console.log(cfg2);

// + '    eventSpec:\n'
// + '      sponsorId: 9\n'
// + '      gameId: 138\n'
// + '      prizePool:')
