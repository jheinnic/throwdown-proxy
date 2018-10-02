import {SymbolEnum} from '../../infrastructure/lib';

export const APP_CONFIG_TYPES: SymbolEnum<'Deployment' | 'EventSpecification' | 'SetupPolicy' | 'PlayAssets'> = {
   Deployment: Symbol.for('Deployment'),
   EventSpecification: Symbol.for('EventSpecification'),
   SetupPolicy: Symbol.for('SetupPolicy'),
   PlayAssets: Symbol.for('PlayAssets')
};

type ApplicationServiceTypes = 'MerkleTaskScanner' | 'PathMapCache';

export const APPLICATION_SERVICE_TYPES: SymbolEnum<ApplicationServiceTypes> = {
   MerkleTaskScanner: Symbol.for('MerkleTaskScanner'),
   PathMapCache: Symbol.for('PathMapCache')
};