import {BlockMappedDigestLocator, MerkleDigestLocator} from '../../locator/index';
import {Deployment, RandomArtPlayAssets, SetupPolicy} from '../../../../apps/config';
import * as path from "path";

export class TicketPoolRecord {
   public readonly nodeType: 'record' = 'record';

   constructor(
      public readonly name: string,
      public readonly merkleDigest: MerkleDigestLocator,
      private readonly deployment: Deployment,
      private readonly setupPolicy: SetupPolicy)
      // private readonly playAssets: RandomArtPlayAssets)
   {

   }

   public get publicSeedKeyPath(): string {
      return path.join(
         this.deployment.dataSetPaths.ticketPublicKeys,
         `${this.name}-rev${this.setupPolicy.ticketMinting.seedGeneration}.key`
      )
   }

   public get privateSeedKeyPath(): string {
      return path.join(
         this.deployment.dataSetPaths.ticketPrivateKeys,
         `${this.name}-rev${this.setupPolicy.ticketMinting.seedGeneration}.key`
      )
   }

   public get publicPaintKeyPath(): string {
      return path.join(
         this.deployment.dataSetPaths.ticketPublicKeys,
         `${this.name}-rev${this.setupPolicy.ticketMinting.paintGeneration}.key`
      )
   }

   public get privatePaintKeyPath(): string {
      return path.join(
         this.deployment.dataSetPaths.ticketPrivateKeys,
         `${this.name}-rev${this.setupPolicy.ticketMinting.paintGeneration}.key`
      )
   }

   public get keyCheckArtPath(): string {
      return path.join(
         this.deployment.dataSetPaths.ticketArtwork,
         `${this.name}-`
      )
   }

   public get previewArtPath(): string {
      return path.join(
         this.deployment.dataSetPaths.ticketArtwork,
         this.name
      )
   }

   public get currentArtPath(): string {
      return path.join(
         this.deployment.dataSetPaths.ticketArtwork,
         this.name
      )
   }
}
