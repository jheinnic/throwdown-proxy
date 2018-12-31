import {UUID} from '../../../../infrastructure/validation';

export abstract class KeypairCommand {
   readonly aggregateId: UUID;
   readonly commandType: KeypairCommandType;
}