import {configClass, configProp} from '@jchptf/config';
import {ConsulHealthCheck} from './consul-health-check.config';
import {ResolvesToIP} from '../../infrastructure/validation/resolves-to-ip.validator';
import {IsDefined, IsNotEmpty, IsPositive, Max, Min, ValidateNested} from 'class-validator';
import {Type} from 'class-transformer';
import {ConsulConfigKey} from './consul-config-key.config';
// import { AppConfigConstants } from './app-config.constants';
// import APP_BOOTSTRAP_PROVIDER_TOKEN = AppConfigConstants.APP_BOOTSTRAP_PROVIDER_TOKEN;

@configClass('jchptf.boot.consul')
export class ConsulConnection {
   @configProp('host', 'localhost')
   @ResolvesToIP()
   public readonly host: string = '';

   @configProp('port', 8081)
   @Min(0)
   @Max(65535)
   @IsDefined()
   public readonly port: number = -1;

   @configProp('discoveryHost')
   @IsDefined()
   @IsNotEmpty()
   public readonly discoveryHost: string = '';

   @configProp('health_check')
   @IsDefined()
   @ValidateNested()
   @Type(() => ConsulHealthCheck)
   public readonly health_check: ConsulHealthCheck = new ConsulHealthCheck();

   @configProp('max_retry', 5)
   @IsDefined()
   @Min(0)
   public readonly max_retry: number = -1;

   @configProp('retry_interval', 5000)
   @IsDefined()
   @IsPositive()
   public readonly retry_interval: number = -1;

   @configProp('config')
   @IsDefined()
   @ValidateNested()
   @Type(() => ConsulConfigKey)
   public readonly config: ConsulConfigKey = new ConsulConfigKey();
}