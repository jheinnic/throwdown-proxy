declare module 'cloudinary'
{
   import 'cloudinary';
   import { Transform } from 'stream';

   export interface CloudinaryCredentials {
      cloud_name: string;
      api_key: string;
      api_secret: string;
   }

   export type FileFormat = 'jpg' | 'png';

   export type ResourceType = 'image' | 'video';

   export interface UploadResult {
      readonly public_id: string;
      readonly version: number;
      readonly signature: string;
      readonly width: number;
      readonly height: number;
      readonly format: FileFormat;
      readonly resource_type: ResourceType;
      readonly url: string;
      readonly secure_url: string;
   }

   export interface UploadOptions {
      public_id: string;
   }

   export interface Uploader {
      upload(
         source: string,
         options: any,
         callback: (err: any, result: UploadResult) => void): void;

      upload_stream(
         callback: (err: any, result: UploadResult) => void,
         options?: UploadOptions): Transform;
   }

   export interface CloudinaryV2 {
      config(credentials: CloudinaryCredentials): void;

      url(publicId: string): string;

      uploader: Uploader;
   }

   export const v2: CloudinaryV2;
}