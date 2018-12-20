import {Global, Module} from '@nestjs/common';
import {CO_TYPES, ConcurrentWorkFactory} from '@jchptf/coroutines';

@Global()
@Module({
   providers: [
      {
         provide: CO_TYPES.ConcurrentWorkFactory,
         useClass: ConcurrentWorkFactory
      }
   ],
   exports: [CO_TYPES.ConcurrentWorkFactory]
})
export class CoRoutinesSupportModule
{
}