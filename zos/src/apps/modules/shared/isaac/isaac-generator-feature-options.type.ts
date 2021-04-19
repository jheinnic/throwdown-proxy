import { DynamicModuleConfigTwo, IBaseConfigProps, IModule } from '@jchptf/nestjs';

import {
   IsaacModuleType, IsaacModuleId, ISAAC_SEED_BUFFER, ISAAC_GENERATOR
} from './isaac.constants';

export type IsaacGeneratorFeatureOptions<Consumer extends IModule> =
   DynamicModuleConfigTwo<
      IsaacModuleType,
      IBaseConfigProps<Consumer>,
      IsaacModuleId,
      typeof ISAAC_SEED_BUFFER,
      never,
      typeof ISAAC_GENERATOR
   >;
