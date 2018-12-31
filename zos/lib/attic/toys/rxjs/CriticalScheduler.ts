import {SchedulerLike} from 'rxjs';

export class CriticalScheduler implements SchedulerLike
{
   private counter: number;
   constructor(private readonly baseScheduler: SchedulerLike)
   {
      this.counter = 0;
   }

   now() {
      return this.baseScheduler.now();
   }

   schedule(work, delay, state)
   {
      console.log('I am really', this.baseScheduler);
      const timeClass = this.counter++;
      console.log('Before ' + timeClass);
      const newWork = {
         schedule(state, delay) {
            console.log('Action Before ' + timeClass);
            const retVal2 = work.schedule(state, delay);
            console.log('Action After ' + timeClass);
            return retVal2;
         }
      };
      const retVal = this.baseScheduler.schedule(work, delay, state);
      console.log('After ' + timeClass);
      return retVal;
   }
}
