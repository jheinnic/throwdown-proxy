import {inject, injectable, multiInject, tagged} from 'inversify';
import {illegalArgs} from '@thi.ng/errors';
import {IterableX} from 'ix/iterable';
import * as util from 'util';

import {DI_COMMON_TAGS} from '@jchptf/di-app-registry';
import {Name} from '../../../../infrastructure/validation';
import {IArtworkStagingLayout} from '../../interface/internal';
import {
   IKeyPairStagingAccess,
   IPolicyMetadataAccess, RenderStyleMetadata, RenderStyleName
} from '../../interface';
import {TICKET_POOL_NAMES, TICKET_POOL_TYPES} from '../../di';
import {LoadInputTaskMessage} from '../../values/load-input-task-message.value';


@injectable()
export class PaintInputTaskAdapter
{
   private readonly renderPolicies: Map<RenderStyleName, RenderStyleMetadata>;

   /**
    * Given an iterator over public key pairs, a domain of play asset metadata, and a list
    * of rendering policy names where each named policy MUST utilize the same image policy,
    * but may use different model seed policies, a PaintInputTaskAdapter is an Iterable whose
    * Iterators will return the series consisting of each key pair combined with each unique
    * rendering policy, ordered such that all render policies are enumerated for a given
    * public key before any rendering policies for the next key are returned.
    *
    * @param keyPairAccess
    * @param policyMetadataAccess
    * @param renderPolicyNames
    * @param artworkLayout
    */
   constructor(
      @inject(TICKET_POOL_TYPES.KeyPairAccess)
      private readonly keyPairAccess: IKeyPairStagingAccess,
      @inject(TICKET_POOL_TYPES.PolicyAccess)
      private readonly policyMetadataAccess: IPolicyMetadataAccess,
      @multiInject(TICKET_POOL_TYPES.Name) @tagged(DI_COMMON_TAGS.VariantFor, TICKET_POOL_NAMES.RenderPolicy)
      private readonly renderPolicyNames: ReadonlyArray<Name>,
      @inject(TICKET_POOL_TYPES.ArtworkLayout)
      private readonly artworkLayout: IArtworkStagingLayout
   )
   {
      this.renderPolicies =
         IterableX.from(
            this.policyMetadataAccess.findRenderStylesByName(
               this.renderPolicyNames)
         ).toMap(
            (value) => value.name,
            (value) => value
         );
      let imagePolicyName: undefined | Name;
      let renderPolicy: RenderStyleMetadata;

      for (renderPolicy of this.renderPolicies.values()) {
         if (!imagePolicyName) {
            imagePolicyName = renderPolicy.imageStyle.name;
         }

         if (imagePolicyName !== renderPolicy.imageStyle.name) {
            illegalArgs(
               `All selected renders must share the same image policy, but ${imagePolicyName} != ${renderPolicy.imageStyle.name}`
            );
         }
      }
   }

   *[Symbol.iterator](): IterableIterator<LoadInputTaskMessage>
   {
      for (let nextPublicKey of this.keyPairAccess.findAllKeyPairs(true)) {
         for (let nextRender of this.renderPolicies.values()) {
            yield new LoadInputTaskMessage(
               nextPublicKey,
               nextRender.name,
               this.policyMetadataAccess.getConfigVersion(),
               // nextRender.seedStrategy.modelSeedStrategy.extractSeed(
               //    nextPublicKey.publicKeyX, nextPublicKey.publicKeyY
               // ),
               this.artworkLayout.locateFullArtworkFile({
                  type: 'artwork',
                  slotIndex: nextPublicKey.slotIndex,
                  keyPairVersion: nextPublicKey.versionUuid,
                  assetPolicyVersion: this.policyMetadataAccess.getConfigVersion(),
                  renderStyleName: nextRender.name
               }).fullImagePath,
               {
                  resolve: () => {
                     console.log(`Resolved pipeline for ${util.inspect(nextPublicKey)}`)
                  },
                  reject: (err: any) => {
                     console.error(`Failed pipeline for ${util.inspect(nextPublicKey)}: ${err}`)
                  }
               }
            );
         }
      }
   }
}

