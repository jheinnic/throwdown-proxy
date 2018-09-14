import {IsIn, ValidateNested} from 'class-validator';
import {Type} from 'class-transformer';
import {configClass, configProp} from '../../../config/decorator/index';
import '../../../reflection/index';
import {ShufflePolicy} from './shuffle-policy.config';
import {ProofSeed} from './proof-seed.config';
import {BlockLayout} from './block-layout.config';
import {TierNoncePolicy} from './tier-nonce-policy.config';
import {SerialNoncePolicy} from './serial-nonce-policy.config';

@configClass("eth.lotto.setupPolicy")
export class SetupPolicy {
   @configProp("randomSource")
   @IsIn(["nodeCrypto", "randomOrg"])
   public readonly randomSource: string = '';

   @configProp("secureStore")
   @IsIn(["localFiles", "vaultService"])
   public readonly secureStore: string = '';

   @configProp("blockLayout")
   @ValidateNested()
   @Type(() => BlockLayout)
   public readonly blockLayout: BlockLayout = new BlockLayout();

   @configProp("shufflePolicy")
   @ValidateNested()
   @Type(() => ShufflePolicy)
   public readonly shufflePolicy: ShufflePolicy = new ShufflePolicy();

   @configProp("tierNoncePolicy")
   @ValidateNested()
   @Type(() => SerialNoncePolicy)
   public readonly serialNoncePolicy: SerialNoncePolicy = new SerialNoncePolicy();

   @configProp("serialNoncePolicy")
   @ValidateNested()
   @Type(() => TierNoncePolicy)
   public readonly tierNoncePolicy: TierNoncePolicy = new TierNoncePolicy();

   @configProp("proofSeed")
   @ValidateNested()
   @Type(() => ProofSeed)
   public readonly proofSeed: ProofSeed = new ProofSeed();
}