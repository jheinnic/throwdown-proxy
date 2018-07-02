import {PolicyModels} from '../../../../../../../out-tsc/lib/projects/jchptf/ngx-random-art/src/lib/store/models/policy.models';

export namespace FeatureModels {
  import PopulationContract = PolicyModels.PopulationContract;
  import PopulationModelPolicy = PolicyModels.PopulationModelPolicy;
  import EcosystemModelDocument = PolicyModels.EcosystemModelDocument;

  export interface State {
    populationPolicy: {
      versionInUse: number
    }
  }

  export enum ContractPolicyState {
    NOT_LOADED,
    OLD_VERSION,
    LOADING_CONTRACT,
    LOADING_POLICY,
    LOADING_UPDATE,
    UP_TO_DATE,
  }

  export enum LocalCachePolicyState {
    NOT_LOADED,
    LOADING,
    UPDATING,
    UP_TO_DATE
  }

  export enum DocumentSourceType {
    NOT_LOADED,
    BUNDLED_CONTENT,
    FROM_CACHE,
    FROM_CONTRACT
  }

  export interface EcosystemDocumentVersions {
    sourceInUse: DocumentSourceType;
    versionInUse: string;
    newerVersionAvailable: boolean
    bundled: string;
    locallyCached?: string;
    contractTagged?: string;
    contractLoaded?: string
  }

  export interface ApplicationEcosystemState
  {
    documentVersions: EcosystemDocumentVersions;
    currentDocument: EcosystemModelDocument;
    populationFocus: PopulationModelPolicy;
  }
}
