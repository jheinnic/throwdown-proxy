import {SymbolEnum} from '@jchptf/api';

type MessageDITypes = 'HeadersConstructor'

export const MESSAGE_DI_TYPES: SymbolEnum<MessageDITypes> = {
   HeadersConstructor: Symbol.for('HeadersConstructor')
};