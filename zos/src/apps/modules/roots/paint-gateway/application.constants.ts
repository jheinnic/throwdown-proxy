import {Canvas} from "canvas";

import {getModuleIdentifier} from '@jchptf/nestjs';
import {
   getReservationChannelToken, getResourceReturnChannelToken, getResourceSemaphoreToken,
} from '@jchptf/semaphore';

export const APPLICATION_MODULE_ID = getModuleIdentifier('@jchptf/zosMain');

export const CANVAS_APP_SEMAPHORE_TAG = 'FourSquare';

export const SEMAPHORE_MODULE_CANVAS_OPTIONS: Iterable<Canvas> =
   [
      new Canvas(400, 400), new Canvas(400, 400), new Canvas(400, 400), new Canvas(400, 400),
      new Canvas(400, 400), new Canvas(400, 400), new Canvas(400, 400), new Canvas(400, 400),
      new Canvas(400, 400), new Canvas(400, 400), new Canvas(400, 400), new Canvas(400, 400),
      new Canvas(400, 400), new Canvas(400, 400), new Canvas(400, 400), new Canvas(400, 400),
   ];

export const APPLICATION_CANVAS_SEMAPHORE_PROVIDER =
   getResourceSemaphoreToken(APPLICATION_MODULE_ID, CANVAS_APP_SEMAPHORE_TAG);

export const APPLICATION_CANVAS_SEMAPHORE_RESERVATION_CHANNEL_PROVIDER =
   getReservationChannelToken(APPLICATION_MODULE_ID, CANVAS_APP_SEMAPHORE_TAG);

export const APPLICATION_CANVAS_SEMAPHORE_RETURNS_CHANNEL_PROVIDER =
   getResourceReturnChannelToken(APPLICATION_MODULE_ID, CANVAS_APP_SEMAPHORE_TAG);
