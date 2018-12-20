import {Module} from '@nestjs/common';
import {CoRoutinesSupportModule} from '../../infrastructure/lib/semaphore/di/coroutines-support.module';
import {ResourceSemaphoreModule} from '../../infrastructure/lib/semaphore/di/resource-semaphore.module';
import {Canvas} from 'canvas';
import {LoadResourcePoolStrategy} from '../../infrastructure/lib/semaphore/interfaces/load-strategy-config.interface';

@Module({
   imports: [
      CoRoutinesSupportModule,
      ResourceSemaphoreModule.forRoot<Canvas>({
         name: 'FourSquare',
         loadStrategy: LoadResourcePoolStrategy.EAGER_FIXED_ITERABLE,
         resources: [
            new Canvas(400, 400), new Canvas(400, 400), new Canvas(400, 400), new Canvas(400, 400),
            new Canvas(400, 400), new Canvas(400, 400), new Canvas(400, 400), new Canvas(400, 400),
            new Canvas(400, 400), new Canvas(400, 400), new Canvas(400, 400), new Canvas(400, 400),
            new Canvas(400, 400), new Canvas(400, 400), new Canvas(400, 400), new Canvas(400, 400),
         ]
      })
   ]
})
export class ApplicationModule {

}