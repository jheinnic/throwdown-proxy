import {ModelSeed} from '../../randomArt/messages';
import {BitStrategyKind} from '../config';

export interface IPaintModelSeedStrategy {
   readonly strategyName: string;

   readonly strategyKind: BitStrategyKind;

   extractSeed(publicKeyX: Buffer, publicKeyY: Buffer): ModelSeed
}