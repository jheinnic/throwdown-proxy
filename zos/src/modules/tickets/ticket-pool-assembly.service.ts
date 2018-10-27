import {inject} from 'inversify';
import * as path from 'path';

import {
   BlockMappedDigestLocator, ICanonicalPathNaming, IMerkleCalculator, MERKLE_TYPES, MerkleDigestLocator,
   NamedPath
} from '@jchptf/merkle';
import {ArtworkLocator, Directories, ITicketPoolAssembly, KeyPairLocator} from './interface';
import {APP_CONFIG_TYPES} from '../../apps/di';
import {Deployment} from '../../apps/config';

export class TicketPoolAssembly implements ITicketPoolAssembly
{
   constructor(
      @inject(MERKLE_TYPES.MerkleCalculator) private readonly merkleCalc: IMerkleCalculator,
      @inject(MERKLE_TYPES.CanonicalNamingService) private readonly namingService: ICanonicalPathNaming,
      @inject(APP_CONFIG_TYPES.Deployment) private readonly deployment: Deployment)
   // @inject(APP_CONFIG_TYPES.EventSpecification) private readonly eventSpec: EventSpecification,
   // @inject(APP_CONFIG_TYPES.SetupPolicy) private readonly setupPolicy: SetupPolicy,
   // @inject(RANDOM_ART_CONFIG_TYPES.RandomArtPlayAssets) private readonly playAssets: RandomArtPlayAssets
   {

   }

   public* findArtwork(
      renderStyle: string, sourceKeys: Iterable<KeyPairLocator>): IterableIterator<ArtworkLocator>
   {
      let keyLocator: KeyPairLocator;
      for (keyLocator of sourceKeys) {
         const digestLocator = this.merkleCalc.findDigestByRecordAddress(keyLocator.slotLocator.index);
         const artName: NamedPath<MerkleDigestLocator> = this.namingService.getLeafDigestPathName(
            this.deployment.dataSetPaths.ticketArtwork, digestLocator
         );
         yield {
            type: 'artwork',
            slotLocator: keyLocator.slotLocator,
            renderStyle,
            publicKeyPath: keyLocator.publicKeyPath,
            autoImageCheckPath: keyLocator.autoImageCheckPath,
            fullImagePath: `${artName.name}_${renderStyle}_full.png`,
            thumbImagePath: `${artName.name}_${renderStyle}_thumb.png`
         };
      }
   }

   public* findAllDirectoriesDepthFirst(leftToRight?: boolean): IterableIterator<Directories>
   {
      let namedBlock: NamedPath<BlockMappedDigestLocator>;
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

   public* findAllKeyPairs(leftToRight?: boolean): IterableIterator<KeyPairLocator>
   {
      let digestName: NamedPath<MerkleDigestLocator>;
      for (digestName of this.namingService.findLeafDigestPathNames('', leftToRight))
      {
         yield {
            type: 'key-pair',
            slotLocator: {
               index: digestName.pathTo.index
            },
            publicKeyPath: path.join(this.deployment.dataSetPaths.ticketPublicKeys, `${digestName.name}_publicKey.dat`),
            privateKeyPath: path.join(this.deployment.dataSetPaths.ticketPrivateKeys, `${digestName.name}_privateKey.dat`),
            autoImageCheckPath: path.join(this.deployment.dataSetPaths.ticketArtwork, `${digestName.name}_imageCheck.png`),
         };
      }
   }

   public findAllArtwork(renderStyle: string): IterableIterator<ArtworkLocator>
   {
      return this.findArtwork(renderStyle, this.findAllKeyPairs());
   }

   public* findLeafDirectories(leftToRight?: boolean): IterableIterator<Directories>
   {
      let namedBlock: NamedPath<BlockMappedDigestLocator>;
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