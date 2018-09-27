import {Container, ContainerModule} from 'inversify';
import {Command} from 'commander';
import {CONFIG_TYPES, configLoaderModule, ConfigLoader} from '../../infrastructure/config/';
import {LottoConfig} from '../config';
import {configContainerModule} from '../di';

var program = new Command();
program
   .action(main)
   .parse(process.argv);

function main()
{
   const container: Container = new Container();
   container.load(
      new ContainerModule(configLoaderModule));
   container.load(
      new ContainerModule(configContainerModule));

   const configLoader: ConfigLoader = container.get(CONFIG_TYPES.ConfigLoader);
   console.log(configLoader);

   const lottoConfig = configLoader.getConfig(LottoConfig, 'eth.lotto');
   console.log('Lotto Config:', lottoConfig);
}

console.log(program);
