import { Chan, CLOSED, put, repeatTake, close } from 'medium';
import { Canvas } from 'canvas';
import { AsyncSink } from 'ix';
import { illegalState } from '@thi.ng/errors';
import { Inject } from '@nestjs/common';

import { IAdapter } from '@jchptf/api';
import { IChanMonitor } from '@jchptf/coroutines/dist/interfaces/chan-monitor.interface';

import { UUID } from '../../../../../infrastructure/validation';
import {
   APPLICATION_CANVAS_SEMAPHORE_RESERVATION_CHANNEL_PROVIDER,
   APPLICATION_CANVAS_SEMAPHORE_RETURNS_CHANNEL_PROVIDER,
   MONITOR_PAINT_PLOT_COMPLETED_PROVIDER_TOKEN,
   RECEIVE_ART_TASK_CHANNEL_PROVIDER_TOKEN, RENDER_POLICY_LOOKUP_PROVIDER_TOKEN,
   STORAGE_POLICY_LOOKUP_PROVIDER_TOKEN,
   SUBMIT_PAINT_PLOT_ITERATOR_SINK_PROVIDER_TOKEN
} from './application.constants';
import {
   IModelRenderingPolicy, IncrementalPlotter, ICanvasStoragePolicy, ArtworkTaskDefinition,
} from './interface';
import { RandomArtModel } from './components';

export class FollowerApplication
{
   // private channelOpen: boolean;

   constructor(
      @Inject(RECEIVE_ART_TASK_CHANNEL_PROVIDER_TOKEN)
      private readonly inbound: IAdapter<Chan<any, ArtworkTaskDefinition>>,
      @Inject(APPLICATION_CANVAS_SEMAPHORE_RESERVATION_CHANNEL_PROVIDER)
      private readonly canvasReservations: IAdapter<Chan<any, Canvas>>,
      @Inject(APPLICATION_CANVAS_SEMAPHORE_RETURNS_CHANNEL_PROVIDER)
      private readonly canvasReturns: IAdapter<Chan<Canvas, any>>,
      @Inject(SUBMIT_PAINT_PLOT_ITERATOR_SINK_PROVIDER_TOKEN)
      private readonly paintDriver: AsyncSink<IncrementalPlotter>,
      @Inject(MONITOR_PAINT_PLOT_COMPLETED_PROVIDER_TOKEN)
      private readonly paintMonitor: IChanMonitor<IncrementalPlotter>,
      @Inject(RENDER_POLICY_LOOKUP_PROVIDER_TOKEN)
      private readonly paintPolicyLookup: (key: UUID) => IModelRenderingPolicy,
      @Inject(STORAGE_POLICY_LOOKUP_PROVIDER_TOKEN)
      private readonly storagePolicyLookup: (key: UUID) => ICanvasStoragePolicy)
   {
      // this.channelOpen = true;
   }

   public async start(): Promise<void>
   {
      console.log('Running process manager thread');

      return repeatTake(
         this.inbound.unwrap(),
         async (nextTask: ArtworkTaskDefinition | CLOSED) => {
            if (typeof nextTask === 'symbol') {
               // TODO: OnClose handling
               console.log('Shutting down on close of input channel');
               // this.channelOpen = false;
               return false;
            }

            const canvas: (Canvas | CLOSED) =
               await this.canvasReservations.unwrap();
            if (typeof canvas === 'symbol') {
               // TODO: OnClose handling
               console.warn('Shutting down input due to close of reservations channel');
               close(this.inbound.unwrap());
               // this.channelOpen = false;
               return;
            }

            try {
               const paintPolicy = this.paintPolicyLookup(nextTask.renderPolicy);
               const artModel = new RandomArtModel(nextTask.modelSeed);
               const plotIterator = paintPolicy.create(artModel, canvas, true);
               const completeSignal = this.paintMonitor.request(plotIterator);

               this.paintDriver.write(plotIterator);
               await completeSignal;

               const storagePolicy = this.storagePolicyLookup(nextTask.storagePolicy);
               const returnUuid =
                  await storagePolicy.store(
                     nextTask.taskId, nextTask.storagePath, canvas);

               if (returnUuid !== nextTask.taskId) {
                  throw illegalState(
                     `Writer returned ${returnUuid}, but expected ${nextTask.taskId}`);
               }

               console.log('Took:', nextTask, 'on', canvas);
            } catch (err) {
               console.error(err);
               throw err;
            } finally {
               console.log('Releasing canvas to other lessees');
               put(this.canvasReturns.unwrap(), canvas)
                  .then(() => {console.debug('Returned leased canvas');})
                  .catch((err) => {
                     console.error(
                        `Failed to return leased canvas for ${nextTask.taskId}`, err
                     );
                     throw err;
                  });
            }

            return;
         }
      );
   }
}

