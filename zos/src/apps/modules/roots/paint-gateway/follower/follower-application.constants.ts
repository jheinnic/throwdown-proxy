import * as LRU from 'lru-cache';

// @ts-ignore
import { Canvas } from 'canvas';

import { getLocalProviderToken, getModuleIdentifier, getNamedTypeIntent } from '@jchptf/nestjs';
import { getReservationChannelToken, getResourceReturnChannelToken } from '@jchptf/semaphore';

export const APP_MODULE_ID = getModuleIdentifier('@jchptf/random-art/paint-gateway/follower`');

export const RENDER_LRU_CACHE_TYPE =
   getNamedTypeIntent<LRU.Cache<number, number>>('LRU.Cache<RenderPolicy>');
export const UPLOAD_LRU_CACHE_TYPE =
   getNamedTypeIntent<LRU.Cache<number, number>>('LRU.Cache<UploadPolicy>');
export const CANVAS_TYPE =
   getNamedTypeIntent<Canvas>('Canvas');

export const RENDER_POLICY_LRU_PROVIDER =
   getLocalProviderToken(APP_MODULE_ID, RENDER_LRU_CACHE_TYPE, 'LRU.Cache<RenderPolicy>');

export const UPLOAD_POLICY_LRU_PROVIDER =
   getLocalProviderToken(APP_MODULE_ID, UPLOAD_LRU_CACHE_TYPE, 'LRU.Cache<UploadPolicy>');

export const CANVAS_PROVIDER =
   getLocalProviderToken(APP_MODULE_ID, CANVAS_TYPE, 'Canvas');

export const RECEIVE_ART_TASK_REQUEST_CHANNEL =
   getReservationChannelToken(APP_MODULE_ID, 'Chan<any, ArtworkTaskDefinition>');

export const SEND_ART_TASK_REPLY_CHANNEL =
   getResourceReturnChannelToken(APP_MODULE_ID, 'Chan<ArtworkTaskDefinition, any>');

export const SEND_PAINT_REQUEST_CHANNEL =
   getReservationChannelToken(APP_MODULE_ID, 'Chan<TwoArtworkTaskDefinition, any>');

export const RECEIVE_PAINT_REPLY_CHANNEL =
   getResourceReturnChannelToken(APP_MODULE_ID, 'Chan<any, TwoArtworkTaskDefinition>');

export const SEND_UPLOAD_REQUEST_CHANNEL =
   getReservationChannelToken(APP_MODULE_ID, 'Chan<ThreeArtworkTaskDefinition, any>');

export const RECEIVE_UPLOAD_REPLY_CHANNEL =
   getResourceReturnChannelToken(APP_MODULE_ID, 'Chan<any, ThreeArtworkTaskDefinition>');
