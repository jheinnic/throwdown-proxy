import {
   WORKER_RECYCLING_CHANNEL_PROVIDER, WORKER_RESERVATION_CHANNEL_PROVIDER
} from './application.constants';
import {simulateWorkload} from './simulate-workload.function';
import {Chan} from 'medium';
import {IAdapter} from '@jchptf/api';
import {Inject, Injectable} from '@nestjs/common';


@Injectable()
export class LeaderApplication {
   constructor(
      @Inject(WORKER_RESERVATION_CHANNEL_PROVIDER) private readonly acquireChan: IAdapter<Chan<any, any>>,
      @Inject(WORKER_RECYCLING_CHANNEL_PROVIDER) private readonly recycleChan: IAdapter<Chan<any, any>>
   ) { }

   async run(): Promise<number> {
      try {
         return await simulateWorkload(this.acquireChan, this.recycleChan);
      } catch(err) {
         console.error('Trapped error!', err);
      }

      return -1;
   }
}