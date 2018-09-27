import {inject, injectable} from 'inversify';
import {WORKER_COMMAND_INPUT_TYPES} from '../di/types';
import {InitWorkspaceCommand} from '../init-workspace-command.value';
import {MERKLE_TYPES} from '../../../infrastructure/merkle/di';
import {IMerkleCalculator} from '../../../infrastructure/merkle/interface';
import {APP_CONFIG_TYPES} from '../../di';
import {Deployment, EventSpecification, SetupPolicy} from '../../config';

@injectable()
export class InitWorkspaceCommandHandler {
   constructor(
      @inject(WORKER_COMMAND_INPUT_TYPES.InitWorkspace) private readonly command: InitWorkspaceCommand,
      @inject(MERKLE_TYPES.MerkleCalculator) private readonly merkleCalc: IMerkleCalculator,
      @inject(APP_CONFIG_TYPES.Deployment) private readonly delpoymentConfig: Deployment,
      @inject(APP_CONFIG_TYPES.EventSpecification) private readonly eventSpec: EventSpecification,
      @inject(APP_CONFIG_TYPES.SetupPolicy) private readonly setupPolicy: SetupPolicy
   ) {
   }

   execute() {

   }
}