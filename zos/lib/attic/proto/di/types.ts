import {SymbolEnum} from '@jchptf/api';

type ProtoAppTypes = 'ProtoExperimentApp' | 'ProtoExperimentConfig';

export const PROTO_APP_TYPES: SymbolEnum<ProtoAppTypes> = {
   ProtoExperimentApp: Symbol.for('ProtoExperimentApp'),
   ProtoExperimentConfig: Symbol.for('ProtoExperimentConfig')
};