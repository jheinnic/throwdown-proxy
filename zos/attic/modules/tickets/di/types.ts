import {SymbolEnum} from '@jchptf/api';

export const RANDOM_ART_CONFIG_TYPES: SymbolEnum<'RandomArtPlayAssets'> = {
   RandomArtPlayAssets: Symbol.for('RandomArtPlayAssets')
};

type TicketPoolType =
   'KeyPairAccess'
   | 'KeyPairLayout'
   | 'ArtworkAccess'
   | 'ArtworkLayout'
   | 'LoadPaintInputIterable'
   | 'PolicyAccess'
   | 'PolicyAssets'
   | 'Name'
   ;

export const TICKET_POOL_TYPES: SymbolEnum<TicketPoolType> = {
   KeyPairAccess: Symbol.for('KeyPairAccess'),
   KeyPairLayout: Symbol.for('KeyPairLayout'),
   ArtworkAccess: Symbol.for('ArtworkAccess'),
   ArtworkLayout: Symbol.for('ArtworkLayout'),
   PolicyAccess: Symbol.for('PolicyAccess'),
   PolicyAssets: Symbol.for('PolicyAssets'),
   LoadPaintInputIterable: Symbol.for('LoadPaintInputIterable'),
   Name: Symbol.for('Name')
};
