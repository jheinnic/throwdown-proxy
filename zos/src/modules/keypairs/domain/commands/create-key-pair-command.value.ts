import { KeypairCommand } from './keypair-command.value';
import { UUID } from '../../../../infrastructure/validation';

export class CreateKeyPairCommand extends KeypairCommand
{
   public static readonly commandType = 'AllocateKeypair';

   constructor( aggregateId: UUID ) {
      super(aggregateId);
   }
}
