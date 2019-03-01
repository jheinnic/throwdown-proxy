import {IPseudoRandomSource} from './pseudo-random-source.interface';

export interface IPseudoRandomSeedFactory
{
   seedNextSource(): Promise<IPseudoRandomSource>;
}
