import {PolicyModels} from '../../../../../../../out-tsc/lib/projects/jchptf/ngx-random-art/src/lib/store/models/policy.models';
import {PopulationModels} from './population.models';

export namespace FeatureModels {
  import EcosystemDocument = PolicyModels.EcosystemModelDocument;
  import PopulationParameters = PopulationModels.PopulationParameters;

  export interface State {
    ecosystemDocument: EcosystemDocument;
    populationViewFocus: PopulationParameters;
    //
    // Serve derived data from a service, not the model itself.
    // populationsByUuid: Map<string, PopulationParameters>;

    paint
  }
}
