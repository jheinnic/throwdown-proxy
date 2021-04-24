import { BitStrategyKind } from '../../config';
import { Name } from '../../../../infrastructure/validation';
import { IModelSeed } from '../../../../apps/modules/roots/paint-gateway/follower/interface/model';

export interface IPaintModelSeedStrategy {
   readonly name: Name;

   readonly strategyKind: BitStrategyKind;

   extractSeed(publicKeyX: Buffer, publicKeyY: Buffer): IModelSeed | Promise<IModelSeed>
}