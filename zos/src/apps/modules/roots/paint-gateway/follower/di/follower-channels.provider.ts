import { Chan } from 'medium';

import {
   CONCURRENT_WORK_FACTORY, CONCURRENT_WORK_FACTORY_PROVIDER_TOKEN, IConcurrentWorkFactory
} from '@jchptf/coroutines';
import { AsyncFunc, SyncFunc } from '@jchptf/txtypes';
import { IAdapter } from '@jchptf/api';
import { IFromFactoryCall } from '@jchptf/nestjs';
import { IChanMonitor } from '@jchptf/coroutines/dist/interfaces/chan-monitor.interface';

import { ArtworkTaskDefinition } from './interface/model';
import {
   ICanvasCalculator, ICanvasStoragePolicy, IModelRenderingPolicy, IncrementalPlotProgress,
   IncrementalPlotter
} from './interface';
import { UUID } from '../../../../../infrastructure/validation';
import { CanvasCalculator, CanvasWriter } from './components';
import { Provider } from '@nestjs/common';
import { WrappedChan } from './interface/wrapped-chan.interface';
import { FollowerAppModuleId } from './di/follower-app.constants';

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
      typeof FollowerAppModuleId,
      (factory: IConcurrentWorkFactory) => WrappedChan<ArtworkTaskDefinition>> =
   {
      provide: TASK_REQUEST_CHANNEL_PROVIDER_TOKEN,
      useFactory: (concurrentFactory: IConcurrentWorkFactory) => {
         return concurrentFactory.createChan<ArtworkTaskDefinition>();
      },
      inject: [CONCURRENT_WORK_FACTORY_PROVIDER_TOKEN]
   };

export const SUBMIT_PAINT_PLOTTER_SINK_PROVIDER:
   IFromFactoryCall<WrappedChan<IncrementalPlotter>,
      typeof FollowerAppModuleId,
      (factory: IConcurrentWorkFactory) => WrappedChan<IncrementalPlotter>> =
   {
      provide: SUBMIT_PAINT_PLOTTER_SINK_PROVIDER_TOKEN,
      useFactory: (concurrentFactory: IConcurrentWorkFactory) => {
         return concurrentFactory.createAsyncSink<IncrementalPlotter>();
      },
      inject: [CONCURRENT_WORK_FACTORY_PROVIDER_TOKEN],
   };

export const PLOT_PROGRESS_CHANNEL_PROVIDER:
   IFromFactoryCall<WrappedChan<any, IncrementalPlotProgress>,
      typeof FollowerAppModuleId,
      (factory: IConcurrentWorkFactory) => WrappedChan<IncrementalPlotProgress>> =
   {
      provide: PLOT_PROGRESS_CHANNEL_PROVIDER_TOKEN,
      useFactory: (concurrentFactory: IConcurrentWorkFactory) => {
         return concurrentFactory.createChan<IncrementalPlotProgress>();
      },
      inject: [CONCURRENT_WORK_FACTORY_PROVIDER_TOKEN],
   };

export const PLOT_COMPLETE_CHANNEL_PROVIDER:
   IFromFactoryCall<WrappedChan<any, IncrementalPlotProgress>,
      typeof FollowerAppModuleId,
      (factory: IConcurrentWorkFactory) => WrappedChan<IncrementalPlotProgress>> =
   {
      provide: PLOT_COMPLETE_CHANNEL_PROVIDER_TOKEN,
      useFactory: (concurrentFactory: IConcurrentWorkFactory) => {
         return concurrentFactory.createChan<IncrementalPlotProgress>();
      },
      inject: [CONCURRENT_WORK_FACTORY_PROVIDER_TOKEN],
   };

export const plotCompleteChannelProvider: NestProvider<IAdapter<Chan<any, IncrementalPlotter>>,
   AsyncFunc<[IConcurrentWorkFactory], IAdapter<Chan<IncrementalPlotter>>>> =
   {
      provide: PLOTTER_COMPLETED_CHANNEL_PROVIDER_TOKEN,
      useFactory:
         async (concurrentFactory: IConcurrentWorkFactory) => {
            return concurrentFactory.createChan<IncrementalPlotter>();
         },
      inject:
         [CONCURRENT_WORK_FACTORY]
   };

export const plotCompleteMonitorProvider: NestProvider<IChanMonitor<IncrementalPlotter>,
   AsyncFunc<[IConcurrentWorkFactory, IAdapter<Chan<IncrementalPlotter>>],
      IChanMonitor<IncrementalPlotter>>> =
   {
      provide: PLOTTER_COMPLETED_MONITOR_PROVIDER_TOKEN,
      useFactory: async (
         concurrentFactory: IConcurrentWorkFactory,
         progressChan: IAdapter<Chan<any, IncrementalPlotter>>) => {
         return concurrentFactory.createMonitor<IncrementalPlotter>(
            progressChan.unwrap()
         );
      },
      inject:
         [CONCURRENT_WORK_FACTORY, PLOTTER_COMPLETED_CHANNEL_PROVIDER_TOKEN]
   };

export const renderPolicyLookupProvider: NestProvider<(uuid: UUID) => IModelRenderingPolicy,
   (calc: ICanvasCalculator) => (uuid: UUID) => IModelRenderingPolicy> =
   {
      provide: RENDER_POLICY_LOOKUP_PROVIDER_TOKEN,
      useFactory: (calc: ICanvasCalculator) => {
         const retVal = calc.create(
            5000, {
               pixelHeight: 400,
               pixelWidth: 400
            }, {
               pixelSize: 1,
               unitScale: 1,
               fitOrFill: 'square'
            }
         );
         return (_uuid: UUID) => retVal;
      },
      inject: [CanvasCalculator],
   };

// export const storagePolicyLookupProvider: NestProvider<(uuid: UUID) => ICanvasStoragePolicy,
//    SyncFunc<[IConcurrentWorkFactory], SyncFunc<[UUID], ICanvasStoragePolicy>>> =
//    {
//       provide: STORAGE_POLICY_LOOKUP_PROVIDER_TOKEN,
//       useFactory:
//          (concurrentFactory: IConcurrentWorkFactory) => {
//             const retVal: ICanvasStoragePolicy = new CanvasWriter(
//                '/Users/jheinnic/Documents/randomArt3/20180313',
//                directoryUtils,
//                concurrentFactory.createLimiter(3, 10)
//             );
//
//             return (_uuid: UUID) => retVal;
//          },
//       inject: [CONCURRENT_WORK_FACTORY]
//    };

export const storagePolicyLookupProvider: NestProvider<(uuid: UUID) => ICanvasStoragePolicy,
   SyncFunc<[IConcurrentWorkFactory], SyncFunc<[UUID], ICanvasStoragePolicy>>> =
   {
      provide: STORAGE_POLICY_LOOKUP_PROVIDER_TOKEN,
      useFactory:
         (concurrentFactory: IConcurrentWorkFactory) => {
            const retVal: ICanvasStoragePolicy = new CanvasWriter(
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
   submitPaintPlotterSinkProvider,
   plotProgressChannelProvider,
   plotCompleteChannelProvider,
   plotCompleteMonitorProvider,
   renderPolicyLookupProvider,
   storagePolicyLookupProvider
];
