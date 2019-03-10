import * as LRU from 'lru-cache';

// @ts-ignore
import { Canvas } from 'canvas';

import { getLocalProviderToken, getModuleIdentifier, getNamedTypeIntent } from '@jchptf/nestjs';
import {
   getReservationChannelToken, getResourceReturnChannelToken, getResourceSemaphoreToken
} from '@jchptf/semaphore';
import { APPLICATION_MODULE_ID } from '../leader/application.constants';
import { ASYNC_SINK_TYPE, CHAN_TYPE, MONITOR_TYPE } from '@jchptf/coroutines';
import { UUID } from '../../../../../infrastructure/validation';
import { ICanvasStoragePolicy, IModelRenderingPolicy } from './interface';

export const APPLICATION_MODULE_ID = getModuleIdentifier('@jchptf/random-art/paint-gateway/follower`');

export const RENDER_LRU_CACHE_TYPE =
   getNamedTypeIntent<LRU.Cache<number, number>>('LRU.Cache<RenderPolicy>');
export const UPLOAD_LRU_CACHE_TYPE =
   getNamedTypeIntent<LRU.Cache<number, number>>('LRU.Cache<UploadPolicy>');
export const CANVAS_TYPE =
   getNamedTypeIntent<Canvas>('Canvas');

export const RENDER_POLICY_LRU_PROVIDER =
   getLocalProviderToken(APPLICATION_MODULE_ID, RENDER_LRU_CACHE_TYPE, 'LRU.Cache<RenderPolicy>');

export const UPLOAD_POLICY_LRU_PROVIDER =
   getLocalProviderToken(APPLICATION_MODULE_ID, UPLOAD_LRU_CACHE_TYPE, 'LRU.Cache<UploadPolicy>');


export const CANVAS_APP_SEMAPHORE_TAG = 'FourSquare';

export const TASK_REQUEST_CHANNEL_TAG = 'ArtworkTaskChannel';

export const SUBMIT_PAINT_PLOTTER_SINK_TAG = 'SubmitPaintPlotterSink';

export const RECEIVE_PLOTTER_PROGRESS_TAG = 'ReceivePlotterProgress';

export const RECEIVE_PLOTTER_COMPLETED_TAG = 'ReceivePlotterCompleted';

export const MONITOR_PLOT_PROGRESS_TAG = 'MonitorPlotProgress';

export const SEMAPHORE_MODULE_CANVAS_OPTIONS: Iterable<Canvas> =
   [
      new Canvas(400, 400), new Canvas(400, 400),
      new Canvas(400, 400), new Canvas(400, 400),
   ];

export const APPLICATION_CANVAS_SEMAPHORE_PROVIDER =
   getResourceSemaphoreToken(APPLICATION_MODULE_ID, CANVAS_APP_SEMAPHORE_TAG);

export const APPLICATION_CANVAS_SEMAPHORE_RESERVATION_CHANNEL_PROVIDER =
   getReservationChannelToken(APPLICATION_MODULE_ID, CANVAS_APP_SEMAPHORE_TAG);

export const APPLICATION_CANVAS_SEMAPHORE_RETURNS_CHANNEL_PROVIDER =
   getResourceReturnChannelToken(APPLICATION_MODULE_ID, CANVAS_APP_SEMAPHORE_TAG);

export const RECEIVE_ART_TASK_CHANNEL_PROVIDER_TOKEN =
   getLocalProviderToken(APPLICATION_MODULE_ID, CHAN_TYPE, TASK_REQUEST_CHANNEL_TAG);

export const SUBMIT_PAINT_PLOT_ITERATOR_SINK_PROVIDER_TOKEN =
   getLocalProviderToken(APPLICATION_MODULE_ID, ASYNC_SINK_TYPE, SUBMIT_PAINT_PLOTTER_SINK_TAG);

export const RECEIVE_PLOT_PROGRESS_PROVIDER_TOKEN =
   getLocalProviderToken(APPLICATION_MODULE_ID, CHAN_TYPE, RECEIVE_PLOTTER_PROGRESS_TAG);

export const RECEIVE_PLOT_COMPLETED_PROVIDER_TOKEN =
   getLocalProviderToken(APPLICATION_MODULE_ID, CHAN_TYPE, RECEIVE_PLOTTER_COMPLETED_TAG);

export const MONITOR_PAINT_PLOT_COMPLETED_PROVIDER_TOKEN =
   getLocalProviderToken(APPLICATION_MODULE_ID, MONITOR_TYPE, MONITOR_PLOT_PROGRESS_TAG);

export const RENDER_POLICY_LOOKUP_TYPE =
   getNamedTypeIntent<(key: UUID) => IModelRenderingPolicy>('RenderPolicyLookupFunction');

export const STORAGE_POLICY_LOOKUP_TYPE =
   getNamedTypeIntent<(key: UUID) => ICanvasStoragePolicy>('StoragePolicyLookupFunction');

export const RENDER_POLICY_LOOKUP_PROVIDER_TOKEN =
   getLocalProviderToken(APPLICATION_MODULE_ID, RENDER_POLICY_LOOKUP_TYPE);

export const STORAGE_POLICY_LOOKUP_PROVIDER_TOKEN =
   getLocalProviderToken(APPLICATION_MODULE_ID, STORAGE_POLICY_LOOKUP_TYPE);
