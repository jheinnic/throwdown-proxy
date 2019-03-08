import {StringKeys} from 'simplytyped';

export enum BitStrategyKind
{
   base64ToAscii = 'base64ToAscii',
   get8From7 = 'get8From7',
   mod128 = 'mod128',
   mod160 = 'mod160',
   raw = 'raw'
}

export type BitStrategyType = StringKeys<BitStrategyKind>