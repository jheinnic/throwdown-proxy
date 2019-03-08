import {getModuleIdentifier} from '@jchptf/nestjs';
import {
   getReservationChannelToken, getResourceReturnChannelToken, getResourceSemaphoreToken
} from '@jchptf/semaphore';
import * as cluster from 'cluster';
import { cpus } from 'os';

export const APPLICATION_SEMAPHORE_TAG = 'WorkersDelight';

export const APPLICATION_MODULE_ID = getModuleIdentifier('@jchptf/workload-sim');

// export const WORKER_SEMAPHORE_TAG = 'WorkerPool';

export const WORKER_SEMAPHORE_PROVIDER =
   getResourceSemaphoreToken(APPLICATION_MODULE_ID, APPLICATION_SEMAPHORE_TAG);

export const WORKER_RESERVATION_CHANNEL_PROVIDER =
   getReservationChannelToken(APPLICATION_MODULE_ID, APPLICATION_SEMAPHORE_TAG);

export const WORKER_RECYCLING_CHANNEL_PROVIDER =
   getResourceReturnChannelToken(APPLICATION_MODULE_ID, APPLICATION_SEMAPHORE_TAG);

/**
 * TODO: This really is just a custom provider with slightly twisted, semantics, albeit
 *       totally possible to realign those twists to be a Nest-compliant Provider.  Let's
 *       avoid reinventing a different kind of wheel and refactor this to work as a vanilla
 *       Provider!
 */
export class Clusterable implements Iterable<cluster.Worker>
{
   public* [Symbol.iterator](): Iterator<cluster.Worker>
   {
      const poolSize = cpus().length;
      let ii = 0;
      for (ii = 0; ii < poolSize; ii++) {
         const worker: cluster.Worker = cluster.fork();

         if (cluster.isMaster) {
            // to receive messages from worker process
            worker.on('message', function (message) {
               console.log('Master receives:', message);
            });
            console.log('All growded up!');

            yield worker;
         } else if (cluster.isWorker) {
            console.log('I cannot actually be here, can I!?!?!?');
            return;
         } else {
            console.log('What am I!?!?!?');
            return;
         }
      }
   }
}

export const SEMAPHORE_MODULE_OPTIONS: Iterable<cluster.Worker> = new Clusterable();