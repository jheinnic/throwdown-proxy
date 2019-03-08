import {configClass, configProp} from '@jchptf/config';

@configClass('jchptf.boot.dataSource')
export class DataSourceConnection
{
   @configProp('host')
   public readonly host: string = '';

   @configProp('port')
   public readonly port: number = -1;

   @configProp('username')
   public readonly username: string = '';

   @configProp('password')
   public readonly password: string = '';

   @configProp('synchronize')
   public readonly synchronize: boolean = false;

   @configProp('maxQueryExecutionTime')
   public readonly maxQueryExecutionTime: number = -1;
}