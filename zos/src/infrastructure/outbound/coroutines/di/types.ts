import {SymbolEnum} from '../../lib';

type CoTypes = 'QueueRequest' | 'ChanelRequest' | 'ChanRequest' | 'Queue' | 'Chanel' | 'Chan' | 'ChanSelectPool'

export const CO_TYPES: SymbolEnum<CoTypes> = {
   QueueRequest: Symbol.for('QueueRequest'),
   ChanelRequest: Symbol.for('ChanelRequest'),
   ChanRequest: Symbol.for('ChanRequest'),
   Queue: Symbol.for('Queue'),
   Chanel: Symbol.for('Chanel'),
   Chan: Symbol.for('Chan'),
   ChanSelectPool: Symbol.for('ChanSelectPool')
};