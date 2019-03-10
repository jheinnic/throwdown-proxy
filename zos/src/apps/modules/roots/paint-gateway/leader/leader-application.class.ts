import {Inject, Injectable} from '@nestjs/common';
import {Chan} from 'medium';

import {IAdapter} from '@jchptf/api';
import {
   WORKER_RECYCLING_CHANNEL_PROVIDER, WORKER_RESERVATION_CHANNEL_PROVIDER
} from './application.constants';


@Injectable()
export class LeaderApplication {
   constructor(
      @Inject(WORKER_RESERVATION_CHANNEL_PROVIDER) private readonly _acquireChan: IAdapter<Chan<any, any>>,
      @Inject(WORKER_RECYCLING_CHANNEL_PROVIDER) private readonly _recycleChan: IAdapter<Chan<any, any>>
   ) { }

   public async start(): Promise<number> {
      try {
         if (this._acquireChan !== undefined) {
            return 0; // await simulateWorkload(this.acquireChan, this.recycleChan);
         }
      } catch(err) {
         console.error('Trapped error!', err);
      }

      return -1;
   }
}