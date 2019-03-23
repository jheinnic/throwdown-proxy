import { IsDefined, IsNotEmpty, Matches } from 'class-validator';

import { configClass, configProp } from '@jchptf/config';

@configClass('jchptf.paintGateway.seedToDir')
export class SeedToDirPath
{
   @configProp('dirRoot')
   @IsDefined()
   @IsNotEmpty()
   public readonly dirRoot: string = '';

   @configProp('hashAlgorithm')
   @IsDefined()
   @IsNotEmpty()
   public readonly hashAlgorithm: string = '';

   @configProp('bitsPerTier')
   @IsDefined()
   @IsNotEmpty()
   @Matches(/^[0-9]+(:[0-9]+)*$/)
   public readonly bitsPerTier = '';
}