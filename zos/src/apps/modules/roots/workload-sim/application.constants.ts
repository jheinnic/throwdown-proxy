import {getModuleIdentifier} from '@jchptf/nestjs';
import {
   getReservationChannelToken, getResourceReturnChannelToken, getResourceSemaphoreToken
} from '@jchptf/semaphore';
import { Canvas } from "canvas";

export const APPLICATION_MODULE_ID = getModuleIdentifier('@jchptf/workload-sim');

export const CANVAS_SEMAPHORE_TAG = 'FourSquare';
export const CANVAS_SEMAPHORE_PROVIDER_TOKEN =
   getResourceSemaphoreToken(APPLICATION_MODULE_ID, CANVAS_SEMAPHORE_TAG);
export const CANVAS_SEMAPHORE_RESERVATION_CHANNEL_PROVIDER_TOKEN =
   getReservationChannelToken(APPLICATION_MODULE_ID, CANVAS_SEMAPHORE_TAG);
export const CANVAS_SEMAPHORE_RETURN_CHANNEL_PROVIDER_TOKEN =
   getResourceReturnChannelToken(APPLICATION_MODULE_ID, CANVAS_SEMAPHORE_TAG);
export const CANVAS_SEMAPHORE_RESOURCE_POOL: Iterable<Canvas> =
   [
      new Canvas(400, 400), new Canvas(400, 400), new Canvas(400, 400), new Canvas(400, 400),
      new Canvas(400, 400), new Canvas(400, 400), new Canvas(400, 400), new Canvas(400, 400),
      new Canvas(400, 400), new Canvas(400, 400), new Canvas(400, 400), new Canvas(400, 400),
      new Canvas(400, 400), new Canvas(400, 400), new Canvas(400, 400), new Canvas(400, 400),
   ];

