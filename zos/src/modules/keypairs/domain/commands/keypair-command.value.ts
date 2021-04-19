import { UUID } from '../../../../infrastructure/validation';
import { KeypairCommandType } from './keypair-command-type.type';

export abstract class KeypairCommand {
   public readonly aggregateId: UUID;
   public static readonly commandType: KeypairCommandType;

   protected constructor( aggregateId: UUID ) {
      this.aggregateId = aggregateId;
   }
}