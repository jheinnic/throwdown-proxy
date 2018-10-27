import {SymbolEnum} from '../../../infrastructure/lib/index';

export const RANDOM_ART_CONFIG_TYPES: SymbolEnum<'RandomArtPlayAssets'> = {
   RandomArtPlayAssets: Symbol.for('RandomArtPlayAssets')
};

type TicketPoolType = 'TicketPoolAssembly';

export const TICKET_POOL_TYPES: SymbolEnum<TicketPoolType> = {
   TicketPoolAssembly: Symbol.for('TicketPoolAssembly')
}
