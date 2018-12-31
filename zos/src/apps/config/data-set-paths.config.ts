import {Matches} from 'class-validator';

import {configClass, configProp} from '@jchptf/config';


@configClass('eth.lotto.deployment.dataSetPaths')
export class DataSetPaths
{
   @configProp('randomOrgApi')
   @Matches(/^([^/\0]+\/)*[^/\0]+$/)
   public readonly randomOrgApi: string = '';

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

   @configProp('placementKeyPairs')
   @Matches(/^([^/\0]+\/)*[^/\0]+$/)
   public readonly placementKeyPairs: string = '';

   @configProp('ticketRandomWitness')
   @Matches(/^([^/\0]+\/)*[^/\0]+$/)
   public readonly ticketRandomWitness: string = '';

   @configProp('ticketPublicKeys')
   @Matches(/^([^/\0]+\/)*[^/\0]+$/)
   public readonly ticketPublicKeys: string = '';

   @configProp('ticketPrivateKeys')
   @Matches(/^([^/\0]+\/)*[^/\0]+$/)
   public readonly ticketPrivateKeys: string = '';

   @configProp('ticketArtwork')
   @Matches(/^([^/\0]+\/)*[^/\0]+$/)
   public readonly ticketArtwork: string = '';

   @configProp('ticketTreeSlots')
   @Matches(/^([^/\0]+\/)*[^/\0]+$/)
   public readonly ticketTreeSlots: string = '';
}