import {configClass, configProp} from '@jchptf/config';
import {IsDefined, IsNotEmpty, Min} from 'class-validator';

@configClass('jchptf.boot.consul.config')
export class ConsulConfigKey {
   @configProp('key')
   @IsDefined()
   @IsNotEmpty()
   public readonly key: string = '';

   @configProp('retry', 5)
   @Min(0)
   public readonly retry: number = -1;
}