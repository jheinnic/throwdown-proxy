import { Chan } from 'medium';

import { CONCURRENT_WORK_FACTORY, IConcurrentWorkFactory } from '@jchptf/coroutines';
import { AsyncFunc, SyncFunc } from '@jchptf/txtypes';

import { directoryUtils } from '../../../../../infrastructure/lib/directory-utils.constants';

import {
   PLOTTER_COMPLETED_CHANNEL_PROVIDER_TOKEN, PLOTTER_COMPLETED_MONITOR_PROVIDER_TOKEN,
   PLOTTER_PROGRESS_CHANNEL_PROVIDER_TOKEN, RENDER_POLICY_LOOKUP_PROVIDER_TOKEN,
   STORAGE_POLICY_LOOKUP_PROVIDER_TOKEN, SUBMIT_PAINT_PLOTTER_SINK_PROVIDER_TOKEN,
   TASK_REQUEST_CHANNEL_PROVIDER_TOKEN,
} from './follower-application.constants';
import { ArtworkTaskDefinition } from './interface/model';
import {
   ICanvasCalculator, ICanvasStoragePolicy, IModelRenderingPolicy, IncrementalPlotProgress,
   IncrementalPlotter
} from './interface';
import { UUID } from '../../../../../infrastructure/validation';
import { CanvasCalculator, CanvasWriter } from './components';
import { IAdapter } from '@jchptf/api';
import { NestProvider } from '@jchptf/nestjs';
import { AsyncSink } from 'ix';
import { IChanMonitor } from '@jchptf/coroutines/dist/interfaces/chan-monitor.interface';
import { Provider } from '@nestjs/common';

export const requestChannelProvider: NestProvider<IAdapter<Chan<ArtworkTaskDefinition>>,
   (factory: IConcurrentWorkFactory) => Promise<IAdapter<Chan<ArtworkTaskDefinition>>>> =
   {
      provide: TASK_REQUEST_CHANNEL_PROVIDER_TOKEN,
      useFactory: async (concurrentFactory: IConcurrentWorkFactory) => {
         return concurrentFactory.createChan<ArtworkTaskDefinition>();
      },
      inject: [CONCURRENT_WORK_FACTORY]
   };

export const submitPaintPlotterSinkProvider: NestProvider<AsyncSink<IncrementalPlotter>,
   AsyncFunc<[IConcurrentWorkFactory], AsyncSink<IncrementalPlotter>>> =
   {
      provide: SUBMIT_PAINT_PLOTTER_SINK_PROVIDER_TOKEN,
      useFactory: async (concurrentFactory: IConcurrentWorkFactory) => {
         return concurrentFactory.createAsyncSink<IncrementalPlotter>();
      },
      inject: [CONCURRENT_WORK_FACTORY]
   };
export const plotProgressChannelProvider: NestProvider<IAdapter<Chan<any, IncrementalPlotProgress>>,
   AsyncFunc<[IConcurrentWorkFactory], IAdapter<Chan<IncrementalPlotProgress>>>> =
   {
      provide: PLOTTER_PROGRESS_CHANNEL_PROVIDER_TOKEN,
      useFactory: async (concurrentFactory: IConcurrentWorkFactory) => {
         return concurrentFactory.createChan<IncrementalPlotProgress>();
      },
      inject: [CONCURRENT_WORK_FACTORY]
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
   requestChannelProvider,
   submitPaintPlotterSinkProvider,
   plotProgressChannelProvider,
   plotCompleteChannelProvider,
   plotCompleteMonitorProvider,
   renderPolicyLookupProvider,
   storagePolicyLookupProvider
];
