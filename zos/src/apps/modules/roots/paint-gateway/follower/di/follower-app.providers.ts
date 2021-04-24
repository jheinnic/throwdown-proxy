import { Canvas } from 'canvas';
//
// export const SEMAPHORE_RESOURCE_POOL_OPTIONS: IAsValue =
import { IAdapter } from '@jchptf/api';
import { DynamicProviderBindingStyle, IAsValue } from '@jchptf/nestjs';
import { SEMAPHORE_RESOURCE_POOL_PROVIDER_TOKEN } from '@jchptf/semaphore';

import { FollowerAppModuleType } from './follower-app.constants';

const CANVAS_ARRAY = new Array<IAdapter<Canvas>>(4);
export const CANVAS_SEMAPHORE_RESOURCE_POOL: Iterable<IAdapter<Canvas>> = CANVAS_ARRAY;
for (let ii = 0; ii < 4; ii += 1) {
   const tempCanvas = new Canvas(400, 400);
   tempCanvas.getContext('2d');
   CANVAS_ARRAY[ii] = {
      unwrap() { return tempCanvas; }
   }
}

export const SEMAPHORE_RESOURCE_POOL_PROVIDER:
   IAsValue<any, FollowerAppModuleType> = {
   style: DynamicProviderBindingStyle.VALUE,
   provide: SEMAPHORE_RESOURCE_POOL_PROVIDER_TOKEN,
   useValue: CANVAS_SEMAPHORE_RESOURCE_POOL,
};
