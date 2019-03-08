import {IsDefined, ValidateNested} from 'class-validator';
import {Type} from 'class-transformer';

import {configClass, configProp} from '@jchptf/config';

import {WebServiceDescriptor} from './web-service-descriptor.config';
import {ConsulConnection} from './consul-connection.config';
import {DataSourceConnection} from './data-source-connection.config';

// import {AppConfigConstants} from './app-config.constants';
// import APP_BOOTSTRAP_PROVIDER = AppConfigConstants.APP_BOOTSTRAP_PROVIDER_TOKEN;

@configClass('jchptf.boot')
export class AppBootstrap
{
   @configProp('web')
   @IsDefined()
   @ValidateNested()
   @Type(() => WebServiceDescriptor)
   public readonly web: WebServiceDescriptor = new WebServiceDescriptor();

   @configProp('consul')
   @IsDefined()
   @ValidateNested()
   @Type(() => ConsulConnection)
   public readonly consul: ConsulConnection = new ConsulConnection();

   @configProp('dataSource')
   @IsDefined()
   @ValidateNested()
   @Type(() => DataSourceConnection)
   public readonly dataSource: DataSourceConnection = new DataSourceConnection();
}