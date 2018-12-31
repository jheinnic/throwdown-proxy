import {injectable, multiInject} from 'inversify';
import {Command} from 'commander';
import {LTC_TYPES} from '../di';
import {SubCommandPlugin} from './sub-command-plugin.class';

@injectable()
export class LtcApp{
   constructor( @multiInject(LTC_TYPES.CommandPlugin) private readonly commandPlugins: SubCommandPlugin[] ) {
   }

   public main(): void {
      let program = new Command();

   }
}