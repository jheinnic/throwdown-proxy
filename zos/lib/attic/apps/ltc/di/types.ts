import {SymbolEnum} from '@jchptf/api';

type LtcWorkerTypes = 'CreateTicketPoolTaskDef' | 'CreateTicketPoolWorker'
export const LTC_WORKER_TYPES: SymbolEnum<LtcWorkerTypes> = {
   CreateTicketPoolTaskDef: Symbol.for('CreateTicketPoolTaskDef'),
   CreateTicketPoolWorker: Symbol.for('CreateTicketPoolWorker')
}
