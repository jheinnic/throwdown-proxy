import {inject} from 'inversify';
import {MERKLE_TYPES} from '../../infrastructure/merkle/di';
import {IMerkleCalculator} from '../../infrastructure/merkle/interface';
import {APP_CONFIG_TYPES} from '../../apps/di';
import {RANDOM_ART_CONFIG_TYPES} from './di';
import {Deployment, EventSpecification, SetupPolicy} from '../../apps/config';
import {RandomArtPlayAssets} from './config';

export class TicketAllocation { // implements ITicketAllocation {
   constructor(
      @inject(MERKLE_TYPES.MerkleCalculator) private readonly merkleCalc: IMerkleCalculator,
      @inject(APP_CONFIG_TYPES.Deployment) private readonly delpoymentConfig: Deployment,
      @inject(APP_CONFIG_TYPES.EventSpecification) private readonly eventSpec: EventSpecification,
      @inject(APP_CONFIG_TYPES.SetupPolicy) private readonly setupPolicy: SetupPolicy,
      @inject(RANDOM_ART_CONFIG_TYPES.RandomArtPlayAssets) private readonly playAssets: RandomArtPlayAssets
   ) {

   }

   public bootstrapContent(): void
   {
      merkle
   }

}