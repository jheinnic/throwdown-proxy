import {IsUrl, Matches, MinLength} from 'class-validator';

import {configClass, configProp} from '@jchptf/config';


@configClass("eth.lotto.deployment.vaultAccess")
export class VaultAccess {
   @configProp("apiVersion")
   @Matches(/^v\d+$/)
   public readonly apiVersion: string = '';

   @configProp("endpoint")
   @IsUrl()
   public readonly endpoint: string = '';

   @configProp("token")
   @MinLength(3)
   public readonly token: string = '';

   @configProp("rootPath")
   @Matches(/^([^/\0]+\/)*[^/\0]+$/)
   public readonly rootPath: string = '';
}