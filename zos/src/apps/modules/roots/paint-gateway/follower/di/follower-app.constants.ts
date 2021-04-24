import { default as LRU } from 'lru-cache';
import { AsyncSink } from 'ix';
import { CloudinaryV2 } from 'cloudinary';
// @ts-ignore
import { Canvas } from 'canvas';

import { blessLocalProviderToken, LocalProviderToken, MODULE_ID } from '@jchptf/nestjs';
import { IResourceSemaphore } from '@jchptf/semaphore';

import { UUID } from '../../../../../../infrastructure/validation';
import {
   ArtworkTaskDefinition, ICloudinaryWriterConfig, IncrementalPlotProgress, IncrementalPlotter,
   IRenderingService, IStorageService
} from '../interface';
import { ChanMonitor } from '@jchptf/coroutines/dist/chan-monitor.class';
import { WrappedChan } from '../components/interface';
import { ResourceAdapter } from '@jchptf/semaphore/dist/resource-adapter.class';

export const FOLLOWER_APP_MODULE_ID = Symbol('@jchptf/random-art/paint-gateway/follower');
export type FOLLOWER_APP_MODULE_ID = typeof FOLLOWER_APP_MODULE_ID;

export const RENDER_POLICY_LRU_CACHE = Symbol('LRU.Cache<UUID, RenderPolicy>');
export const STORAGE_POLICY_LRU_CACHE = Symbol('LRU.Cache<UUID, UploadPolicy>');
export const CANVAS_RESOURCE_POOL = Symbol('Iterable<Canvas>');
export const CANVAS_SEMAPHORE = Symbol('IResourceSemaphore<Canvas>');
export const CANVAS_RESERVATION_CHANNEL = Symbol('WrappedChan<ResourceAdapter<Canvas>, Canvas>');
export const CANVAS_RECYCLING_CHANNEL = Symbol('WrappedChan<Canvas, ResourceAdapter<Canvas>>');;

export const CLOUDINARY_SERVER_CLIENT = Symbol('CloudinaryV2');
export const CLOUDINARY_WRITER_CONFIG = Symbol('ICloudinaryWriterConfig');

export const TASK_REQUEST_CHANNEL = Symbol('WrappedChan<ArtworkTaskChannel>');
export const SUBMIT_PAINT_PLOTTER_SINK = Symbol('AsyncSink<IncrementalPloter>');
export const PLOTTER_PROGRESS_CHANNEL = Symbol('WrappedChan<IncrementalPlotProgress>');
export const PLOTTER_COMPLETED_CHANNEL = Symbol('WrappedChan<IncrementalPlotter>');
export const PLOTTER_COMPLETED_MONITOR = Symbol('ChanMonitor<IncrementalPlotter>');

export const RENDER_SERVICE = Symbol('IRenderService');
export const STORAGE_SERVICE = Symbol('IStorageService');

export class FollowerAppModuleId
{
   public static readonly [MODULE_ID] = FOLLOWER_APP_MODULE_ID;

   [RENDER_POLICY_LRU_CACHE]: LRU.Cache<UUID, string>;
   [STORAGE_POLICY_LRU_CACHE]: LRU.Cache<UUID, string>;
   [CANVAS_RESOURCE_POOL]: Iterable<Canvas>;
   [CANVAS_SEMAPHORE]: IResourceSemaphore<Canvas>;
   [CANVAS_RESERVATION_CHANNEL]: WrappedChan<ResourceAdapter<Canvas>, Canvas>;
   [CANVAS_RECYCLING_CHANNEL]: WrappedChan<Canvas, ResourceAdapter<Canvas>>;

   [TASK_REQUEST_CHANNEL]: WrappedChan<ArtworkTaskDefinition>;
   [SUBMIT_PAINT_PLOTTER_SINK]: AsyncSink<IncrementalPlotter>;
   [PLOTTER_PROGRESS_CHANNEL]: WrappedChan<IncrementalPlotProgress>;
   [PLOTTER_COMPLETED_CHANNEL]: WrappedChan<IncrementalPlotter>;
   [PLOTTER_COMPLETED_MONITOR]: ChanMonitor<IncrementalPlotter>;

   [RENDER_SERVICE]: IRenderingService;
   [STORAGE_SERVICE]: IStorageService;

   [CLOUDINARY_SERVER_CLIENT]: CloudinaryV2;
   [CLOUDINARY_WRITER_CONFIG]: ICloudinaryWriterConfig;
}

export type FollowerAppModuleType = typeof FollowerAppModuleId;

function blessLocal<Token extends keyof FollowerAppModuleId>(
   token: Token,
): LocalProviderToken<FollowerAppModuleId[Token], FollowerAppModuleType, Token>
{
   return blessLocalProviderToken(token, FollowerAppModuleId);
}

export const RENDER_POLICY_LRU_CACHE_PROVIDER_TOKEN = blessLocal(RENDER_POLICY_LRU_CACHE);
export const STORAGE_POLICY_LRU_CACHE_PROVIDER_TOKEN = blessLocal(STORAGE_POLICY_LRU_CACHE);
export const CANVAS_RESOURCE_POOL_PROVIDER_TOKEN = blessLocal(CANVAS_RESOURCE_POOL);
export const CANVAS_SEMAPHORE_PROVIDER_TOKEN = blessLocal(CANVAS_SEMAPHORE);
export const CANVAS_RESERVATION_CHANNEL_PROVIDER_TOKEN = blessLocal(CANVAS_RESERVATION_CHANNEL);
export const CANVAS_RECYCLING_CHANNEL_PROVIDER_TOKEN = blessLocal(CANVAS_RECYCLING_CHANNEL);

export const TASK_REQUEST_CHANNEL_PROVIDER_TOKEN = blessLocal(TASK_REQUEST_CHANNEL);
export const SUBMIT_PAINT_PLOTTER_SINK_PROVIDER_TOKEN = blessLocal(SUBMIT_PAINT_PLOTTER_SINK);
export const PLOTTER_PROGRESS_CHANNEL_PROVIDER_TOKEN = blessLocal(PLOTTER_PROGRESS_CHANNEL);
export const PLOTTER_COMPLETED_CHANNEL_PROVIDER_TOKEN = blessLocal(PLOTTER_COMPLETED_CHANNEL);
export const PLOTTER_COMPLETED_MONITOR_PROVIDER_TOKEN = blessLocal(PLOTTER_COMPLETED_MONITOR);
export const RENDER_SERVICE_PROVIDER_TOKEN = blessLocal(RENDER_SERVICE);
export const STORAGE_SERVICE_PROVIDER_TOKEN = blessLocal(STORAGE_SERVICE);

export const CLOUDINARY_SERVER_CLIENT_PROVIDER_TOKEN = blessLocal(CLOUDINARY_SERVER_CLIENT);

