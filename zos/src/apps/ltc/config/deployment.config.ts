import {Type} from 'class-transformer';
import {ValidateNested} from 'class-validator';

import {configClass, configProp} from '../../../config/decorator/index';
import {VaultAccess} from './vault-access.config';
import {VaultPaths} from './vault-paths.config';
import {KeySource} from './key-source.config';
import '../../../reflection/index';

@configClass('eth.lotto.deployment')
export class Deployment
{
   @configProp('vaultAccess')
   @ValidateNested()
   @Type(() => VaultAccess)
   public readonly vaultAccess: VaultAccess = new VaultAccess();

   @configProp('vaultPaths')
   @ValidateNested()
   @Type(() => VaultPaths)
   public readonly vaultPaths: VaultPaths = new VaultPaths();

   @configProp('keySource')
   @ValidateNested()
   @Type(() => KeySource)
   public readonly keySource: KeySource = new KeySource();
}