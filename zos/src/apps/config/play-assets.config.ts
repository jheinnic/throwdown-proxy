import {IsIn} from 'class-validator';

import {configClass, configProp} from '@jchptf/di-app-registry';
import '@jchptf/reflection';

@configClass('eth.lotto.playAssets')
export class PlayAssets
{
   @configProp('ticketStyle')
   @IsIn(['randomArt'])
   public readonly ticketStyle: 'randomArt' = 'randomArt';
}
