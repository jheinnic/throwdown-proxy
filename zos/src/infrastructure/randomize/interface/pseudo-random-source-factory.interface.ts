import {IPseudoRandomSource} from './pseudo-random-source.interface';

export interface IPseudoRandomSourceFactory<S>
{
   seedGenerator(seedSource: S): IPseudoRandomSource;
}
