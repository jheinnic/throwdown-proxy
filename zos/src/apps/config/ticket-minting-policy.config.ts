import {IsIn, Min, ValidateNested} from 'class-validator';

import {configClass, configProp} from '@jchptf/config';
import {EntropyAlgorithmSelection} from './entropy-algorithm-selection.config';
import '../../infrastructure/reflection';

@configClass('eth.lotto.setupPolicy.ticketMintingPolicy')
export class TicketMintingPolicy {
   @configProp('entropy')
   @ValidateNested()
   public readonly entropy: EntropyAlgorithmSelection = new EntropyAlgorithmSelection();

   @configProp('curve')
   @IsIn(['ed25519', 'sec256pk1'])
   public readonly curve: ('ed25519' | 'sec256pk1') = 'ed25519';

   @configProp('seedGeneration')
   @Min(0)
   public readonly seedGeneration: number = 0;

   @configProp('paintGeneration')
   @Min(0)
   public readonly paintGeneration: number = 0;
}