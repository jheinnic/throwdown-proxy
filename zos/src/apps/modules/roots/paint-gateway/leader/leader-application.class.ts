import { Worker } from 'cluster';
import { cpus } from "os";
import { Inject, Injectable } from '@nestjs/common';

import { IResourceSemaphore } from '@jchptf/semaphore';
import { WORKER_SEMAPHORE_PROVIDER_TOKEN } from './leader-application.constants';


@Injectable()
export class LeaderApplication {
   constructor(
      @Inject(WORKER_SEMAPHORE_PROVIDER_TOKEN) private readonly workerSemaphore: IResourceSemaphore<Worker>
   )
   { }

   public async start(): Promise<number> {
      try {
         if (this.workerSemaphore !== undefined) {
            // await simulateWorkload(this.workerSemaphore);
            for( let ii = 0; ii < cpus.length; ii += 1.) {
               this.workerSemaphore.borrowResource(
                  (worker: Worker) => {
                     console.log( `Leader found worker #${worker.id + 1} at process ${worker.process.pid}`);
                  }
               );
            }
         }

         console.log("Leader believes his or her work is done!  Exiting gracefully.");
      } catch(err) {
         console.error('Trapped error!', err);
         return -1;
      }

      return 0;
   }
}