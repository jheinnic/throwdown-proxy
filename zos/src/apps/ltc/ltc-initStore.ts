import {Container, ContainerModule} from 'inversify';
import {configLoaderModule} from '../../config/di/config-loader-module.function';
import {ConfigLoader} from '../../config/service/config-loader.service';
import {CONFIG_TYPES} from '../../config/di';
import {Command} from 'commander';
import {EventSpecification} from './config/event-specification.config';

var program = new Command();
program.option(
   '-b <filePath>, --bootstrap <filePath>',
   'Minimal bootstrap config file for locating the project config directory and environment.',
   (input: string, defaultValue: string) =>
      (!!input) ? input : defaultValue,
   './bootstrapLotto.json'
// ).option(
//    '-b <filePath>, --bootstrap <filePath>',
//    'Minimal bootstrap config file for locating the project config directory and environment.',
//    (input: string, defaultValue: string) => ((!!input) ? input : defaultValue),
//    './bootstrapLotto.json'
)
   .action(main)
   .parse(process.argv);

function main(bootstrap: string)
{
   const container: Container = new Container();
   container.load(
      new ContainerModule(configLoaderModule));
   container.bind(CONFIG_TYPES.RootConfigPath)
      .toConstantValue(bootstrap);

   const configLoader: ConfigLoader = container.get(CONFIG_TYPES.ConfigLoader);
   console.log(configLoader);

   const gameSpec: EventSpecification =
      configLoader.getConfig(EventSpecification, 'eth.lotto.eventSpec');
   console.log('GameSpec:', gameSpec);
}

console.log(program);
