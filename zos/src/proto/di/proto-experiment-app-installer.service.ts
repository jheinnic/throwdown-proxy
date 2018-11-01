import {inject, injectable, interfaces, multiInject, tagged} from 'inversify';

import {ApplicationInstaller, DI_COMMON_TAGS} from '@jchptf/di-app-registry';
import {IContainerRegistryInstallerClient} from '@jchptf/di-app-registry';
import {ProtoExperiment} from '../config/proto-experiment.config';
import {TICKET_POOL_NAMES, TICKET_POOL_TYPES} from '../../modules/tickets/di';
import {PublicKeyContent} from '../../modules/tickets/values';
import {PublicKeyDataObject} from '../fixtures/public-key-data.object';
import {KeyPairLayoutFixture} from '../fixtures/key-pair-layout-fixture.class';
import {PROTO_APP_TYPES} from './types';
import {ArtworkLayoutFixture} from '../fixtures/artwork-layout-fixture.class';
import {PolicyMetadataAccess} from '../../modules/tickets/components/policies/policy-metadata-access.service';
import {KeyPairAccessFixture} from '../fixtures/keypair-access-fixture.class';
import {PaintInputTaskAdapter} from '../../modules/tickets/components';
import {CanvasCalculator} from '../../modules/randomArt/components';
import {RANDOM_ART_TYPES} from '../../modules/randomArt/di/types';

@injectable()
export class ProtoExperimentAppInstaller implements ApplicationInstaller {
   constructor(
      @inject(PROTO_APP_TYPES.ProtoExperimentConfig) private readonly config: ProtoExperiment
   ) {
      console.log(config.publicKeyFile);
   }

   install(client: IContainerRegistryInstallerClient): void {
      client.load((bind: interfaces.Bind) => {
         bind(PublicKeyDataObject)
            .to(PublicKeyDataObject)
            .inSingletonScope();

         bind(TICKET_POOL_TYPES.PolicyAssets)
            .toConstantValue(this.config.assetPolicies);
         bind(TICKET_POOL_TYPES.PolicyAccess)
            .to(PolicyMetadataAccess)
            .inSingletonScope();

         bind(TICKET_POOL_TYPES.KeyPairLayout).to(KeyPairLayoutFixture).inSingletonScope();
         bind(TICKET_POOL_TYPES.KeyPairAccess).to(KeyPairAccessFixture).inSingletonScope();
         bind(TICKET_POOL_TYPES.ArtworkLayout).to(ArtworkLayoutFixture).inSingletonScope();
         // bind(TICKET_POOL_TYPES.ArtworkAccess)

         bind(TICKET_POOL_TYPES.Name)
            .toConstantValue("Foo")
            .whenTargetTagged(DI_COMMON_TAGS.VariantFor, TICKET_POOL_NAMES.RenderPolicy);
         bind(TICKET_POOL_TYPES.Name)
            .toConstantValue("Bar")
            .whenTargetTagged(DI_COMMON_TAGS.VariantFor, TICKET_POOL_NAMES.RenderPolicy);

         bind(TICKET_POOL_TYPES.LoadPaintInputIterable)
            .to(PaintInputTaskAdapter)
            .inSingletonScope();

         bind(RANDOM_ART_TYPES.CanvasCalculator)
            .to(CanvasCalculator)
            .inSingletonScope()
         bind(RANDOM_ART_TYPES.CanvasWriter)
            .to()
      });
   }
}