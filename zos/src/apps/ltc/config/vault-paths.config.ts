import {Matches} from 'class-validator';
import {configClass, configProp} from '../../../config/decorator/index';
import '../../../reflection/index';

@configClass('eth.lotto.deployment.vaultPaths')
export class VaultPaths
{
   @configProp('proveSeedNonce')
   @Matches(/^([^/\0]+\/)*[^/\0]+$/)
   public readonly proveSeedNonce: string = '';

   @configProp('prizeTierNonce')
   @Matches(/^([^/\0]+\/)*[^/\0]+$/)
   public readonly prizeTierNonce: string = '';

   @configProp('prizeSerialNonce')
   @Matches(/^([^/\0]+\/)*[^/\0]+$/)
   public readonly prizeSerialNonce: string = '';

   @configProp('shufflePrizes')
   @Matches(/^([^/\0]+\/)*[^/\0]+$/)
   public readonly shufflePrizes: string = '';

   @configProp('shuffleTickets')
   @Matches(/^([^/\0]+\/)*[^/\0]+$/)
   public readonly shuffleTickets: string = '';

   @configProp('placePrizeWitness')
   @Matches(/^([^/\0]+\/)*[^/\0]+$/)
   public readonly placePrizeWitness: string = '';

   @configProp('ticketRandomWitness')
   @Matches(/^([^/\0]+\/)*[^/\0]+$/)
   public readonly ticketRandomWitness: string = '';

   @configProp('randomOrgApi')
   @Matches(/^([^/\0]+\/)*[^/\0]+$/)
   public readonly randomOrgApi: string = '';
}