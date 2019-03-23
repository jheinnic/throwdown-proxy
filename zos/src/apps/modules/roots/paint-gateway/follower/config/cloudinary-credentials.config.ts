import { IsDefined, IsNotEmpty } from 'class-validator';

import { configClass, configProp } from '@jchptf/config';

@configClass('jchptf.paintGateway.cloudinary')
export class CloudinaryCredentials
{
   @configProp('cloud_name')
   @IsDefined()
   @IsNotEmpty()
   public readonly cloud_name: string = '';

   @configProp('api_key')
   @IsDefined()
   @IsNotEmpty()
   public readonly api_key: string = '';

   @configProp('api_secret')
   @IsDefined()
   @IsNotEmpty()
   public readonly api_secret: string = '';
}