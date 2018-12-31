import {getModuleIdentifier} from '@jchptf/api';
import {Canvas} from "canvas";
import {
   getReservationChannelToken, getResourceReturnChannelToken,
   getResourceSemaphoreToken, LoadResourcePoolStrategy, LoadResourcePoolStrategyConfig
} from '@jchptf/semaphore';

export const APPLICATION_MODULE_ID = getModuleIdentifier('@jchptf/zosMain');

export const APPLICATION_SEMAPHORE_TAG = 'FourSquare';

export const SEMAPHORE_MODULE_OPTIONS: LoadResourcePoolStrategyConfig<Canvas> = {
   name: APPLICATION_SEMAPHORE_TAG,
   loadStrategy: LoadResourcePoolStrategy.EAGER_FIXED_ITERABLE,
   resources: [
      new Canvas(400, 400), new Canvas(400, 400), new Canvas(400, 400), new Canvas(400, 400),
      new Canvas(400, 400), new Canvas(400, 400), new Canvas(400, 400), new Canvas(400, 400),
      new Canvas(400, 400), new Canvas(400, 400), new Canvas(400, 400), new Canvas(400, 400),
      new Canvas(400, 400), new Canvas(400, 400), new Canvas(400, 400), new Canvas(400, 400),
   ]
};

export const APPLICATION_CANVAS_SEMAPHORE_PROVIDER =
   getResourceSemaphoreToken(APPLICATION_MODULE_ID, SEMAPHORE_MODULE_OPTIONS);

export const APPLICATION_CANVAS_SEMAPHORE_RESERVATION_CHANNEL_PROVIDER =
   getReservationChannelToken(APPLICATION_MODULE_ID, SEMAPHORE_MODULE_OPTIONS);

export const APPLICATION_CANVAS_SEMAPHORE_RETURNS_CHANNEL_PROVIDER =
   getResourceReturnChannelToken(APPLICATION_MODULE_ID, SEMAPHORE_MODULE_OPTIONS);
