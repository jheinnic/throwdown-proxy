import {IsIn, ValidateIf} from 'class-validator';
import {Type} from 'class-transformer';

import {IsDevelopmentOnly} from '../../infrastructure/validation';
import {configClass, configProp} from '@jchptf/config';
import {DevFakeOptions} from './dev-fake-options.config';
import {HmacDrbgOptions} from './hmac-drbg-options.config';
import {IsaacOptions} from './isaac-options.config';
import {NodeCryptoOptions} from './node-crypto-options.config';
import {RandomOrgOptions} from './random-org-options.config';


@configClass()
export class EntropyAlgorithmSelection
{
   @configProp('algorithm')
   @IsIn(['devFakeKey', 'hmacDrbg', 'randomOrg', 'nodeCrypto', 'isaac'])
   readonly algorithm: string = '';

   @configProp('devFakeKey')
   @ValidateIf((obj: EntropyAlgorithmSelection, _: any) => {
      return obj.algorithm === 'devFakeKey';
   })
   @IsDevelopmentOnly()
   @Type(() => DevFakeOptions)
   devFakeKey: DevFakeOptions = new DevFakeOptions();

   @configProp('hmacDrbg')
   @ValidateIf((obj: EntropyAlgorithmSelection, _: any) => {
      return obj.algorithm === 'hmacDrbg';
   })
   @Type(() => HmacDrbgOptions)
   hmacDrbg: HmacDrbgOptions = new HmacDrbgOptions();

   @configProp('isaac')
   @ValidateIf((obj: EntropyAlgorithmSelection, _: any) => {
      return obj.algorithm === 'isaac';
   })
   @Type(() => IsaacOptions)
   isaac: IsaacOptions = new IsaacOptions();

   @configProp('nodeCrypto')
   @ValidateIf((obj: EntropyAlgorithmSelection, _: any) => {
      return obj.algorithm === 'nodeCrypto';
   })
   @Type(() => NodeCryptoOptions)
   nodeCrypto: NodeCryptoOptions = new NodeCryptoOptions();

   @configProp('randomOrg')
   @ValidateIf((obj: EntropyAlgorithmSelection, _: any) => {
      return obj.algorithm === 'hmacDrbg';
   })
   @Type(() => RandomOrgOptions)
   randomOrg: RandomOrgOptions = new RandomOrgOptions();
}