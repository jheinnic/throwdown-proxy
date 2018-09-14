import {Container, ContainerModule} from 'inversify';
import {configLoaderModule} from '../../config/di/config-loader-module.function';
import {ConfigLoader} from '../../config/service/config-loader.service';
import {CONFIG_TYPES} from '../../config/di';
import {Command} from 'commander';
import {LottoConfig} from './config/lotto-config.config';

var program = new Command();
program//.option(
// )
   // '-b <filePath>, --bootstrap <filePath>',
   // 'Minimal bootstrap config file for locating the project config directory and environment.',
   // (input: string, defaultValue: string) => (!!input) ? input : defaultValue,
   // (!!process.env['LOTTO_BOOTSTRAP']) ? process.env['LOTTO_BOOTSTRAP'] : './bootstrapLotto.json'
// ).option(
//    '-b <filePath>, --bootstrap <filePath>',
//    'Minimal bootstrap config file for locating the project config directory and environment.',
//    (input: string, defaultValue: string) => ((!!input) ? input : defaultValue),
//    './bootstrapLotto.json'
   .action(main)
   .parse(process.argv);

function main()
{
   const container: Container = new Container();
   let lottoConfig: LottoConfig = new LottoConfig();
   container.load(
      new ContainerModule(configLoaderModule));
   // container.bind(CONFIG_TYPES.RootConfigPath)
   //    .toConstantValue(bootstrap);

   const configLoader: ConfigLoader = container.get(CONFIG_TYPES.ConfigLoader);
   console.log(configLoader);

   lottoConfig = configLoader.getConfig(LottoConfig, 'eth.lotto');
   console.log('Lotto Config:', lottoConfig);
}

console.log(program);
