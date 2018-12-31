import {Type} from 'class-transformer';
import {ValidateNested} from 'class-validator';

import {configClass, configProp} from '@jchptf/config';
import {VaultAccess, KeySource, LocalAccess, DataSetPaths} from '.';
import {DEPLOYMENT_PROVIDER} from '../di';

@configClass('eth.lotto.deployment', DEPLOYMENT_PROVIDER)
export class Deployment
{
   @configProp('localAccess')
   @ValidateNested()
   @Type(() => LocalAccess)
   public readonly localAccess: LocalAccess = new LocalAccess();

   @configProp('vaultAccess')
   @ValidateNested()
   @Type(() => VaultAccess)
   public readonly vaultAccess: VaultAccess = new VaultAccess();

   @configProp('dataSetPaths')
   @ValidateNested()
   @Type(() => DataSetPaths)
   public readonly dataSetPaths: DataSetPaths = new DataSetPaths();

  @configProp('keySource')
   @ValidateNested()
   @Type(() => KeySource)
   public readonly keySource: KeySource = new KeySource();
}