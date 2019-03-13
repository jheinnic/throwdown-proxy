import { Injectable } from '@nestjs/common';
import * as cluster from "cluster";
import { cpus } from "os";

/**
 * TODO: This really is just a custom provider with slightly twisted, semantics, albeit
 *       totally possible to realign those twists to be a Nest-compliant Provider.  Let's
 *       avoid reinventing a different kind of wheel and refactor this to work as a vanilla
 *       Provider!
 */
@Injectable()
export class WorkerPool implements Iterable<cluster.Worker>
{
   public* [Symbol.iterator](): Iterator<cluster.Worker>
   {
      const poolSize = cpus().length;
      let ii = 0;
      for (ii = 0; ii < poolSize; ii++) {
         const worker: cluster.Worker = cluster.fork();

         if (cluster.isMaster) {
            // to receive messages from worker process
            worker.on('message', function (message) {
               console.log('Master receives:', message);
            });
            console.log('All growded up!');

            yield worker;
         } else if (cluster.isWorker) {
            console.log('I cannot actually be here, can I!?!?!?');
            return;
         } else {
            console.log('What am I!?!?!?');
            return;
         }
      }
   }
}