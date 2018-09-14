import {SymbolEnum} from '../../../di';

export const LTC_TYPES: SymbolEnum<'Deployment' | 'EventSpecification' | 'SetupPolicy' > = {
   Deployment: Symbol.for("Deployment"),
   EventSpecification: Symbol.for("EventSpecification"),
   SetupPolicy: Symbol.for("SetupPolicy")
};

