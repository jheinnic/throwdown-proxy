import {Action} from '@ngrx/store';
import {PolicyModels} from '../models/policy.models';

export namespace RandomArtActions {
  import EcosystemModelDocument = PolicyModels.EcosystemModelDocument;

  export enum ActionTypes {
    REQUEST_ECOSYSTEM_MODEL_BOOTSTRAP = "[RandomArt] Request Ecosystem Model",
    LOAD_BUNDLED_ECOSYSTEM_MODEL = "[RandomArt] Load Bundled Ecosystem Model",
  }

  export class RequestEcosystemModelBootstrap implements Action
  {
    public readonly type: string = ActionTypes.REQUEST_ECOSYSTEM_MODEL_BOOTSTRAP;
  }

  export class LoadBundledEcosystemModel implements Action
  {
    public readonly type: string = ActionTypes.LOAD_BUNDLED_ECOSYSTEM_MODEL;

    constructor(public readonly payload: EcosystemModelDocument)
    { }
  }

  export type Action = RequestEcosystemModelBootstrap | LoadBundledEcosystemModel;
}
