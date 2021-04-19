import { BitStrategyKind } from '../../config';
import { Name } from '../../../../infrastructure/validation';
import { IArtworkSeed } from '../../../../apps/modules/roots/paint-gateway/follower/interface/model';

export interface IPaintModelSeedStrategy {
   readonly name: Name;

   readonly strategyKind: BitStrategyKind;

   extractSeed(publicKeyX: Buffer, publicKeyY: Buffer): IArtworkSeed | Promise<IArtworkSeed>
}