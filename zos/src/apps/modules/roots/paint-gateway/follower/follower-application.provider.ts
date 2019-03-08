// @ts-ignore
import { Chan, close, put, repeatTake, take, sleep, chan } from 'medium';
import { Inject, Injectable } from '@nestjs/common';
import { ArtworkTaskDefinition } from '../../../../../modules/randomArt/interface/model/artwork-task-definition.interface';
import {
   RECEIVE_ART_TASK_REQUEST_CHANNEL, RECEIVE_PAINT_REPLY_CHANNEL, RECEIVE_UPLOAD_REPLY_CHANNEL,
   SEND_ART_TASK_REPLY_CHANNEL,
   SEND_PAINT_REQUEST_CHANNEL, SEND_UPLOAD_REQUEST_CHANNEL
} from './follower-application.constants';
import { IAdapter } from '@jchptf/api';
// import {
//    RECEIVE_ART_TASK_REQUEST_CHANNEL, RECEIVE_PAINT_REPLY_CHANNEL, RECEIVE_UPLOAD_REPLY_CHANNEL,
//    SEND_ART_TASK_REPLY_CHANNEL, SEND_PAINT_REQUEST_CHANNEL, SEND_UPLOAD_REQUEST_CHANNEL
// } from './follower-application.constants';


// TODO: Find and finish the code that takes IPC messages from/to the cluster parent/child channel and
//       undo the curry rig typing that power need with the service lines feeing Hoban.


@Injectable()
export class FollowerApplication
{
   // @ignore ts-node
   // private input: Chan<any, any>;

   private readonly artTaskRequests: Chan<any, ArtworkTaskDefinition>;
   private readonly artTaskReplies: Chan<ArtworkTaskDefinition, any>;
   private readonly sendPaintRequests: Chan<any, ArtworkTaskDefinition>;
   private readonly receivePaintReplies: Chan<ArtworkTaskDefinition, any>;
   private readonly sendUploadRequests: Chan<any, ArtworkTaskDefinition>;
   private readonly receiveUploadReplies: Chan<ArtworkTaskDefinition, any>;

   constructor(
      @Inject(RECEIVE_ART_TASK_REQUEST_CHANNEL)
         artTaskRequestsAdapter: IAdapter<Chan<any, ArtworkTaskDefinition>>,
      @Inject(SEND_ART_TASK_REPLY_CHANNEL)
         artTaskRepliesAdapter: IAdapter<Chan<ArtworkTaskDefinition, any>>,
      @Inject(SEND_PAINT_REQUEST_CHANNEL)
         sendPaintRequestsAdapter: IAdapter<Chan<any, ArtworkTaskDefinition>>,
      @Inject(RECEIVE_PAINT_REPLY_CHANNEL)
         receivePaintRepliesAdapter: IAdapter<Chan<ArtworkTaskDefinition, any>>,
      @Inject(SEND_UPLOAD_REQUEST_CHANNEL)
         sendUploadRequestsAdapter: IAdapter<Chan<any, ArtworkTaskDefinition>>,
      @Inject(RECEIVE_UPLOAD_REPLY_CHANNEL)
         receiveUploadRepliesAdapter: IAdapter<Chan<ArtworkTaskDefinition, any>>
   )
   {
      console.log('Constructing a follower');
      this.artTaskRequests = artTaskRequestsAdapter.unwrap();
      this.artTaskReplies = artTaskRepliesAdapter.unwrap();
      this.sendPaintRequests = sendPaintRequestsAdapter.unwrap();
      this.receivePaintReplies = receivePaintRepliesAdapter.unwrap();
      this.sendUploadRequests = sendUploadRequestsAdapter.unwrap();
      this.receiveUploadReplies = receiveUploadRepliesAdapter.unwrap();
   }

   async run(): Promise<void>
   {
      console.log('I am a child');

      const retVal = repeatTake(this.artTaskRequests, async (artTask: ArtworkTaskDefinition, _f: true) => {
         console.log('Taking!', artTask);
         put(this.sendPaintRequests, artTask);
         await take(this.sendPaintRequests);

         await sleep(75);

         put(this.sendUploadRequests, artTask);
         await take(this.sendUploadRequests);

         await put(this.artTaskReplies, artTask);

         return true;
      }, true).then(() => {
         console.log('Async finis returned');
      }).catch(err => {
         console.error('What happened', err);
      });

      process.on('message', async (msg: string | ArtworkTaskDefinition) => {
         console.log('Child received:', msg);
         const start = Date.now();

         if ('string' === typeof msg) {
            await close(this.artTaskRequests);
         } else {
            await put(this.artTaskRequests, msg);
         }

         await take(this.artTaskReplies);
         const done = Date.now();

         process.send!(`Child finished ${msg} in ${done - start} at ${done}`);
      });

      repeatTake(
         this.receivePaintReplies,
         async (val: any) => {
            await put(this.sendUploadRequests, val);
         }
      );

      repeatTake(
         this.receiveUploadReplies,
         async (val: any) => {
            await put(this.artTaskReplies, val);
         }
      );

      await retVal;
   }
}