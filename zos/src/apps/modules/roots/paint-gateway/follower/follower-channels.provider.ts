import { Chan } from 'medium';

import { CONCURRENT_WORK_FACTORY, IConcurrentWorkFactory } from '@jchptf/coroutines';

import { directoryUtils } from '../../../../../infrastructure/lib/directory-utils.constants';

import {
   RECEIVE_ART_TASK_CHANNEL_PROVIDER_TOKEN, MONITOR_PAINT_PLOT_COMPLETED_PROVIDER_TOKEN,
   SUBMIT_PAINT_PLOT_ITERATOR_SINK_PROVIDER_TOKEN, RECEIVE_PLOT_PROGRESS_PROVIDER_TOKEN,
   RECEIVE_PLOT_COMPLETED_PROVIDER_TOKEN, RENDER_POLICY_LOOKUP_PROVIDER_TOKEN,
   STORAGE_POLICY_LOOKUP_PROVIDER_TOKEN,
} from './application.constants';
import { ArtworkTaskDefinition } from './interface/model';
import {
   ICanvasCalculator, IModelRenderingPolicy, IncrementalPlotProgress, IncrementalPlotter
} from './interface';
import { UUID } from '../../../../../infrastructure/validation';
import { CanvasCalculator, CanvasWriter } from './components';


export const followerChannelProviders = [
   {
      provide: RECEIVE_ART_TASK_CHANNEL_PROVIDER_TOKEN,
      useFactory: (concurrentFactory: IConcurrentWorkFactory) => {
         return concurrentFactory.createChan<ArtworkTaskDefinition>();
      },
      inject: [CONCURRENT_WORK_FACTORY]
   }, {
      provide: SUBMIT_PAINT_PLOT_ITERATOR_SINK_PROVIDER_TOKEN,
      useFactory: async (concurrentFactory: IConcurrentWorkFactory) => {
         return concurrentFactory.createAsyncSink<IncrementalPlotter>();
      },
      inject: [CONCURRENT_WORK_FACTORY]
   }, {
      provide: RECEIVE_PLOT_PROGRESS_PROVIDER_TOKEN,
      useFactory: (concurrentFactory: IConcurrentWorkFactory) => {
         return concurrentFactory.createChan<IncrementalPlotProgress>();
      },
      inject: [CONCURRENT_WORK_FACTORY]
   }, {
      provide: RECEIVE_PLOT_COMPLETED_PROVIDER_TOKEN,
      useFactory: (concurrentFactory: IConcurrentWorkFactory) => {
         return concurrentFactory.createChan<IncrementalPlotter>();
      },
      inject: [CONCURRENT_WORK_FACTORY]
   }, {
      provide: MONITOR_PAINT_PLOT_COMPLETED_PROVIDER_TOKEN,
      useFactory: async (
         concurrentFactory: IConcurrentWorkFactory,
         progressChan: Chan<any, IncrementalPlotter>
         ) => {
         return concurrentFactory.createMonitor<IncrementalPlotter>(progressChan);
      },
      inject: [CONCURRENT_WORK_FACTORY, RECEIVE_PLOT_COMPLETED_PROVIDER_TOKEN]
   }, {
      provide: RENDER_POLICY_LOOKUP_PROVIDER_TOKEN,
      useFactory: (calc: ICanvasCalculator) => {
         const genModel = calc.create(
            5000, {
               pixelHeight: 400,
               pixelWidth: 400
            }, {
               pixelSize: 1,
               unitScale: 1,
               fitOrFill: 'square'
            }
         );

         return (_uuid: UUID): IModelRenderingPolicy => genModel
      },
      inject: [CanvasCalculator],
   }, {
      provide: STORAGE_POLICY_LOOKUP_PROVIDER_TOKEN,
      useFactory: async (concurrentFactory: IConcurrentWorkFactory) =>
      {
         const limiter = concurrentFactory.createLimiter(3, 10);
         return new CanvasWriter(
            '/Users/jheinnic/Documents/randomArt3/20180308', directoryUtils, limiter);
      },
      inject: [CONCURRENT_WORK_FACTORY]
   }

];
