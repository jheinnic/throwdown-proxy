import {BlockMappedDigestLocator} from '../../locator';
import {Deployment} from '../../../../apps/config';
import * as path from 'path';
import {TicketPoolRecord} from './ticket-pool-record.value';

export type TicketPoolNodeType = 'record' | 'directory';

// export interface TicketPoolDirectory
// {
//    name: string;
//    type: 'record | directory'
//    merkleBlock: BlockMappedDigestLocator;
//    publicKeyPath: string;
//    privateKeyPath: string;
//    imageStorePath: string;
// }

export class TicketPoolDirectory {
   public readonly nodeType: 'directory' = 'directory';

   constructor(
      public readonly name: string,
      public readonly merkleBlock: BlockMappedDigestLocator,
      private readonly deployment: Deployment)
   {

   }

   public get publicKeyStorePath(): string {
      return path.join(
         this.deployment.dataSetPaths.ticketPublicKeys,
         this.name
      )
   }

   public get privateKeyStorePath(): string {
      return path.join(
         this.deployment.dataSetPaths.ticketPrivateKeys,
         this.name
      )
   }

   public get artStorePath(): string {
      return path.join(
         this.deployment.dataSetPaths.ticketArtwork,
         this.name
      )
   }
}

export type TicketPoolNode = TicketPoolDirectory | TicketPoolRecord;

