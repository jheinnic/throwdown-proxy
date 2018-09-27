import {SymbolEnum} from '../../../infrastructure/lib';

type LtcWorkerVariants = 'CreateTicketPool' | 'AcquireTicketPoolEntropy'

export const LTC_WORKER_VARIANTS: SymbolEnum<LtcWorkerVariants> = {
   CreateTicketPool: Symbol.for('CreateTicketPool'),
   AcquireTicketPoolEntropy: Symbol.for('AcquireTicketPoolEntropy')
};