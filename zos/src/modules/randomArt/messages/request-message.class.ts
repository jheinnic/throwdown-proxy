export type ResolveFn<T> = (value?: T | PromiseLike<T>) => void;

export type RejectFn = (reason: any) => void;

export abstract class CallableChannel<RequestType, ReplyType> {
   constructor(
      inbound: Chan<any, RequestType>
      // outbound: Chan<ReplyType, any>
      // resolveFn: ResolveFn<ReplyType>,
      // rejectFn: RejectFn
   )

   abstract handleCall(req: RequestType): ReplyType;

   sendRequest(req: RequestType): Promise<ReplyType> {
      return new Promise(
         (resolve: ResolveFn<ReplyType>, reject: RejectFn) => {
            try {
               resolve(
                  this.handleCall(req)
               );
            } catch(err) {
               reject(err);
            }
         }
      )
   }
}