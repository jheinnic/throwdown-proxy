import {LoadSourceStrategy} from '../../../../src/infrastructure/lib/semaphore/di/config/resource-pool.module-config';

@Module({
  imports: [
     CoRoutinesSupportModule,
     ResourcePoolModule.forRoot({
        name: 'FourHundredSquared',
        loadStrategy: LoadSourceStrategy.EAGER_FIXED_ITERABLE,
        source: [
           new Canvas(400, 400), new Canvas(400, 400),
           new Canvas(400, 400), new Canvas(400, 400)
        ],
     }
     )
  ]
})