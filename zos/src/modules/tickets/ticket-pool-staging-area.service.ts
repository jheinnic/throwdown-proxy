import { Injectable, Inject } from '@nestjs/common';
import * as path from 'path';

import {
   BlockMappedDigestLocator, ICanonicalPathNaming, IMerkleCalculator, INamedPath,
   MERKLE_PATH_NAMING_LPT,
   MERKLE_TREE_CALCULATOR_LPT, MerkleDigestLocator,
} from '@jchptf/merkle';

import {
   TicketArtworkLocator, KeyPairLocator,
   IArtworkStagingLayout, IKeyPairStagingLayout,
   IArtworkStagingAccess, IKeyPairStagingAccess,
} from './interface';
import { Name, UUID } from '../../infrastructure/validation';
import { Deployment } from '../../apps/oldConfig';

@Injectable()
export class TicketPoolAssembly implements IKeyPairStagingLayout, IKeyPairStagingAccess, IArtworkStagingLayout, IArtworkStagingAccess
{
   constructor(
      @Inject(MERKLE_TREE_CALCULATOR_LPT) private readonly merkleCalc: IMerkleCalculator,
      @Inject(MERKLE_PATH_NAMING_LPT) private readonly namingService: ICanonicalPathNaming,
      @Inject(Deployment) private readonly deployment: Deployment)
   // @inject(APP_CONFIG_TYPES.EventSpecification) private readonly eventSpec: EventSpecification,
   // @inject(APP_CONFIG_TYPES.SetupPolicy) private readonly setupPolicy: SetupPolicy,
   // @inject(RANDOM_ART_CONFIG_TYPES.RandomArtPlayAssets) private readonly playAssets: RandomArtPlayAssets
   {

   }

   public* findArtwork(
      renderStyleName: Name, sourceKeys: Iterable<KeyPairLocator>): IterableIterator<TicketArtworkLocator>
   {
      let keyLocator: KeyPairLocator;
      for (keyLocator of sourceKeys) {
         const digestLocator = this.merkleCalc.findLeafDigestByIndex(keyLocator.slotIndex.relativeAssetIndex);
         const artName: INamedPath<MerkleDigestLocator> = this.namingService.getLeafDigestPathName(
            this.deployment.dataSetPaths.ticketArtwork, digestLocator
         );
         yield {
            type: 'artwork',
            slotIndex: keyLocator.slotIndex,
            renderStyleName,
            keyPairVersion: '' as UUID,
            assetPolicyVersion: '' as UUID,
            // publicKeyPath: keyLocator.publicKeyPath,
            // autoImageCheckPath: keyLocator.autoImageCheckPath,
            // fullImagePath: `${artName.name}_${renderStyle}_full.png`,
            // thumbImagePath: `${artName.name}_${renderStyle}_thumb.png`
         };
      }
   }

   public* findAllDirectoriesDepthFirst(leftToRight?: boolean): IterableIterator<Directories>
   {
      let namedBlock: INamedPath<BlockMappedDigestLocator>;
      for (namedBlock of this.namingService.findAllBlocksPathNamesDepthFirst('', leftToRight)) {
         yield {
            type: 'directory',
            publicKeyDir: path.join(this.deployment.dataSetPaths.ticketPublicKeys, namedBlock.name),
            privateKeyDir: path.join(this.deployment.dataSetPaths.ticketPrivateKeys, namedBlock.name),
            imageStoreDir: path.join(this.deployment.dataSetPaths.ticketArtwork, namedBlock.name),
            merkleBlock: namedBlock.pathTo
         };
      }
   }

   public* findAllKeyPairs(leftToRight?: boolean): IterableIterator<KeyPairFilePath>
   {
      let digestName: INamedPath<MerkleDigestLocator>;
      for (digestName of this.namingService.findLeafDigestPathNames('', leftToRight))
      {
         yield {
            type: 'key-pair',
            slotIndex: {
               depthLevel: digestName.pathTo.layer.depth,
               directoryIndex: digestName.pathTo.index,
               relativeAssetIndex: digestName.pathTo.index % digestName.pathTo.layer.size
            },
            publicKeyPath: path.join(this.deployment.dataSetPaths.ticketPublicKeys, `${digestName.name}_publicKey.dat`),
            privateKeyPath: path.join(this.deployment.dataSetPaths.ticketPrivateKeys, `${digestName.name}_privateKey.dat`),
            autoImageCheckPath: path.join(this.deployment.dataSetPaths.ticketArtwork, `${digestName.name}_imageCheck.png`),
         };
      }
   }

   public findAllArtwork(renderStyleName: Name): IterableIterator<TicketArtworkLocator>
   {
      return this.findArtwork(renderStyleName, this.findAllKeyPairs());
   }

   public* findLeafDirectories(leftToRight?: boolean): IterableIterator<Directories>
   {
      let namedBlock: INamedPath<BlockMappedDigestLocator>;
      for (namedBlock of this.namingService.findLeafBlockPathNames('', leftToRight)) {
         yield {
            type: 'directory',
            publicKeyDir: path.join(this.deployment.dataSetPaths.ticketPublicKeys, namedBlock.name),
            privateKeyDir: path.join(this.deployment.dataSetPaths.ticketPrivateKeys, namedBlock.name),
            imageStoreDir: path.join(this.deployment.dataSetPaths.ticketArtwork, namedBlock.name),
            merkleBlock: namedBlock.pathTo
         };
      }
   }

   /*
   TODO
   public getBlockDirectories(digestBlock: BlockMappedDigestLocator): Directories
   {
      return undefined;
   }

   public getDigestArtwork(renderStyle: string, leafDigest: MerkleDigestLocator): ArtworkLocator
   {
      return undefined;
   }

   public getDigestKeyPair(leafDigest: MerkleDigestLocator): KeyPairLocator
   {
      return undefined;
   }

   public getDigestLocator(slotLocator: TicketSlotLocator): MerkleDigestLocator
   {
      return undefined;
   }
    */
}