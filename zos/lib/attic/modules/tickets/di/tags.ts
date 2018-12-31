import {SymbolEnum} from '@jchptf/api';

type TicketPoolTags = 'NameType'

export const TICKET_POOL_TAGS: SymbolEnum<TicketPoolTags> = {
   NameType: Symbol.for('NameType')
}

type TicketPoolNames = 'ImagePolicy' | 'ModelSeedPolicy' | 'RenderPolicy';

export const TICKET_POOL_NAMES: SymbolEnum<TicketPoolNames> = {
   ImagePolicy: Symbol.for('ImagePolicy'),
   ModelSeedPolicy: Symbol.for('ModelSeedPolicy'),
   RenderPolicy: Symbol.for('RenderPolicy')
}