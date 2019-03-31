import { Chan, put, repeatTake } from 'medium';
import { IConcurrentWorkFactory } from '@jchptf/coroutines';

export type ResolveFn<T> = (value?: T | PromiseLike<T>) => void;

export type RejectFn = (reason: any) => void;

type QueuedCall<RequestType, ReplyType> = [RequestType, ResolveFn<ReplyType>, RejectFn];

/**
 * TODO: Migrate this to @jchptf/coroutine and add features to it there.
 */
export class CallableChannel<RequestType, ReplyType>
{
   private readonly inbound: Chan<QueuedCall<RequestType, ReplyType>>;

   constructor(
      workFactory: IConcurrentWorkFactory,
      private readonly callHandler: (req: RequestType) => ReplyType,
   )
   {
      this.inbound = workFactory.createChan().unwrap();
   }

   // abstract handleCall(req: RequestType): ReplyType;

   public sendRequest(req: RequestType): Promise<ReplyType>
   {
      return new Promise(
         async (resolve: ResolveFn<ReplyType>, reject: RejectFn) => {
            try {
               await put(this.inbound, [req, resolve, reject]);
            } catch (err) {
               reject(err);
            }
         }
      )
   }

   async start(): Promise<void>
   {
      await repeatTake(
         this.inbound,
         ([request, resolve, reject]: QueuedCall<RequestType, ReplyType>) => {
            try {
               resolve(
                  this.callHandler(request)
               );
            } catch (err) {
               reject(err);
            }
         }
      );
   }
}