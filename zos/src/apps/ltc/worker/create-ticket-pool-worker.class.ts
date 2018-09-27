import {inject, injectable} from 'inversify';
import {LTC_WORKER_TYPES} from '../di/types';
import {CreateTicketPoolTask} from './create-ticket-pool-task.value';

@injectable()
export class CreateTicketPoolWorker {
   constructor(
      @inject(LTC_WORKER_TYPES.CreateTicketPoolTaskDef) private readonly taskDef: CreateTicketPoolTask,
      @inject(LTC_WORKER_TYPES.CreateTicketPoolWorker) private readonly taskWorker: CreateTicketPoolWorker
   ) { }
}
