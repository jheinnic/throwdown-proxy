import {UUID} from '../../../../src/infrastructure/validation';
import {IsUUID} from 'class-validator';

export class PublicKeyReply {
   @IsUUID()
   public readonly uuid: UUID;

   constructor( uuid: UUID ) {
      this.uuid = uuid;
   }
}

export interface IPublicKeyReply
   extends PublicKeyReply
{

}