import * as LRU from 'lru-cache';

// @ts-ignore
import { Canvas } from 'canvas';

import { getLocalProviderToken, getModuleIdentifier, getNamedTypeIntent } from '@jchptf/nestjs';
import {
   getReservationChannelToken, getResourceReturnChannelToken, getResourceSemaphoreToken
} from '@jchptf/semaphore';
import { ASYNC_SINK_TYPE, CHAN_TYPE, MONITOR_TYPE } from '@jchptf/coroutines';

import { UUID } from '../../../../../infrastructure/validation';
import { ICanvasStoragePolicy, IModelRenderingPolicy } from './interface';

export const APPLICATION_MODULE_ID =
   getModuleIdentifier('@jchptf/random-art/paint-gateway/follower');

export const RENDER_LRU_CACHE_TYPE =
   getNamedTypeIntent<LRU.Cache<number, number>>('LRU.Cache<RenderPolicy>');
export const UPLOAD_LRU_CACHE_TYPE =
   getNamedTypeIntent<LRU.Cache<number, number>>('LRU.Cache<UploadPolicy>');
export const RENDER_POLICY_LRU_PROVIDER =
   getLocalProviderToken(APPLICATION_MODULE_ID, RENDER_LRU_CACHE_TYPE, 'LRU.Cache<RenderPolicy>');
export const UPLOAD_POLICY_LRU_PROVIDER =
   getLocalProviderToken(APPLICATION_MODULE_ID, UPLOAD_LRU_CACHE_TYPE, 'LRU.Cache<UploadPolicy>');

export const CANVAS_TYPE = getNamedTypeIntent<Canvas>('Canvas');

// export const CANVAS_SEMAPHORE_TAG = 'FourSquare';
export const CANVAS_SEMAPHORE_PROVIDER_TOKEN =
   getResourceSemaphoreToken(APPLICATION_MODULE_ID);
export const CANVAS_SEMAPHORE_RESERVATION_CHANNEL_PROVIDER_TOKEN =
   getReservationChannelToken(APPLICATION_MODULE_ID);
export const CANVAS_SEMAPHORE_RETURN_CHANNEL_PROVIDER_TOKEN =
   getResourceReturnChannelToken(APPLICATION_MODULE_ID);

export const TASK_REQUEST_CHANNEL_TAG = 'ArtworkTaskChannel';
export const SUBMIT_PAINT_PLOTTER_SINK_TAG = 'SubmitPaintPlotterSink';
export const PLOTTER_PROGRESS_CHANNEL_TAG = 'PlotterProgressChannel';
export const PLOTTER_COMPLETED_CHANNEL_TAG = 'PlotterCompletedChannel';
export const PLOTTER_COMPLETED_MONITOR_TAG = 'PlotterCompletedMonitor';
export const TASK_REQUEST_CHANNEL_PROVIDER_TOKEN =
   getLocalProviderToken(APPLICATION_MODULE_ID, CHAN_TYPE, TASK_REQUEST_CHANNEL_TAG);
export const SUBMIT_PAINT_PLOTTER_SINK_PROVIDER_TOKEN =
   getLocalProviderToken(APPLICATION_MODULE_ID, ASYNC_SINK_TYPE, SUBMIT_PAINT_PLOTTER_SINK_TAG);
export const PLOTTER_PROGRESS_CHANNEL_PROVIDER_TOKEN =
   getLocalProviderToken(APPLICATION_MODULE_ID, CHAN_TYPE, PLOTTER_PROGRESS_CHANNEL_TAG);
export const PLOTTER_COMPLETED_CHANNEL_PROVIDER_TOKEN =
   getLocalProviderToken(APPLICATION_MODULE_ID, CHAN_TYPE, PLOTTER_COMPLETED_CHANNEL_TAG);
export const PLOTTER_COMPLETED_MONITOR_PROVIDER_TOKEN =
   getLocalProviderToken(APPLICATION_MODULE_ID, MONITOR_TYPE, PLOTTER_COMPLETED_MONITOR_TAG);

export const RENDER_POLICY_LOOKUP_TYPE =
   getNamedTypeIntent<(key: UUID) => IModelRenderingPolicy>('RenderPolicyLookupFunction');
export const STORAGE_POLICY_LOOKUP_TYPE =
   getNamedTypeIntent<(key: UUID) => ICanvasStoragePolicy>('StoragePolicyLookupFunction');
export const RENDER_POLICY_LOOKUP_PROVIDER_TOKEN =
   getLocalProviderToken(APPLICATION_MODULE_ID, RENDER_POLICY_LOOKUP_TYPE);
export const STORAGE_POLICY_LOOKUP_PROVIDER_TOKEN =
   getLocalProviderToken(APPLICATION_MODULE_ID, STORAGE_POLICY_LOOKUP_TYPE);
