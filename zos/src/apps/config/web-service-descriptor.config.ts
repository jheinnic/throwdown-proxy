import {configClass, configProp} from '@jchptf/config';
import {IsDefined, IsNotEmpty, Max, Min} from 'class-validator';

@configClass('jchptf.boot.web')
export class WebServiceDescriptor
{
   @configProp('serviceId', null)
   public readonly serviceId: string = '';

   @configProp('serviceName')
   @IsNotEmpty()
   @IsDefined()
   public readonly serviceName: string = '';

   @configProp('port', 8081)
   @Min(1)
   @Max(65535)
   public readonly port: number = -1;
}