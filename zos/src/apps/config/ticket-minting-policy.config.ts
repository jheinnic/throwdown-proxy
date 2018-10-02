import {IsIn, ValidateNested} from 'class-validator';

import {configClass, configProp} from '../../infrastructure/config';
import {EntropyAlgorithmSelection} from './entropy-algorithm-selection.config';
import '../../infrastructure/reflection';

@configClass('eth.lotto.setupPolicy.mintTicketsPolicy')
export class TicketMintingPolicy {
   @configProp('entropy')
   @ValidateNested()
   public readonly entropy: EntropyAlgorithmSelection = new EntropyAlgorithmSelection();

   @configProp('curve')
   @IsIn(['ed25519', 'sec256pk1'])
   public readonly curve: ('ed25519' | 'sec256pk1') = 'ed25519';
}