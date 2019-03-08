import {
   getReservationChannelToken, getResourceReturnChannelToken, getResourceSemaphoreToken
} from '@jchptf/semaphore';
import { APPLICATION_MODULE_ID, APPLICATION_SEMAPHORE_TAG } from './application.constants';

export const APPLICATION_CANVAS_SEMAPHORE_PROVIDER =
   getResourceSemaphoreToken(APPLICATION_MODULE_ID, APPLICATION_SEMAPHORE_TAG);

export const WORKER_RESERVATION_CHANNEL_PROVIDER =
   getReservationChannelToken(APPLICATION_MODULE_ID, APPLICATION_SEMAPHORE_TAG);

export const WORKER_RETURNS_CHANNEL_PROVIDER =
   getResourceReturnChannelToken(APPLICATION_MODULE_ID, APPLICATION_SEMAPHORE_TAG);/*
LoadResourcePoolStrategyConfig<cluster.Worker> = {
name: WORKER_SEMAPHORE_TAG, loadStrategy: LoadResourcePoolStrategy.EAGER_FIXED_CALL_FACTORY,
factory: () => {
   const worker: cluster.Worker = cluster.fork();

   if (cluster.isMaster) {
      // to receive messages from worker process
      worker.on('message', function (message) {
         console.log('Master receives:', message);
      });
      console.log('All growded up!');
   } else if (cluster.isWorker) {
      console.log('I cannot actually be here, can I!?!?!?');
   } else {
      console.log('What am I!?!?!?');
   }

   return worker;
},
poolSize: cpus().length
}*/