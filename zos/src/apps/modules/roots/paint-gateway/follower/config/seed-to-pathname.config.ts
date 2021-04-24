import { ArrayMinSize, IsDefined, IsIn, IsPositive } from 'class-validator';

import { configClass, configProp } from '@jchptf/config';

@configClass('jchptf.paintGateway.seedToDir')
export class SeedToFilePath
{
   @configProp('hashAlgorithm')
   @IsDefined()
   @IsIn(['md5', 'sha256', 'ripemd160', 'sha1', 'whirlpool'])
   public readonly hashAlgorithm: 'md5' | 'sha256' | 'ripemd160' | 'sha1' | 'whirlpool' = 'md5';

   @configProp('bitsPerTier')
   @IsDefined()
   @ArrayMinSize(1)
   @IsPositive({each: true})
   public readonly bitsPerTier: ReadonlyArray<number> = [];

   @configProp('fileNameEncoding')
   @IsDefined()
   @IsIn(['ascii', 'base64', 'hex', 'utf8'])
   public readonly fileNameEncoding: 'ascii' | 'base64' | 'hex' | 'utf8' = 'base64';

   @configProp('fileNameSeparator')
   @IsDefined()
   @IsIn(['_', '-', ':'])
   public readonly fileNameSeparator: '_' | '-' | ':' = '_';

   @configProp('prefixFirst')
   @IsDefined()
   public readonly prefixFirst: boolean = false;
}