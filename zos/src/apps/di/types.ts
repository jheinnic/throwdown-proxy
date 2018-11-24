import {SymbolEnum} from '@jchptf/api';

export const APP_CONFIG_TYPES: SymbolEnum<'Deployment' | 'EventSpecification' | 'PrizeMintingPolicy' | 'TicketMintingPolicy' | 'TicketStagingPolicy' | 'PlayAssets'> = {
   Deployment: Symbol.for('Deployment'),
   EventSpecification: Symbol.for('EventSpecification'),
   PrizeMintingPolicy: Symbol.for('PrizeMintingPolicy'),
   TicketMintingPolicy: Symbol.for('TicketMintingPolicy'),
   TicketStagingPolicy: Symbol.for('TicketStagingPolicy'),
   PlayAssets: Symbol.for('PlayAssets')
};

type ApplicationServiceTypes = 'MerkleTaskScanner' | 'PathMapCache';

export const APPLICATION_SERVICE_TYPES: SymbolEnum<ApplicationServiceTypes> = {
   MerkleTaskScanner: Symbol.for('MerkleTaskScanner'),
   PathMapCache: Symbol.for('PathMapCache')
};