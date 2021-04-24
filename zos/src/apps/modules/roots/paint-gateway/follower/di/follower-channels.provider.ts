import {
   CONCURRENT_WORK_FACTORY, CONCURRENT_WORK_FACTORY_PROVIDER_TOKEN, IConcurrentWorkFactory,
} from '@jchptf/coroutines';
import { Provider } from '@nestjs/common';
import { IFromFactoryCall } from '@jchptf/nestjs';

import { UUID } from '../../../../../../infrastructure/validation';
import {
   ArtworkTaskDefinition, ICanvasStorageStrategy, IncrementalPlotProgress, IncrementalPlotter,
} from '../interface';
import {
   CanvasCalculator, FilesystemCanvasWriter, ICanvasCalculator, WrappedChan
} from '../components';
import {
   FollowerAppModuleType, PLOTTER_COMPLETED_CHANNEL_PROVIDER_TOKEN,
   PLOTTER_COMPLETED_MONITOR_PROVIDER_TOKEN, PLOTTER_PROGRESS_CHANNEL_PROVIDER_TOKEN,
   RENDER_SERVICE_PROVIDER_TOKEN,
   STORAGE_SERVICE_PROVIDER_TOKEN, SUBMIT_PAINT_PLOTTER_SINK_PROVIDER_TOKEN,
   TASK_REQUEST_CHANNEL_PROVIDER_TOKEN
} from './follower-app.constants';
import { directoryUtils } from '../../../../../../infrastructure/lib/directory-utils.constants';

// TODO: Instead of reusing the abstractions used to bridge dependencies from the consumer
//       of a Dynamic Module to its supplier across the method call that produces it,
//       create a reduced complexity example to assist with construction of providers
//       within the context of a single module.  The Dynamic abstractions that allow the caller
//       to parametrize by creating aliases to existing supplier-side provider tokens can
//       satisfy the needs here, but the need to specify both a provide-to and an inject-from
//       Module namespace is excessive because we will only ever have the same module in both
//       slots.
export const REQUEST_CHANNEL_PROVIDER:
   IFromFactoryCall<WrappedChan<ArtworkTaskDefinition>,
      FollowerAppModuleType, string | symbol,
      (factory: IConcurrentWorkFactory) => WrappedChan<ArtworkTaskDefinition>> =
   {
      provide: TASK_REQUEST_CHANNEL_PROVIDER_TOKEN,
      useFactory: (concurrentFactory: IConcurrentWorkFactory) => {
         return concurrentFactory.createChan<ArtworkTaskDefinition>();
      },
      inject: [CONCURRENT_WORK_FACTORY_PROVIDER_TOKEN]
   };

export const SUBMIT_PAINT_PLOTTER_SINK_PROVIDER =
   // IFromFactoryCall<AsyncSink<IncrementalPlotter>,
   //    FollowerAppModuleType, string | symbol,
   //    (factory: IConcurrentWorkFactory) => AsyncSink<IncrementalPlotter>> =
   {
      provide: SUBMIT_PAINT_PLOTTER_SINK_PROVIDER_TOKEN,
      useFactory: (concurrentFactory: IConcurrentWorkFactory) => {
         return concurrentFactory.createAsyncSink<IncrementalPlotter>();
      },
      inject: [CONCURRENT_WORK_FACTORY_PROVIDER_TOKEN],
   };

export const PLOTTER_PROGRESS_CHANNEL_PROVIDER =
   // IFromFactoryCall<WrappedChan<any, IncrementalPlotProgress>,
   //    FollowerAppModuleType,
   //    (factory: IConcurrentWorkFactory) => WrappedChan<IncrementalPlotProgress>> =
   {
      provide: PLOTTER_PROGRESS_CHANNEL_PROVIDER_TOKEN,
      useFactory: (concurrentFactory: IConcurrentWorkFactory) => {
         return concurrentFactory.createChan<IncrementalPlotProgress>();
      },
      inject: [CONCURRENT_WORK_FACTORY_PROVIDER_TOKEN],
   };

