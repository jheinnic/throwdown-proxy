import {Matches} from 'class-validator';

import {configClass, configProp} from '@jchptf/config';


@configClass('eth.lotto.eventSetup.keySource') // "eth.lotto.eventSpec")
export class KeySource
{
   @configProp('mnemonic')
   @Matches(/^([a-z]+ ){11}[a-z]+$/)
   public readonly mnemonic: string = '';

   @configProp('key')
   @Matches(/^xprv[A-Za-z0-9]+$/)
   public readonly key: string = '';

   @configProp('path')
   @Matches(/^m(\/\d+'?)+$/)
   public readonly path: string = '';
}