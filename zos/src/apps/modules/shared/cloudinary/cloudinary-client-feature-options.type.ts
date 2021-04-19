import { DynamicModuleConfigTwo, IBaseConfigProps, IModule } from '@jchptf/nestjs';

import {
   CloudinaryModuleType, CloudinaryModuleId, CLOUDINARY_CREDENTIALS, CLOUDINARY_SERVER_CLIENT
} from './cloudinary.constants';

export type CloudinaryClientFeatureOptions<Consumer extends IModule> =
   DynamicModuleConfigTwo<
      CloudinaryModuleType,
      IBaseConfigProps<Consumer>,
      CloudinaryModuleId,
      typeof CLOUDINARY_CREDENTIALS,
      never,
      typeof CLOUDINARY_SERVER_CLIENT
   >;