export const PLOTTER_COMPLETED_CHANNEL_PROVIDER =
   {
      provide: PLOTTER_COMPLETED_CHANNEL_PROVIDER_TOKEN,
      useFactory:
         async (concurrentFactory: IConcurrentWorkFactory) => {
            return concurrentFactory.createChan<IncrementalPlotter>();
         },
      inject:
         [CONCURRENT_WORK_FACTORY_PROVIDER_TOKEN]
   };

export const PLOTTER_COMPLETED_MONITOR_PROVIDER = // : NestProvider<IChanMonitor<IncrementalPlotter>,
   // AsyncFunc<[IConcurrentWorkFactory, WrappedChan<IncrementalPlotter>],
   //    IChanMonitor<IncrementalPlotter>>> =
   {
      provide: PLOTTER_COMPLETED_MONITOR_PROVIDER_TOKEN,
      useFactory: async (
         concurrentFactory: IConcurrentWorkFactory,
         progressChan: WrappedChan<IncrementalPlotter>) => {
         return concurrentFactory.createMonitor<IncrementalPlotter>(
            progressChan.unwrap()
         );
      },
      inject:
         [CONCURRENT_WORK_FACTORY, PLOTTER_COMPLETED_CHANNEL_PROVIDER_TOKEN]
   };

export const RENDER_SERVICE_PROVIDER = //: NestProvider<(uuid: UUID) => IModelRenderingPolicy,
   // (calc: ICanvasCalculator) => (uuid: UUID) => IModelRenderingPolicy> =
   {
      provide: RENDER_SERVICE_PROVIDER_TOKEN,
      useFactory: (calc: ICanvasCalculator) => {
         const plotGridData = calc.computePoints(
            {
               pixelHeight: 400,
               pixelWidth: 400
            }, {
               pixelSize: 1,
               unitScale: 1,
               fitOrFill: 'square'
            }
         );
         return calc.compileForRuntime(plotGridData, 5000);
      },
      inject: [CanvasCalculator],
   };

// export const storagePolicyLookupProvider: NestProvider<(uuid: UUID) => ICanvasStorageStrategy,
//    SyncFunc<[IConcurrentWorkFactory], SyncFunc<[UUID], ICanvasStorageStrategy>>> =
//    {
//       provide: STORAGE_SERVICE_PROVIDER_TOKEN,
//       useFactory:
//          (concurrentFactory: IConcurrentWorkFactory) => {
//             const retVal: ICanvasStorageStrategy = new FilesystemCanvasWriter(
//                '/Users/jheinnic/Documents/randomArt3/20180313',
//                directoryUtils,
//                concurrentFactory.createLimiter(3, 10)
//             );
//
//             return (_uuid: UUID) => retVal;
//          },
//       inject: [CONCURRENT_WORK_FACTORY]
//    };

export const STORAGE_SERVICE_PROVIDER = // : NestProvider<(uuid: UUID) => ICanvasStoragePolicy,
   // SyncFunc<[IConcurrentWorkFactory], SyncFunc<[UUID], ICanvasStoragePolicy>>> =
   {
      provide: STORAGE_SERVICE_PROVIDER_TOKEN,
      useFactory:
         (concurrentFactory: IConcurrentWorkFactory) => {
            const retVal: ICanvasStorageStrategy = new FilesystemCanvasWriter(
               '/Users/jheinnic/Documents/randomArt3/20180320',
               directoryUtils,
               concurrentFactory.createLimiter(3, 10)
            );

            return (_uuid: UUID) => retVal;
         },
      inject: [CONCURRENT_WORK_FACTORY]
   };

// export const cloudinaryProvider: NestProvider = { };

export const followerChannelProviders: Provider[] = [
   REQUEST_CHANNEL_PROVIDER,
   SUBMIT_PAINT_PLOTTER_SINK_PROVIDER,
   PLOTTER_PROGRESS_CHANNEL_PROVIDER,
   PLOTTER_COMPLETED_CHANNEL_PROVIDER,
   PLOTTER_COMPLETED_MONITOR_PROVIDER,
   RENDER_SERVICE_PROVIDER,
   STORAGE_SERVICE_PROVIDER
];
