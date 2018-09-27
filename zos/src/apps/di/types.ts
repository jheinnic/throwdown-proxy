import {SymbolEnum} from '../../infrastructure/lib';

export const APP_CONFIG_TYPES: SymbolEnum<'Deployment' | 'EventSpecification' | 'SetupPolicy' > = {
   Deployment: Symbol.for('Deployment'),
   EventSpecification: Symbol.for('EventSpecification'),
   SetupPolicy: Symbol.for('SetupPolicy')
};

type ApplicationServiceTypes = 'MerkleTaskScanner' | 'PathMapCache';

export const APPLICATION_SERVICE_TYPES: SymbolEnum<ApplicationServiceTypes> = {
   MerkleTaskScanner: Symbol.for('MerkleTaskScanner'),
   PathMapCache: Symbol.for('PathMapCache')
};