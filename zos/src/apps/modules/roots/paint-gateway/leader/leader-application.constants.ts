import { getModuleIdentifier } from '@jchptf/nestjs';
import { getResourceSemaphoreToken, } from '@jchptf/semaphore';

export const APPLICATION_MODULE_ID = getModuleIdentifier('@jchptf/zosMain');

export const WORKER_SEMAPHORE_TAG = 'WorkersDelight';

export const WORKER_SEMAPHORE_PROVIDER =
   getResourceSemaphoreToken(APPLICATION_MODULE_ID); // , WORKER_SEMAPHORE_TAG);

// export const WORKER_RESERVATION_CHANNEL_PROVIDER =
//    getReservationChannelToken(APPLICATION_MODULE_ID, WORKER_SEMAPHORE_TAG);
//
// export const WORKER_RECYCLING_CHANNEL_PROVIDER =
//    getResourceReturnChannelToken(APPLICATION_MODULE_ID, WORKER_SEMAPHORE_TAG);
//
// export const SEMAPHORE_MODULE_OPTIONS: Iterable<cluster.Worker> = new Clusterable();