import {CoroutinesModule} from '@jchptf/coroutines';
import {LoadResourcePoolStrategy, ResourceSemaphoreModule} from '@jchptf/semaphore';
import {Canvas} from 'canvas';

@Module({
   imports: [
      CoroutinesModule,
      ResourceSemaphoreModule.forRoot({
            name: 'FourHundredSquare',
            loadStrategy: LoadResourcePoolStrategy.EAGER_FIXED_ITERABLE,
            resources: [
               new Canvas(400, 400), new Canvas(400, 400),
               new Canvas(400, 400), new Canvas(400, 400)
            ],
         }
      )
   ]
})
export class ApplicationModule
{ }
