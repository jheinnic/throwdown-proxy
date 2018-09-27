import {SymbolEnum} from '../../../infrastructure/lib';

type LtcWorkerTypes = 'CreateTicketPoolTaskDef' | 'CreateTicketPoolWorker'
export const LTC_WORKER_TYPES: SymbolEnum<LtcWorkerTypes> = {
   CreateTicketPoolTaskDef: Symbol.for('CreateTicketPoolTaskDef'),
   CreateTicketPoolWorker: Symbol.for('CreateTicketPoolWorker')
}
