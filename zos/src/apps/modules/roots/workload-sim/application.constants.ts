import { blessLocalProviderToken, LocalProviderToken, MODULE_ID } from '@jchptf/nestjs';
import { IResourceAdapter, IResourceSemaphore } from '@jchptf/semaphore';
import { IAdapter } from '@jchptf/api';
import { Canvas } from 'canvas';
import { Chan } from 'medium';

export const LEADER_APP_MODULE_ID = Symbol('@jchptf/workload-sim');
export type LEADER_APP_MODULE_ID = typeof LEADER_APP_MODULE_ID;

export const CANVAS_SEMAPHORE =
   Symbol("IResourceSemaphore<Canvas>");
export const CANVAS_RESERVATION_CHANNEL =
   Symbol("WrappedChan<IResourceAdapter<Canvas>, Canvas>");
export const CANVAS_RECYCLING_CHANNEL =
   Symbol("WrappedChan<Canvas, IResourceAdapter<Canvas>>");

export class ApplicationModuleId {
   public static readonly [MODULE_ID] = LEADER_APP_MODULE_ID;

   [CANVAS_SEMAPHORE]: IResourceSemaphore<Canvas>;
   [CANVAS_RESERVATION_CHANNEL]: IAdapter<Chan<IResourceAdapter<Canvas>, Canvas>>;
   [CANVAS_RECYCLING_CHANNEL]: IAdapter<Chan<Canvas, IResourceAdapter<Canvas>>>;
}

export type ApplicationModuleType = typeof ApplicationModuleId;

function blessLocal<Token extends keyof ApplicationModuleId>(token: Token):
   LocalProviderToken<ApplicationModuleId[Token], ApplicationModuleType, Token>
{
   return blessLocalProviderToken(token, ApplicationModuleId);
}

export const CANVAS_SEMAPHORE_PROVIDER_TOKEN =
   blessLocal(CANVAS_SEMAPHORE);
export const CANVAS_SEMAPHORE_RESERVATION_CHANNEL_PROVIDER_TOKEN =
   blessLocal(CANVAS_RESERVATION_CHANNEL);
export const CANVAS_SEMAPHORE_RECYCLING_CHANNEL_PROVIDER_TOKEN =
   blessLocal(CANVAS_RECYCLING_CHANNEL);

export const CANVAS_SEMAPHORE_RESOURCE_POOL: Iterable<Canvas> =
   [
      new Canvas(400, 400), new Canvas(400, 400), new Canvas(400, 400), new Canvas(400, 400),
      new Canvas(400, 400), new Canvas(400, 400), new Canvas(400, 400), new Canvas(400, 400),
      new Canvas(400, 400), new Canvas(400, 400), new Canvas(400, 400), new Canvas(400, 400),
      new Canvas(400, 400), new Canvas(400, 400), new Canvas(400, 400), new Canvas(400, 400),
   ];

