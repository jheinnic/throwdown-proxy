import {IsIn, ValidateNested} from 'class-validator';
import {Type} from 'class-transformer';

import {configClass, configProp} from '@jchptf/config';
import {ShufflePolicy} from './shuffle-policy.config';
import {ProofSeed} from './proof-seed.config';
import {BlockLayout} from './block-layout.config';
import {TierNoncePolicy} from './tier-nonce-policy.config';
import {SerialNoncePolicy} from './serial-nonce-policy.config';
import {EntropyAlgorithms} from './entropy-algorithms.config';
import {EntropyAlgorithmSelection} from './entropy-algorithm-selection.config';
import {PRIZE_MINTING_POLICY_PROVIDER} from '../di';

@configClass('eth.lotto.prizeMinting', PRIZE_MINTING_POLICY_PROVIDER)
export class PrizeMintingPolicy {
   @configProp('entropySource')
   @ValidateNested()
   @Type(() => EntropyAlgorithmSelection)
   public readonly entropySource: EntropyAlgorithmSelection = new EntropyAlgorithmSelection();

   @configProp('secureStore')
   @IsIn(['localFiles', 'vaultService'])
   public readonly secureStore: string = '';

   @configProp('blockLayout')
   @ValidateNested()
   @Type(() => BlockLayout)
   public readonly blockLayout: BlockLayout = new BlockLayout();

   @configProp('shufflePolicy')
   @ValidateNested()
   @Type(() => ShufflePolicy)
   public readonly shufflePolicy: ShufflePolicy = new ShufflePolicy();

   @configProp('tierNoncePolicy')
   @ValidateNested()
   @Type(() => SerialNoncePolicy)
   public readonly serialNoncePolicy: SerialNoncePolicy = new SerialNoncePolicy();

   @configProp('serialNoncePolicy')
   @ValidateNested()
   @Type(() => TierNoncePolicy)
   public readonly tierNoncePolicy: TierNoncePolicy = new TierNoncePolicy();

   @configProp('proofSeed')
   @ValidateNested()
   @Type(() => ProofSeed)
   public readonly proofSeed: ProofSeed = new ProofSeed();

   // @configProp('ticketMintingPolicy')
   // @ValidateNested()
   // @Type(() => TicketMintingPolicy)
   // public readonly ticketMinting: TicketMintingPolicy = new TicketMintingPolicy();

   @configProp('entropyDefaults')
   @ValidateNested()
   @Type(() => EntropyAlgorithms)
   public readonly entropyDefaults: EntropyAlgorithms = new EntropyAlgorithms();
}