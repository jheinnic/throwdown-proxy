import { WORKER_SEMAPHORE_PROVIDER } from './application.constants';
import { simulateWorkload } from './simulate-workload.function';
import { Inject, Injectable } from '@nestjs/common';
import { IResourceSemaphore } from '@jchptf/semaphore';

@Injectable()
export class SimulateWorkloadApplication
{
   constructor(
      @Inject(WORKER_SEMAPHORE_PROVIDER) private readonly workerSemaphore: IResourceSemaphore<any>,
      // @Inject(WORKER_RESERVATION_CHANNEL_PROVIDER) private readonly acquireChan:
      // IAdapter<Chan<any, any>>, @Inject(WORKER_RECYCLING_CHANNEL_PROVIDER) private readonly
      // recycleChan: IAdapter<Chan<any, any>>
   )
   { }

   async run(): Promise<number>
   {
      try {
         // return await simulateWorkload(this.acquireChan, this.recycleChan);
         return await simulateWorkload(this.workerSemaphore);
      } catch (err) {
         console.error('Trapped error!', err);
      }

      return -1;
   }
}