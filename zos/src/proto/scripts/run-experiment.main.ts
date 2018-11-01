import {Command} from 'commander';
import {ContainerRegistry} from '@jchptf/di-app-registry';
import {PROTO_APP_TYPES} from '../di';

var program = new Command();
program
   .version("0.0.1")
   .action(runCommand)
   .parse(process.argv);

// function parseList(list: string) {
//    let tokens = list.split(',');
//    return tokens.map(parseInt);
// }

function runCommand(_cmd: any) {
   const registry = ContainerRegistry.getInstance();
   registry.installApplication(PROTO_APP_TYPES.ProtoExperimentApp);
}
