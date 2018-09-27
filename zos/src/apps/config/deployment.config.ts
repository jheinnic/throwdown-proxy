import {Type} from 'class-transformer';
import {ValidateNested} from 'class-validator';

import {configClass, configProp} from '../../infrastructure/config/decorator/index';
import {VaultAccess, KeySource, LocalAccess, DataSetPaths} from '.';
import '../../infrastructure/reflection';

@configClass('eth.lotto.deployment')
export class Deployment
{
   @configProp('localAccess')
   public readonly localAccess: LocalAccess = new LocalAccess();

   @configProp('vaultAccess')
   @ValidateNested()
   @Type(() => VaultAccess)
   public readonly vaultAccess: VaultAccess = new VaultAccess();

   @configProp('dataSetPaths')
   @ValidateNested()
   @Type(() => DataSetPaths)
   public readonly vaultPaths: DataSetPaths = new DataSetPaths();

   @configProp('keySource')
   @ValidateNested()
   @Type(() => KeySource)
   public readonly keySource: KeySource = new KeySource();
}