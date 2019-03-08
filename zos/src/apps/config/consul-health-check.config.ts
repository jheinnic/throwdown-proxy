import {configClass, configProp} from '@jchptf/config';
import {IsDefined, IsNotEmpty} from 'class-validator';

@configClass('jchptf.boot.consul.health_check')
export class ConsulHealthCheck {
   @configProp('timeout')
   @IsDefined()
   @IsNotEmpty()
   public readonly timeout: string = '';

   @configProp('interval')
   @IsDefined()
   @IsNotEmpty()
   public readonly interval: string = '';
}