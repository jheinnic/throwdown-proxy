import {
   CLOUDINARY_SERVER_CLIENT_PROVIDER_TOKEN, CloudinaryModuleType,
} from './cloudinary.constants';
import { DynamicProviderBindingStyle, IAsValue } from '@jchptf/nestjs';
import { CloudinaryV2, v2 as cloudinary } from 'cloudinary';

export const CLOUDINARY_SERVER_CLIENT_PROVIDER:
   IAsValue<CloudinaryV2, CloudinaryModuleType> = {
   style: DynamicProviderBindingStyle.VALUE,
   provide: CLOUDINARY_SERVER_CLIENT_PROVIDER_TOKEN,
   useValue: cloudinary,
}