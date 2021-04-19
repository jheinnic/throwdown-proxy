import { blessLocalProviderToken, LocalProviderToken, MODULE_ID } from '@jchptf/nestjs';
import { IResourceAdapter, IResourceSemaphore } from '@jchptf/semaphore';
import { IAdapter } from '@jchptf/api';
import { Chan } from 'medium';

export const LEADER_APPLICATION_MODULE = Symbol('@jchptf/zosMain');
export type LEADER_APPLICATION_MODULE = typeof LEADER_APPLICATION_MODULE;

export const WORKER_SEMAPHORE =
   Symbol("IResourceSemaphore<Worker>");
export const WORKER_RESERVATION_CHANNEL =
   Symbol("IAdapter<Chan<IResourceAdapter<Worker>, Worker>>");
export const WORKER_RECYCLING_CHANNEL =
   Symbol("IAdapter<Chan<Worker, IResourceAdapter<Worker>>>");

export class LeaderApplicationModuleId {
   public static readonly [MODULE_ID] = LEADER_APPLICATION_MODULE;

   [WORKER_SEMAPHORE]: IResourceSemaphore<Worker>;
   [WORKER_RESERVATION_CHANNEL]: IAdapter<Chan<IResourceAdapter<Worker>, Worker>>;
   [WORKER_RECYCLING_CHANNEL]: IAdapter<Chan<Worker, IResourceAdapter<Worker>>>;
}

export type LeaderApplicationModuleType = typeof LeaderApplicationModuleId;

function blessLocal<Token extends keyof LeaderApplicationModuleId>(token: Token):
   LocalProviderToken<LeaderApplicationModuleId[Token], LeaderApplicationModuleType, Token>
{
   return blessLocalProviderToken(token, LeaderApplicationModuleId);
}

export const WORKER_SEMAPHORE_PROVIDER_TOKEN =
   blessLocal(WORKER_SEMAPHORE);

export const WORKER_RESERVATION_CHANNEL_PROVIDER_TOKEN =
   blessLocal(WORKER_RESERVATION_CHANNEL);

export const WORKER_RECYCLING_CHANNEL_PROVIDER_TOKEN =
   blessLocal(WORKER_RECYCLING_CHANNEL);
