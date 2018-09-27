import {MERKLE_TYPES} from '../../infrastructure/merkle/di/index';
import {inject} from 'inversify';
import {IMerkleCalculator} from '../../infrastructure/merkle/interface/index';
import {APP_CONFIG_TYPES} from '../../apps/di/index';
import {Deployment, EventSpecification, SetupPolicy} from '../../apps/config/index';

export class TicketAllocation { // implements ITicketAllocation {
   constructor(
      @inject(MERKLE_TYPES.MerkleCalculator) private readonly merkleCalc: IMerkleCalculator,
      @inject(APP_CONFIG_TYPES.Deployment) private readonly delpoymentConfig: Deployment,
      @inject(APP_CONFIG_TYPES.EventSpecification) private readonly eventSpec: EventSpecification,
      @inject(APP_CONFIG_TYPES.SetupPolicy) private readonly setupPolicy: SetupPolicy
   ) {

   }

   public bootstrapContent(): void
   {
      merkle
   }

}