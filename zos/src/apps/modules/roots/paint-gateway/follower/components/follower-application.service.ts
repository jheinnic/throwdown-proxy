import { Chan, CLOSED, put, repeatTake, close } from 'medium';
import { Canvas } from 'canvas';
import { AsyncSink } from 'ix';
import { Inject } from '@nestjs/common';
import * as cluster from 'cluster';
import uuid = require('uuid');

import { CONCURRENT_WORK_FACTORY, IConcurrentWorkFactory, IChanMonitor } from '@jchptf/coroutines';
import { IAdapter } from '@jchptf/api';

import {
   CANVAS_RESERVATION_CHANNEL_PROVIDER_TOKEN, CANVAS_RECYCLING_CHANNEL_PROVIDER_TOKEN,
   TASK_REQUEST_CHANNEL_PROVIDER_TOKEN, RENDER_SERVICE_PROVIDER_TOKEN,
   STORAGE_SERVICE_PROVIDER_TOKEN, SUBMIT_PAINT_PLOTTER_SINK_PROVIDER_TOKEN,
   PLOTTER_PROGRESS_CHANNEL_PROVIDER_TOKEN, PLOTTER_COMPLETED_CHANNEL_PROVIDER_TOKEN,
   PLOTTER_COMPLETED_MONITOR_PROVIDER_TOKEN,
} from '../di/follower-app.constants';

import { UUID } from '../../../../../../infrastructure/validation';
import {
   IncrementalPlotter, IncrementalPlotProgress, ArtworkTaskDefinition, IStorageService,
   IRenderingService, IArtworkSeed
} from '../interface';

export class FollowerApplication
{
   paintDriverSubscription: any;
   // private channelOpen: boolean;

   constructor(
      @Inject(TASK_REQUEST_CHANNEL_PROVIDER_TOKEN)
      private readonly inbound: IAdapter<Chan<any, ArtworkTaskDefinition>>,
      @Inject(CANVAS_RESERVATION_CHANNEL_PROVIDER_TOKEN)
      private readonly canvasReservations: IAdapter<Chan<any, IAdapter<Canvas>>>,
      @Inject(CANVAS_RECYCLING_CHANNEL_PROVIDER_TOKEN)
      private readonly canvasReturns: IAdapter<Chan<IAdapter<Canvas>, any>>,
      @Inject(SUBMIT_PAINT_PLOTTER_SINK_PROVIDER_TOKEN)
      private readonly paintDriver: AsyncSink<IncrementalPlotter>,
      @Inject(PLOTTER_PROGRESS_CHANNEL_PROVIDER_TOKEN)
      private readonly plotProgressChannel: IAdapter<Chan<IncrementalPlotProgress>>,
      @Inject(PLOTTER_COMPLETED_CHANNEL_PROVIDER_TOKEN)
      private readonly plotCompleteChannel: IAdapter<Chan<IncrementalPlotter>>,
      @Inject(PLOTTER_COMPLETED_MONITOR_PROVIDER_TOKEN)
      private readonly paintMonitor: IChanMonitor<IncrementalPlotter>,
      @Inject(RENDER_SERVICE_PROVIDER_TOKEN)
      private readonly renderingService: IRenderingService,
      @Inject(STORAGE_SERVICE_PROVIDER_TOKEN)
      private readonly storageService: (key: UUID) => IStorageService,
      @Inject(CONCURRENT_WORK_FACTORY)
      private readonly concurrentWorkFactory: IConcurrentWorkFactory)
   {
      // this.channelOpen = true;
   }

   public async start(): Promise<void>
   {
      console.log('Running process manager thread');
      if (cluster.isMaster) {
         // throw 'Follower process should not self-identify as master';
      } else if (! cluster.isWorker) {
         // throw 'Follower process should self-identify as worker';
      } else if (!!cluster.worker) {
         if ((cluster.worker.id % 2) === 0) {
            console.log(`Cluster worker ID ${cluster.worker.id} is even.  Exiting gracefully.`);
            process.exit(0);
         } else {
            console.log(`Cluster worker ID ${cluster.worker.id} is odd.  Proceeding!`);
         }
      }

      this.paintDriverSubscription = this.concurrentWorkFactory.unwind(
         this.paintDriver, this.plotProgressChannel.unwrap(), this.plotCompleteChannel.unwrap()
      );

      const progressBeat =
         repeatTake(
            this.plotProgressChannel.unwrap(),
            async (progress: IncrementalPlotProgress) =>
            {
               if (progress.remaining === 0) {
                  console.info(progress);
               }
            }
         );
      progressBeat.then(
         () => {
            console.log('Progress report channel has closed normally.');
         }
      ).catch(
         (err) => {
            console.error('Progress report channel has closed abnormally', err);
         }
      );

      return await repeatTake(
         this.inbound.unwrap(),
         async (nextTask: ArtworkTaskDefinition | CLOSED) => {
            if (typeof nextTask === 'symbol') {
               // TODO: OnClose handling
               console.log('Shutting down on close of input channel');
               // this.channelOpen = false;
               return false;
            }

            const canvasAdapter: (IAdapter<Canvas> | CLOSED) =
               await this.canvasReservations.unwrap();
            if (typeof canvasAdapter === 'symbol') {
               // TODO: OnClose handling
               console.warn('Shutting down input due to close of reservations channel');
               close(this.inbound.unwrap());
               // this.channelOpen = false;
               return;
            }

            // TODO: This is a complete HACK to bypass the semaphore library's
            //       revocable proxy wrapper.  It was admittedly known to be a crude
            //       implementation, and it turns out to have genuine conflicts with
            //       subsequently reading the PNG stream.  Will have to either approach
            //       the membrane.js complexity or back out of proxy revocation for a
            //       true fix, but bypassing the implementation is a short-term short-cut.
            // const adapter: any = (canvasAdapter as any)[GET_LEASE_MANAGER];
            const canvas: Canvas = canvasAdapter.unwrap();

            try {
               const plotIterator =
                  this.renderingService.renderArtwork(
                     nextTask.renderPolicy, nextTask.artworkSeed, canvas, true);

               const completeSignal =
                  this.paintMonitor.request(plotIterator);

               this.paintDriver.write(plotIterator);
               await completeSignal;

               const storagePolicy =
                  this.storageService(nextTask.storagePolicy);
               await storagePolicy.saveCanvas(
                  nextTask.taskId, nextTask.artworkSeed, canvas);

               console.log('Took:', nextTask, 'on', canvas);
            } catch (err) {
               console.error(err);
               throw err;
            } finally {
               console.log('Releasing canvas to other lessees');
               // NOTE: Although we unwrapped the underlying object via a hack, make sure that
               //       we return the original wrapper to the semaphore library so it can handle
               //       recycling it properly.
               put(this.canvasReturns.unwrap(), canvasAdapter)
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


   public async submitTask(
      modelSeed: IArtworkSeed,
      // storagePath: Path,
      renderPolicy: UUID,
      storagePolicy: UUID
   ): Promise<UUID>
   {
      // const artworkSeed: IArtworkSeed = strategy.extractSeed(xBuffer, yBuffer);
      const taskId: UUID = uuid.v4() as UUID;

      const result = await put(this.inbound.unwrap(), {
            taskId,
            modelSeed,
            // storagePath,
            renderPolicy: renderPolicy,
            storagePolicy: storagePolicy,
            paintEngineVersion: '1.0.0'
         }
      );
      console.log(result);

      return taskId;
   }
}

