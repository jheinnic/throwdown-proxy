import * as convict from 'convict';
import {BootstrapConfiguration} from './bootstrap-configuration.interface';

export const bootstrapSchema: convict.Schema<BootstrapConfiguration> = {
   env: {
      doc: 'The application environment.',
      format: ['production', 'development', 'test'],
      default: 'development',
   },
   cfgRoot: {
      doc: 'The root directory for configuration projects',
      format: function check(val: string) {
         if (!/^(\/)?([^/\0]+(\/)?)+$/.test(val)) {
            throw new Error('/-separated path wih no null characters');
         }
      },
      default: __dirname + '/config'
   },
   projDir: {
      doc: 'The root directory for active configuration project\'s files.',
      format: function check(val: string) {
         if (!/^[^/\0]+$/.test(val)) {
            throw new Error('path element wih no null characters');
         }
      },
      default: 'lotto'
   }
};