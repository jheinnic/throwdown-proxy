import {
   RECEIVE_ART_TASK_REQUEST_CHANNEL, RECEIVE_PAINT_REPLY_CHANNEL, RECEIVE_UPLOAD_REPLY_CHANNEL,
   SEND_ART_TASK_REPLY_CHANNEL, SEND_PAINT_REQUEST_CHANNEL, SEND_UPLOAD_REQUEST_CHANNEL
} from './follower-application.constants';
import { CONCURRENT_WORK_FACTORY, IConcurrentWorkFactory } from '@jchptf/coroutines';

export const followerChannelProviders = [
   {
      provide: RECEIVE_ART_TASK_REQUEST_CHANNEL,
      useFactory: (concurrentFactory: IConcurrentWorkFactory) => {
         return concurrentFactory.createChan();
      },
      inject: [CONCURRENT_WORK_FACTORY]
   }, {
      provide: SEND_ART_TASK_REPLY_CHANNEL,
      useFactory: async (concurrentFactory: IConcurrentWorkFactory) => {
         return concurrentFactory.createChan();
      },
      inject: [CONCURRENT_WORK_FACTORY]
   }, {
      provide: SEND_PAINT_REQUEST_CHANNEL,
      useFactory: async (concurrentFactory: IConcurrentWorkFactory) => {
         return concurrentFactory.createChan();
      },
      inject: [CONCURRENT_WORK_FACTORY]
   }, {
      provide: RECEIVE_PAINT_REPLY_CHANNEL,
      useFactory: async (concurrentFactory: IConcurrentWorkFactory) => {
         return concurrentFactory.createChan();
      },
      inject: [CONCURRENT_WORK_FACTORY]
   }, {
      provide: SEND_UPLOAD_REQUEST_CHANNEL,
      useFactory: async (concurrentFactory: IConcurrentWorkFactory) => {
         return concurrentFactory.createChan();
      },
      inject: [CONCURRENT_WORK_FACTORY]
   }, {
      provide: RECEIVE_UPLOAD_REPLY_CHANNEL,
      useFactory: async (concurrentFactory: IConcurrentWorkFactory) => {
         return concurrentFactory.createChan();
      },
      inject: [CONCURRENT_WORK_FACTORY]
   }
];
