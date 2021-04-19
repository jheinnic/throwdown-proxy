import { blessLocalProviderToken, LocalProviderToken, MODULE_ID } from '@jchptf/nestjs';
import { CloudinaryV2 } from 'cloudinary';
import { ICloudinaryWriterConfig } from '../../roots/paint-gateway/follower/interface/model/deployed';

export const CLOUDINARY_MODULE = Symbol('@jchptf/cloudinary');
export type CLOUDINARY_MODULE = typeof CLOUDINARY_MODULE;

export const CLOUDINARY_SERVER_CLIENT = Symbol('CloudinaryV2');
export const CLOUDINARY_WRITER_CONFIG = Symbol('ICloudinaryWriterConfig');

export class CloudinaryModuleId {
   public static readonly [MODULE_ID] = CLOUDINARY_MODULE;

   [CLOUDINARY_SERVER_CLIENT]: CloudinaryV2;
   [CLOUDINARY_WRITER_CONFIG]: ICloudinaryWriterConfig;
}

export type CloudinaryModuleType = typeof CloudinaryModuleId;

function blessLocal<Token extends keyof CloudinaryModuleId>(token: Token):
   LocalProviderToken<CloudinaryModuleId[Token], CloudinaryModuleType, Token>
{
   return blessLocalProviderToken(token, CloudinaryModuleId);
}

export const CLOUDINARY_WRITER_CONFIG_PROVIDER_TOKEN = blessLocal(CLOUDINARY_WRITER_CONFIG);
export const CLOUDINARY_SERVER_CLIENT_PROVIDER_TOKEN = blessLocal(CLOUDINARY_SERVER_CLIENT);
